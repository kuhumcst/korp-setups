# -*- coding: utf-8 -*-

"""
The main module for exporting Korp search results to downloadable formats.

It should generally be sufficient to call func:`make_download_file` to
generate downloadable file contents.

:Author: Jyrki Niemi <jyrki.niemi@helsinki.fi> for FIN-CLARIN
:Date: 2014
"""




import importlib  #
import os.path
import time
import pkgutil
import json
import urllib.request, urllib.parse, urllib.error, urllib.request, urllib.error, urllib.parse
import re
import logging

from subprocess import Popen, PIPE
from collections import defaultdict

import korpexport.queryresult as qr


__all__ = ['make_download_file',
           'KorpExportError',
           'KorpExporter']


def make_download_file(form, korp_server_url, **kwargs):
    """Format Korp query results and return them in a downloadable format.

    Arguments:
        form (dict): Input form containing CGI (query string)
            parameters
        korp_server_url (str): Korp server URL

    Keyword arguments:
        **kwargs: Passed to class:`KorpExporter` constructor and its
            method:`make_download_file`

    Returns:
        dict: The downloadable file content and meta information;
            contains the following information (strings):

            - download_content: The actual file content
            - download_charset: The character encoding of the file
              content
            - download_content_type: MIME type for the content
            - download_filename: Name of the file
    """
    exporter = KorpExporter(form, **kwargs)
    return exporter.make_download_file(korp_server_url, **kwargs)


def _decode_list_param(str_list, alt_delim=None):
    """Decode a list-valued parameter str_list into a list of strings by
    splitting at QUERY_DELIM (comma) and the characters in alt_delim
    (QUERY_DELIM_ALT by default). Also expand one level of common
    prefixes with suffixes marked with parentheses: LAM_A(HLA,NTR) ->
    LAM_AHLA,LAM_ANTR (nesting parentheses is not allowed).
    """
    # This function is slightly modified from decode_list_param in
    # korp.cgi. It would probably be better to have a single function
    # in a utility module.
    QUERY_DELIM = ","
    QUERY_DELIM_ALT = "."
    if alt_delim is None:
        alt_delim = QUERY_DELIM_ALT
    if alt_delim:
        split_val = re.split(r"[" + QUERY_DELIM + alt_delim + r"]",
                             str_list)
    else:
        split_val = str_list.split(QUERY_DELIM)
    result = []
    prefix = ""
    for elem in split_val:
        mo = re.match(r"^([^()]*)([()])?(.*)$", elem)
        pref, sep, suff = mo.groups()
        if sep == "(":
            # new_prefix(suffix
            prefix = pref
            result.append(prefix + suff)
        elif sep == ')':
            # last_suffix)
            result.append(prefix + pref)
            prefix = ""
        else:
            # Neither ( nor )
            result.append(prefix + pref)
    return result


class KorpExportError(Exception):

    """An exception class for errors in exporting Korp query results."""

    pass


class KorpExporter(object):

    """A class for exporting Korp query results to a downloadable file."""

    _FORMATTER_SUBPACKAGE = "format"
    """The `korpexport` subpackage containing actual formatter modules"""

    _filename_format_default = "korp_kwic_{cqpwords:.60}_{date}_{time}{ext}"
    """Default filename format"""

    _ENCODED_LIST_QUERY_PARAMS = [
        "corpus",
        "show",
        "show_struct",
        "context",
        "within",
    ]
    """List-valued query parameters that may have been prefix-encoded"""

    _RENAME_QUERY_PARAMS = [
        ("default_context", "defaultcontext"),
        ("default_within", "defaultwithin"),
    ]
    """List of query parameters to rename (original, renamed), so that
       korp_download.cgi can be called with Korp 8 parameters, even if
       it calls Korp 2.8."""

    def __init__(self, form, options=None, filename_format=None,
                 filename_encoding="utf-8", **kwargs):
        """Construct a KorpExporter.

        Arguments:
            form (dict): CGI (query string) parameters

        Keyword arguments:
            options (dict): Options passed to formatter
            filename_format (unicode): A format specification for the
                resulting filename; may contain the following format
                keys: cqpwords, start, end, date, time, ext
            filename_encoding (str): The encoding to use for the
                filename
        """
        self._form = form
        self._filename_format = (filename_format
                                 or form.get("filename_format")
                                 or self._filename_format_default)
        self._filename_encoding = filename_encoding
        self._opts = options or {}
        self._query_params = {}
        self._query_result = None
        self._formatter = None

    def make_download_file(self, korp_server_url, **kwargs):
        """Format query results and return them in a downloadable format.

        Arguments:
            korp_server_url (str): The Korp server to query

        Keyword arguments:
            form (dict): Use the parameters in here instead of those
                provided to the constructor
            **kwargs: Passed on to formatter

        Returns:
            dict: As described above in :func:`make_download_file`
        """
        result = {}
        if "form" in kwargs:
            self._form = kwargs["form"]
        self._formatter = self._formatter or self._get_formatter(**kwargs)
        self.process_query(korp_server_url)
        self._add_corpus_info(korp_server_url, self._query_result)
        logging.debug('qr: %s', self._query_result)
        if "ERROR" in self._query_result:
            return self._query_result
        logging.debug('formatter: %s', self._formatter)
        result["download_charset"] = self._formatter.download_charset
        content = self._formatter.make_download_content(
            self._query_result, self._query_params, self._opts, **kwargs)
        if isinstance(content, str) and self._formatter.download_charset:
            content = content.encode(self._formatter.download_charset)
        result["download_content"] = content
        result["download_content_type"] = self._formatter.mime_type
        result["download_filename"] = self._get_filename()
        logging.debug('make_download_file result: %s', result)
        return result

    def _get_formatter(self, **kwargs):
        """Get a formatter instance for the format specified in self._form.

        Keyword arguments:
            **kwargs: Passed to formatter constructor; "options"
                override the options passed to exporter constructor

        Returns:
            An instance of a korpexport.KorpExportFormatter subclass
        """
        format_name = self._form.get("format", "json").lower()
        subformat_names = self._form.get("subformat", [])
        if subformat_names:
            subformat_names = subformat_names.split(",")
        formatter_class = self._get_formatter_class(format_name)
        # Options passed to _get_formatter() override those passed to
        # the KorpExporter constructor
        opts = {}
        opts.update(self._opts)
        opts.update(kwargs.get("options", {}))
        kwargs["format"] = format_name
        kwargs["subformat"] = subformat_names
        kwargs["options"] = opts
        return formatter_class(**kwargs)

    def _get_formatter_class(self, format_names):
        """Get or construct a formatter class for the specified format.

        Arguments:
            format_names: Either a list of format name strings or a
                single string containing possibly several format names
                separated by a comma, semicolon, plus or space

        Returns:
            class: The formatter class for `format_names`.

        Raises:
            KorpExportError: If no formatter found for one of
                `format_names`

        For a single format name, returns the class as returned by
        method:`_find_formatter_class`. For multiple format names,
        finds the classes for each format and constructs a new class
        inheriting from each of them. The inheritance order is the
        reverse of the format names, so that the first format name can
        be considered as the main format which the subsequent formats
        may modify. For example, the main format may be a logical
        content format, for which the second format specifies a
        concrete representation: for example, a token per line content
        format represented as comma-separated values.
        """
        if isinstance(format_names, str):
            format_names = re.split(r"[,;+\s]+", format_names)
        if len(format_names) == 1:
            return self._find_formatter_class(format_names[0])
        else:
            format_names.reverse()
            base_classes = []
            # Find the base classes for the formatter class to be
            # constructed
            for format_name in format_names:
                base_classes.append(self._find_formatter_class(format_name))
            classname = "_" + "_".join(cls.__name__ for cls in base_classes)
            # First construct the class object (without methods), so
            # that we can refer to it in super() in the __init__()
            # method
            formatter_class = type(classname, tuple(base_classes), {})

            # Then define the function to be added as an __init__ method
            def __init__(self, **kwargs):
                super(formatter_class, self).__init__(**kwargs)

            # And finally add it to the formatter class as __init__
            setattr(formatter_class, "__init__", __init__)
            return formatter_class

    def _find_formatter_class(self, format_name):
        """Find a formatter class for the specified format.

        Arguments:
            format_name: The name of the format for which to find a
                formatter class

        Returns:
            class: The formatter class for `format_name`

        Raises:
            KorpExportError: If no formatter found for `format_name`

        Searches for a formatter in the classes of
        package:`korpexport.format` modules, and returns the first
        whose `format` attribute contains `format_name`.
        """
        pkgpath = os.path.join(os.path.dirname(__file__),
                               self._FORMATTER_SUBPACKAGE)

        for _, module_name, _ in pkgutil.iter_modules([pkgpath]):
            module_pth = self._FORMATTER_SUBPACKAGE + "." + module_name
            module_pth = 'korpexport.' + module_pth  # TODO Temporary hack!
            try:
                #subpkg = __import__(module_pth, globals())  #
                module = importlib.import_module(module_pth)
            except ImportError as e:
                print('ImportError:', module_pth)
                continue
            #module = getattr(subpkg, module_name)  #
            for name in dir(module):
                try:
                    module_class = getattr(module, name)
                    if format_name in module_class.formats:
                        return module_class
                except AttributeError as e:
                    pass
        raise KorpExportError("No formatter found for format '{0}'"
                              .format(format_name))

    def process_query(self, korp_server_url, query_params=None):
        """Get the query result in form or perform query via a Korp server.

        Arguments:
            korp_server_url (str): The Korp server to query
            query_params (dict): Korp query parameters

        If `self._form` contains `query_result`, use it. Otherwise use
        the result obtained by performing a query to the Korp server
        at `korp_server_url`. The query parameters are retrieved from
        argument `query_params`, form field `query_params` (as JSON)
        or the form as a whole.

        Set a private attribute to contain the result, a dictionary
        converted from the JSON returned by Korp.
        """
        if "query_result" in self._form:
            query_result_json = self._form.get("query_result", "{}")
        else:
            if query_params:
                self._query_params = query_params
            elif "query_params" in self._form:
                self._query_params = json.loads(self._form.get("query_params"))
            else:
                self._query_params = self._form
            self._rename_query_params()
            self._decode_query_params()
            if "debug" in self._form and "debug" not in self._query_params:
                self._query_params["debug"] = self._form["debug"]
            # If the format uses structural information, add the
            # structs in param "show_struct" to "show", so that tokens
            # are associated with information on opening and closing
            # those structures. Param "show_struct" only gives us
            # struct attribute values for a whole sentence.
            if (self._formatter.structured_format
                and self._query_params.get("show_struct")):
                if self._query_params.get("show"):
                    self._query_params["show"] += (
                        "," + self._query_params["show_struct"])
                else:
                    self._query_params["show"] = self._query_params["show_struct"]
            logging.debug("query_params: %s", self._query_params)
            query_result_json = self._query_korp_server(korp_server_url)
            # Support "sort" in format params even if not specified
            if "sort" not in self._query_params:
                self._query_params["sort"] = "none"
        self._query_result = json.loads(query_result_json)
        logging.debug("query result: %s", self._query_result)
        if "ERROR" in self._query_result or "kwic" not in self._query_result:
            return
        self._opts = self._extract_options(korp_server_url)
        logging.debug("opts: %s", self._opts)

    def _rename_query_params(self):
        for (orig, renamed) in self._RENAME_QUERY_PARAMS:
            if orig in self._query_params:
                self._query_params[renamed] = self._query_params[orig]

    def _decode_query_params(self):
        for paramname in self._ENCODED_LIST_QUERY_PARAMS:
            if paramname in self._query_params:
                self._query_params[paramname] = ",".join(_decode_list_param(
                    self._query_params[paramname]))

    def _query_korp_server(self, url_or_progname, query_params=None):
        """Query a Korp server, either via HTTP or as a subprocess.

        Arguments:
            url_or_progname (str): Korp server URL or program name
            query_params (dict): The query parameters to pass to the
                Korp server; if not specified or `None`, use
                self._query_params

        Returns:
            str: The value returned by the Korp server, most probably
                an object encoded in JSON

        If `url_or_progname` begins with "http", make a query via
        HTTP. Otherwise assume it as program name and call it directly
        as a subprocess but make it believe that it is run via CGI.
        The latter approach passes the environment variable values of
        this script to the Korp server, so it gets e.g. the Sibboleth
        authentication information. (Could the authentication
        information be passed when using HTTP by adding appropriate
        request headers?)
        """

        def adjust_path(name_src, ref_name_src, ref_name_dst):
            """Make a name that is to name_src as ref_name_dst is to
            ref_name_src."""
            # FIXME: This works only if path separator is a slash
            src_common_prefix = os.path.commonprefix([name_src, ref_name_src])
            ref_name_suffix_len = len(ref_name_src) - len(src_common_prefix)
            name_suffix_len = len(name_src) - len(src_common_prefix)
            return (ref_name_dst[:-ref_name_suffix_len]
                    + name_src[-name_suffix_len:])

        if query_params is None:
            query_params = self._query_params
        loginfo_text = "client=korp_download_kwic"
        if "loginfo" in query_params:
            query_params["loginfo"] += " " + loginfo_text
        else:
            query_params["loginfo"] = loginfo_text
        # Encode the query parameters in UTF-8 for Korp server
        logging.debug("Korp server: %s", url_or_progname)
        logging.debug("Korp query params: %s", query_params)
        query_params_encoded = urllib.parse.urlencode(
            dict((key, val.encode("utf-8"))
                 for key, val in query_params.items()))
        logging.debug("Encoded query params: %s", query_params_encoded)
        logging.debug("Env: %s", os.environ)
        if url_or_progname.startswith("http"):
            return urllib.request.urlopen(url_or_progname, query_params_encoded).read()
        else:
            env = {}
            # Pass the environment of this scropt appropriately
            # modified, so that Korp server script thinks it is run
            # via CGI.
            env.update(os.environ)
            # Adjusting the script names is perhaps not necessary but
            # we do it for completeness sake.
            script_name = adjust_path(
                url_or_progname, env.get("SCRIPT_FILENAME", ""),
                env.get("SCRIPT_NAME", ""))
            env.update(
                {"SCRIPT_FILENAME": url_or_progname,
                 "SCRIPT_NAME": script_name,
                 "REQUEST_URI": script_name,
                 "REQUEST_METHOD": "POST",
                 "QUERY_STRING": "",
                 "CONTENT_TYPE": "application/x-www-form-urlencoded",
                 "CONTENT_LENGTH": str(len(query_params_encoded))})
            logging.debug("Env modified: %s", env)
            p = Popen(url_or_progname, stdin=PIPE, stdout=PIPE, env=env)
            output = p.communicate(query_params_encoded)[0]
            logging.debug("Korp server output: %s", output)
            # Remove HTTP headers from the result
            return re.sub(r"(?s)^.*?\n\n", "", output, count=1)

    def _extract_options(self, korp_server_url=None):
        """Extract formatting options from form, affected by query params.

        Arguments:
            korp_server_url: The default Korp server URL; may be
                overridden by options on the form.

        Returns:
            dict: The extracted options.

        Extract options from the form: take the values of all
        parameters for which `_default_options` contains an option
        with the same name.

        In addition, the values of the CGI parameters `attrs` and
        `structs` control the attributes and structures to be shown in
        the result. Their values may be comma-separated lists of the
        following:

        - attribute or structure names;
        - ``*`` for those listed in the corresponding query parameter
          (`show` or `show_struct`);
        - ``+`` for all of those that actually occur in the
          corresponding query result structure; and
        - ``-attr`` for excluding the attribute or structure ``attr``
          (used following ``*`` or ``+``).
        """
        opts = {}

        def extract_show_opt(opt_name, query_param_name,
                             query_result_struct_name):
            """Set the show option opt_name based on query params and result.
            """
            if opt_name in self._form:
                vals = self._form.get(opt_name, "").split(",")
                new_vals = []
                for valnum, val in enumerate(vals):
                    if val in ["*", "+"]:
                        all_vals = (
                            self._query_params.get(query_param_name, "")
                            .split(","))
                        if val == "+":
                            add_vals = qr.get_occurring_attrnames(
                                self._query_result, all_vals,
                                query_result_struct_name)
                        else:
                            add_vals = all_vals
                        new_vals.extend(add_vals)
                    elif val.startswith("-"):
                        valname = val[1:]
                        if valname in new_vals:
                            new_vals.remove(valname)
                    else:
                        new_vals.append(val)
                opts[opt_name] = new_vals

        extract_show_opt("attrs", "show", "tokens")
        extract_show_opt("structs", "show_struct", "structs")
        for opt_name, default_val in self._formatter.get_options().items():
            opts[opt_name] = self._form.get(opt_name, default_val)
        if self._form.get("korp_url"):
            opts["korp_url"] = self._form.get("korp_url")
        # FIXME: This does not make sense to the user if
        # korp_server_url uses localhost.
        opts["korp_server_url"] = (korp_server_url
                                   or self._form.get("korp_server_url", ""))
        return opts

    def _add_corpus_info(self, korp_server_url, query_result):
        """Add information on the corpora to the query result.

        Retrieve info for each corpus in `query_result` from the form
        or from the Korp server `korp_server_url` and add the
        information as ``corpus_info`` to each hit in `query_result`.
        Also add ``corpus_config`` to each hit if available.
        """
        self._retrieve_corpus_info(korp_server_url)
        for query_hit in query_result["kwic"]:
            corpname = query_hit["corpus"].partition("|")[0].lower()
            query_hit["corpus_info"] = self._corpus_info.get(corpname)
            if self._corpus_config:
                query_hit["corpus_config"] = self._corpus_config[corpname]

    def _retrieve_corpus_info(self, korp_server_url):
        """Retrieve corpus info from the form or from a Korp server.

        Retrieve corpus information and configuration first from
        `self._form` and then (for the corpus info only) from the Korp
        server `korp_server_url` (overriding the values on the form),
        and fill `self._corpus_info` and `self._corpus_config` with
        them, corpus names as keys.

        For the corpus information on the form, the form parameter
        ``corpus_info`` is preferred; if not available, use values in
        ``corpus_config``. These parameters need to be encoded in
        JSON.
        """
        self._corpus_info = defaultdict(dict)
        self._corpus_config = {}
        if "corpus_info" in self._form:
            self._corpus_info = json.loads(self._form["corpus_info"])
        elif "corpus_config" in self._form:
            self._corpus_config = json.loads(self._form["corpus_config"])
            self._corpus_info = dict(
                [(corpname.lower(), config.get("info"))
                 for corpname, config in self._corpus_config.items()])
            self._add_corpus_info_from_config()
        self._retrieve_corpus_info_from_server(korp_server_url)

    def _add_corpus_info_from_config(self):
        """Add corpus info items from corpus configuration information.

        Fill in `self._corpus_info` based on the values in
        `self._corpus_config` whose keys are specified by the form
        parameter ``corpus_config_info_keys`` or end in ``urn`` or
        ``url``. ``corpus_config_info_keys`` should be a string of
        comma-separated values.
        """
        config_info_items = (
            self._form["corpus_config_info_keys"].split(",")
            if "corpus_config_info_keys" in self._form
            else [])
        for corpname, config in self._corpus_config.items():
            corpname = corpname.lower()
            for confkey, confval in config.items():
                confkey = confkey.lower()
                if (confkey in ["urn", "url"] or confkey.endswith("_urn")
                    or confkey.endswith("_url")):
                    self._add_corpus_info_item(corpname, confkey, confval)
                elif confkey in config_info_items:
                    for subkey, subval in confval.items():
                        self._add_corpus_info_item(
                            corpname, confkey + "_" + subkey, subval)

    def _add_corpus_info_item(self, corpname, infoname, infovalue):
        """Add a corpus info item to `self._corpus_info`.

        Add to `self._corpus_info` for corpus `corpname` the
        information item `infoname` with value `infovalue`. If
        `infoname` contains an underscore, split the name at it and
        use the first part as the name of a substructure (`dict`)
        containing the second part as a key. `infoname` is lowercased.
        """
        infoname = infoname.lower()
        subinfoname = None
        if "_" in infoname:
            infoname, _, subinfoname = infoname.partition("_")
        if infoname not in self._corpus_info.setdefault(corpname, {}):
            self._corpus_info[corpname][infoname] = (
                {} if subinfoname else infovalue)
        if subinfoname:
            self._corpus_info[corpname][infoname][subinfoname] = infovalue

    def _retrieve_corpus_info_from_server(self, korp_server_url):
        """Retrieve corpus info from the server `korp_server_url`.

        Use the Korp server command `´info´´ to retrieve information
        available in the backend for all the corpora in the query
        results to be exported.
        """
        corpora = self._get_corpus_names()
        if not corpora:
            return
        korp_info_params = {'command': 'info',
                            'corpus': ','.join(corpora)}
        #korp_corpus_info_json = self._query_korp_server(korp_server_url,
        #                                                korp_info_params)  #
        korp_corpus_info_json = '{}'  # TODO Temporary hack: Override info from server.
        korp_corpus_info = json.loads(korp_corpus_info_json)
        for corpname, corpdata in (iter(korp_corpus_info.get("corpora", {}).items())):
            corpname = corpname.lower()
            corpinfo = corpdata.get("info", {})
            for infoname, infoval in corpinfo.items():
                self._add_corpus_info_item(corpname, infoname, infoval)

    def _get_corpus_names(self):
        """Return the names (ids) of corpora present in the query results.

        For parallel corpora, return all the names (ids) of all
        aligned corpora.
        """
        return set([corpname
                    for corpus_hit in self._query_result.get("kwic", [])
                    for corpname in corpus_hit["corpus"].split("|")])

    def _get_filename(self):
        """Return the filename for the result, from form or formatted.

        If the form contains parameter `filename`, return it;
        otherwise format using `self._filename_format`. The filename
        format may contain the following keys (specified as
        ``{key}``):

        - date: Current date in *yyyymmdd* format
        - time: Current time in *hhmmss* format
        - ext: Filename extension, including the period
        - cqpwords: The words in the CQP query for the Korp result to
          be exported
        - start: The number of the first result
        - end: The number of the last result
        """
        # FIXME: Get a time first and then format it, to avoid the
        # unlikely possibility of date changing between formatting the
        # date and time.
        # TODO: User-specified date and time formatting
        return (self._form.get(
                "filename",
                self._filename_format.format(
                    date=time.strftime("%Y%m%d"),
                    time=time.strftime("%H%M%S"),
                    ext=self._formatter.filename_extension,
                    cqpwords=self._make_cqp_filename_repr(),
                    start=self._query_params.get("start", ""),
                    end=self._query_params.get("end", "")))
                .encode(self._filename_encoding))

    def _make_cqp_filename_repr(self, attrs=False, keep_chars=None,
                                replace_char='_'):
        """Make a representation of the CQP query for the filename

        Arguments:
            attrs (bool): Whether to include attribute names in the
                result (unimplemented)
            keep_chars (str): The (punctuation) characters to retain
                in the CQP query
            replace_char (str): The character with which to replace
                characters removed from the CQP query

        Returns:
            unicode: A representation of the CQP query 
        """
        # TODO: If attrs is True, include attribute names. Could we
        # encode somehow the operator which could be != or contains?
        words = re.findall(r'\"((?:[^\\\"]|\\.)*?)\"',
                           self._query_params.get("cqp", ""))
        replace_chars_re = re.compile(
            r'[^\w' + re.escape(keep_chars or "") + ']+', re.UNICODE)
        return replace_char.join(replace_chars_re.sub(replace_char, word)
                                 for word in words)


# For testing: find formatter class for format "json".

if __name__ == "__main__":
    print(KorpExporter._find_formatter_class('json'))
