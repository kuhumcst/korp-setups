# -*- coding: utf-8 -*-

"""
Module containing a base class for Korp search result formatters.

This module contains :class:`KorpExportFormatter`, which implements
basic formatting of Korp query results. The class should be subclassed
for actual export formats; please see the class documentation for more
information.

:Author: Jyrki Niemi <jyrki.niemi@helsinki.fi> for FIN-CLARIN
:Date: 2014
"""




import time
import string
import re

import korpexport.queryresult as qr

__all__ = ["KorpExportFormatter"]


class _PartialStringFormatter(string.Formatter):

    """
    A string formatter handling missing keys.

    A string formatter that outputs an empty (or other specified)
    string when a format key would cause a `KeyError` or
    `AttributeError`.

    Adapted from
    http://stackoverflow.com/questions/20248355/how-to-get-python-to-gracefully-format-none-and-non-existing-fields
    https://gist.github.com/navarroj/7689682
    """

    def __init__(self, missing="", **kwargs):
        self.missing = missing

    def get_field(self, field_name, args, kwargs):
        # Handle missing fields
        try:
            return super(_PartialStringFormatter, self).get_field(
                field_name, args, kwargs)
        except (KeyError, AttributeError):
            return None, field_name

    def format_field(self, value, spec):
        if value is None:
            return self.missing
        else:
            return super(_PartialStringFormatter, self).format_field(
                value, spec)


class _LazyStringFormatter(string.Formatter):

    """
    A string formatter allowing lazy evaluation of arguments via functions.

    A string formatter that allows a kind of a lazy evaluation of
    format arguments: if a format argument is a function, it is called
    (without arguments) to get the actual value. If a value is not
    referred to in the format string, the corresponding function is
    not called.
    """

    def __init__(self, **kwargs):
        super(_LazyStringFormatter, self).__init__(**kwargs)
        # self._value_cache = {}

    def get_value(self, key, args, kwargs):
        value = super(_LazyStringFormatter, self).get_value(key, args, kwargs)
        if callable(value):
            value = value()
            # # The function value might be cached, so that format
            # # references like {a[1]} and {a[2]} would only need a
            # # single call to evaluate a.
            # if value not in self._value_cache:
            #     self._value_cache[value] = value()
            # value = self._value_cache[value]
        return value


class _LazyPartialStringFormatter(_PartialStringFormatter,
                                  _LazyStringFormatter):

    """
    A string formatter handling missing keys and allowing lazy evaluation.

    A string formatter combining the formatters handling missing keys
    and allowing lazy evaluation with functions.
    """

    def __init__(self, **kwargs):
        super(_LazyPartialStringFormatter, self).__init__(**kwargs)

    def format_field(self, value, spec):
        if callable(value):
            value = value()
        return super(_LazyPartialStringFormatter, self).format_field(
            value, spec)


class KorpExportFormatter(object):

    r"""
    The base class for formatting a Korp query result for export.

    This class needs to be subclassed for actual formats. The
    subclasses should override at least the following class
    attributes:

        formats (list[str]): The names or ids (in lowercase) of the
            formats that the class handles
        mime_type (str): The MIME type of the output file
        filename_extension (str): The extension (including the dot) of
            the output file name

    In addition, a subclass often overrides various values in the
    class attribute `_option_defaults` (dict). If a key in
    `_option_defaults` is not specified, the value from a superclass
    is used. Subclasses may also add options of their own. See below
    for the option keys.

    A subclass may also specify subformats (shorthands of a kind for
    groups of default option values overriding the format defaults) in
    the class attribute `_subformat_options` (dict), whose keys are
    subformat names and values dicts overriding the default option
    values for the format. If a subformat name is not specified, the
    value from a superclass is used, if any. Note that if a class and
    its superclass specify options for the same subformat, only the
    options specified in the subclass take effect, even if the
    superclass specified values for options that the subclass does
    not.

    A subclass may also need to override or extend some `_format_*`
    methods, in particular if the structure of the output file is
    complex. Most of the default `_format_*` methods use the string
    format strings specified in options (`_option_defaults` or
    overriden in an instance) to control the output format.

    All the formatting methods have a keyword argument dictionary
    (``kwargs`` or ``format_args``), whose contents is passed
    recursively to the methods formatting the subcomponents of a query
    result component (item). The keyword arguments can be used to pass
    additional arguments to formatting methods overridden or extended
    in a subclass.

    Another approach is to override the method `_format_content` and
    to implement a formatting machinery independent of the other
    `_format_*` methods and `_option_defaults`.

    The names of the `_format_*` methods begin with an underscore to
    indicate that they are not public, even though they are intended
    to be used or overridden by subclasses.

    The `_option_defaults` contains the following keys. Values are
    strings (`unicode`) unless otherwise specified. In `bool` options,
    the strings ``false``, ``off``, ``no``, ``0`` (case-insensitively)
    and the empty string are interpreted as `False`.

    Keys:
        list_valued_opts (list[str] | str): The names of options with
            values that can be lists of strings or strings of
            comma-separated items, to be converted to proper lists
        newline: The character sequence for a newline. This allows
            using \n for newline in format strings, and convert to the
            final only later. Use \r\n for DOS/Windows-style newlines
            for formats which need them.
        show_info (bool): Whether to show info about the query and
            results
        show_field_headings (bool): Whether to show field (column)
            headings
        content_format: Format string for the whole content
        infoitems_format: Format string for the query and results info
        infoitems (list[str] | str): The info items to show in the
            query and results info
        infoitem_labels (dict[str->str]): Mapping from info item names
            (as in `infoitems`) to possibly more human-readable labels
        infoitem_format: Format string for a single info item
        infoitem_sep: Separator of individual formatted info items
        title_format: Format string for the file "title"
        title: A "title" for the exported file
        date_format: A `strftime` format string for current date and
            time
        hitcount_format: Format string for the total number of hits
        params_format: Format string for query parameters as a whole
        params (list[str] | str): Names of the query parameters (as in
            the CGI query string) to show in the info
        param_labels (dict[str->str]): Mapping from query parameter
            names to more human-readable labels
        param_format: Format string for a single query parameter
        param_sep: Separator of individual formatted query parameters
        field_headings_format: Format string for field (column)
            headings
        sentence_format: Format string for a single sentence
        sentence_sep: Separator of individual sentences
        sentence_info_format: Format string for sentence info
        sentence_fields (list[str] | str): Names of the fields of
            sentences to be shown
        sentence_field_labels (dict[str->str]): Mapping from sentence
            field names to more human-readable labels
        sentence_field_format: Format string for a single sentence
            field
        sentence_field_sep: Separator of individual formatted sentence
            fields
        sentence_token_attrs (list[str] | str): Names of token
            attributes whose values can be listed as separate fields
            in sentences; for example, a field listing all the lemmas
            of a sentence
        corpus_info_format: Format string for corpus info associated
            with each sentence
        corpus_info_fields (list[str] | str): Names of the corpus info
            fields to be shown
        corpus_info_field_labels (dict[str->str]): Mapping from corpus
            info field names to more human-readable labels
        corpus_info_field_format: Format string for a single corpus
            info field
        corpus_info_field_sep: Separator of individual formatted
            corpus info fields
        aligned_format: Format string for an aligned sentence
        aligned_sep: Separator of formatted aligned sentences
        struct_format: Format string for a structural attribute
        struct_sep: Separator of individual formatted structural
            attributes
        token_format: Format string for a single token
        token_noattrs_format: Format string for a single token without
            (token) attributes
        token_attr_format: Format string for a token attribute
            formatted separately from the word form, for example in a
            sentence field listing all the lemmas
        token_sep: Separator of individual formatted tokens
        word_format: Format string for a word (word form)
        attr_only_format: Format string for a token attribute
           formatted separately from the word form; the result is used
           in token_attr_format
        token_fields (list[str] | str): Names of the fields (word and
            attributes) of a token to be shown
        token_field_labels (dict[str->str]): Mapping from token field
            names to more human-readable labels
        token_field_format: Format string for a single token field
        token_field_sep: Separator of individual formatted token
            fields
        attr_format: Format string for a token attribute
        attr_sep: Separator of individual formatted token attributes
        token_struct_open_format: Format string for an structural
            attribute opening immediately before a token
        token_struct_close_format: Format string for an structural
            attribute opening immediately after a token
        token_struct_open_sep: Separator of individual structural
            attributes opening immediately before a token
        token_struct_close_sep: Separator of individual structural
            attributes closing immediately after a token
        combine_token_structs (bool): Whether to combine structural
            attributes opening immediately before or closing
            immediately after a token, so that each structure (element
            in XML) is represented only once, with attributes and
            their values in a list. If false, use the Corpus Workbench
            representation: a structural attribute *elem*_*attr* for
            the attribute *attr* of element *elem*.
        match_open: The string with which to precede the match
        match_close: The string with which to follow the match
        match_marker: The string with which to mark a match (in a
            separate match field of a token)
    """

    formats = []
    """The names (ids) of the formats that the class handles."""
    download_charset = "utf-8"
    """The character encoding for the output file."""
    mime_type = "application/unknown"
    """The MIME type of the output file."""
    filename_extension = ""
    """The extension of the output file, inculding a possible dot."""
    # Is this needed any more?
    structured_format = False
    """Set to `True`, if the format uses struct open/close info in tokens."""

    # Default values for options; see the class docstring for
    # documentation
    # TODO: More consistent handling of list-valued items: format for
    # each item, their separator and a format for the whole list
    _option_defaults = {
        "list_valued_opts": [
            "infoitems",
            "params",
            "sentence_fields",
            "sentence_token_attrs",
            "corpus_info_fields",
            "token_fields"
            ],
        "newline": "\n",
        "show_info": "True",
        "show_field_headings": "True",
        "content_format": "{info}{sentence_field_headings}{sentences}",
        "infoitems_format": "{title}{infoitems}\n",
        "infoitems": "date,korp_url,params,hitcount",
        "infoitem_labels": {
            "date": "Date",
            "params": "Query parameters",
            "hitcount": "Total hits",
            "korp_url": "Korp URL",
            "korp_server_url": "Korp server URL"
            },
        "infoitem_format": "{label}:{sp_or_nl}{value}",
        "infoitem_sep": "\n",
        "title_format": "{title}\n",
        "title": "Korp search results",
        "date_format": "%Y-%m-%d %H:%M:%S",
        "hitcount_format": "{hitcount}",
        "params_format": "{params}",
        "params": "corpus,cqp,defaultcontext,defaultwithin,sort,start,end",
        "param_labels": {
            "corpus": "corpora",
            "cqp": "CQP query",
            "defaultcontext": "context",
            "defaultwithin": "within",
            "sort": "sorting"
            },
        "param_format": "{label}: {value}",
        "param_sep": "; ",
        "field_headings_format": "{field_headings}\n",
        "sentence_format": ("{info}: {left_context}"
                            "{match_open}{match}{match_close}"
                            "{right_context}\n"),
        "sentence_sep": "",
        "sentence_info_format": "{corpus} {match_pos}",
        "sentence_fields": "",
        "sentence_field_labels": {
            "match_pos": "match position",
            "left_context": "left context",
            "right_context": "right context",
            "aligned": "aligned text",
            "corpus_info": "corpus info",
            "urn": "URN",
            "licence_name": "licence",
            "licence_link": "licence link",
            "metadata_link": "metadata link",
            "hit_num": "hit number",
            "sentence_num": "sentence number",
            "korp_url": "Korp URL",
            "korp_server_url": "Korp server URL",
            "hitcount": "total hits",
            # The following pluralized forms would not be grammatical
            "spokens": "spoken forms",
            "originals": "original forms",
            "normalizeds": "normalized forms",
            },
        "sentence_field_format": "{value}",
        "sentence_field_sep": "",
        "sentence_token_attrs": "",
        "corpus_info_format": "{fields}",
        "corpus_info_fields": "",
        "corpus_info_field_labels": {
            "corpus_name": "corpus",
            "urn": "URN",
            "licence_name": "licence",
            "licence_link": "licence link",
            "metadata_link": "metadata link",
            },
        "corpus_info_field_format": "{value}",
        "corpus_info_field_sep": "",
        "aligned_format": "{sentence}",
        "aligned_sep": " | ",
        "struct_format": "{name}: {value}",
        "struct_sep": "; ",
        "token_format": "{match_open}{word}[{attrs}]{match_close}",
        "token_noattrs_format": "{match_open}{word}{match_close}",
        "token_attr_format": "{match_open}{attr}{match_close}",
        "token_sep": " ",
        "word_format": "{word}",
        "attr_only_format": "{value}",
        "token_fields": "word,*attrs",
        "token_field_labels": {
            "match_mark": "match"
            },
        "token_field_format": "{value}",
        "token_field_sep": ";",
        "attr_format": "{value}",
        "attr_sep": ";",
        "token_struct_open_format": "",
        "token_struct_close_format": "",
        "token_struct_open_sep": "",
        "token_struct_close_sep": "",
        "combine_token_structs": "False",
        "match_open": "",
        "match_close": "",
        "match_marker": "*",
        }
    """Default values for options; subclasses can override individually."""

    _subformats = {}
    """Option dictionaries for overriding defaults; subclasses can override."""

    _formatter = _LazyPartialStringFormatter(missing="[none]")
    """A string formatter: missing keys in formats shown as ``[none]``."""

    def __init__(self, **kwargs):
        """Construct a formatter instance.

        Construct a formatter instance for format `kwargs["format"]`,
        possibly with subformat(s) `kwargs["subformat"]. The options
        `kwargs["options"]` override the values in the class attribute
        `_option_defaults` for the instance attribute `_opts`.
        `kwargs["urn_resolver"]` contains the URN resolver to be
        prefixed to URNs to make them URLs. Other keyword arguments
        `kwargs` are currently ignored.

        Subclass constructors should call this constructor to ensure
        that all the relevant instance attributes are defined.
        """
        self._format_name = kwargs.get("format")
        self._subformat_names = kwargs.get("subformat", [])
        self._opts = {}
        self._opts.update(self._get_combined_values("_option_defaults"))
        subformat_opts = self._get_combined_values("_subformat_options")
        for subformat in self._subformat_names:
            self._opts.update(subformat_opts.get(subformat, {}))
        self._opts.update(kwargs.get("options", {}))
        self._urn_resolver = kwargs.get("urn_resolver", "")
        self._sentence_token_attrs = []
        self._sentence_token_attr_labels = {}
        self._query_params = {}
        self._query_result = {}
        self._corpus_info = {}

    @classmethod
    def _get_combined_values(cls, attrname):
        """Get `attrname` values also containing inherited values.

        The returned dict contains values of the class attribute
        `attrname` from all superclasses so that values from classes
        earlier in the MRO override values from those later.
        """
        combined_values = {}
        # Skip the last class in MRO, since it is `object`.
        for superclass in reversed(cls.__mro__[:-1]):
            try:
                combined_values.update(getattr(superclass, attrname))
            except AttributeError:
                pass
        return combined_values

    def get_options(self):
        """Get the options in effect (a dict)."""
        return self._opts

    def get_option_bool(self, optname):
        """Get the value of the Boolean option `optname`.

        String values ``false``, ``no``, ``off``, ``0``
        (case-insensitively) and the empty string are considered as
        `False`, other values as `True`.
        """
        # TODO: Allow the option to have a bool value in addition to a
        # str interpreted as a bool
        return (self._opts.get(optname, "").lower()
                not in ["false", "no", "off", "0", ""])

    def get_option_int(self, optname):
        """Get the value of the integer option `optname`.

        If the option value cannot be converted to an `int`, try the
        value in `_option_defaults`.
        """
        value = None
        try:
            value = int(self._opts.get(optname))
        except (ValueError, TypeError):
            try:
                value = int(self._option_defaults.get(optname))
            except (ValueError, TypeError):
                pass
        return value

    def make_download_content(self, query_result, query_params=None,
                              options=None, **kwargs):
        """Generate downloadable content from a Korp query result.

        Return downloadable file content from Korp query result
        `query_result`, given `query_params` and `options`. `options`
        overrides options given when constructing the class. The
        return value has newlines converted if necessary.
        """
        self._query_result = query_result
        self._query_params = query_params or {}
        self._opts.update(options or {})
        self._adjust_opts()
        self._init_sentence_token_attrs()
        self._init_infoitems()
        return self._convert_newlines(
            self._postprocess(self._format_content(**kwargs)))

    def _adjust_opts(self):
        """Adjust formatting options in effect.

        This method may be overridden or extended in subclasses.
        """
        self._make_opt_lists()

    def _make_opt_lists(self):
        """Convert comma-separated strings in list-valued options to lists."""

        def adjust_item(item):
            """Handle special markers in a list item.

            If `item` is of the form ``*name``, replace it with a list
            containing the items in the option ``name``; if `item` is
            of the form ``?name``, add ``name`` only if the
            information `item` is available for any corpus of the
            query result either in corpus information or as a sentence
            token attribute field (or for ``?aligned``, if the corpus
            is a parallel corpus). The return value is a list.
            """
            if item.startswith("*"):
                return self._opts.get(item[1:], [])
            elif item.startswith("?"):
                return [item[1:]] if info_is_available(item[1:]) else []
            else:
                return [item]

        def info_is_available(item):
            """Test if item is available corpus info or sentence token attr."""
            return (item in available_corpus_info
                    or sentence_token_attr_is_available(item))

        def sentence_token_attr_is_available(item):
            """Test if item is an avaialble sentence token attribute field."""
            # FIXME: This will not work correctly if the token
            # attribute name ends in an "e".
            mo = re.match(
                r'(.*?)e?s_(?:all|match|(?:left|right)_context)', item)
            return mo and qr.get_occurring_attrnames(self._query_result,
                                                     [mo.group(1)], 'tokens')

        available_corpus_info = qr.get_occurring_corpus_info(self._query_result)
        if "urn" in available_corpus_info or "url" in available_corpus_info:
            available_corpus_info.add("link")
        for linktype in ["licence", "metadata"]:
            if (linktype + "_urn" in available_corpus_info
                or linktype + "_url" in available_corpus_info):
                available_corpus_info.add(linktype + "_link")
        if qr.is_parallel_corpus(self._query_result):
            available_corpus_info.add("aligned")
        for item in ["korp_url", "korp_server_url"]:
            if item in self._opts:
                available_corpus_info.add(item)
        for optkey in self._opts.get("list_valued_opts", []):
            if isinstance(self._opts.get(optkey), str):
                if self._opts[optkey] == "":
                    self._opts[optkey] = []
                else:
                    self._opts[optkey] = self._opts.get(optkey, "").split(",")
                    adjusted_list = []
                    for item in self._opts[optkey]:
                        adjusted_list.extend(adjust_item(item))
                    self._opts[optkey] = adjusted_list

    def _init_sentence_token_attrs(self):
        """Initialize _sentence_token_attrs and _sentence_token_attr_labels.

        _sentence_token_attr_labels contains the labels that can be
        used for the sentence fields corresponding to the attributes
        listed in _sentence_token_attrs. The sentence field names
        contain the attribute name pluralized (ending in -s, or -es,
        if the field name ends in -s, -z, -sh or -ch).
        """
        self._sentence_token_attrs = self._opts.get("sentence_token_attrs", [])
        labels = self._opts["sentence_field_labels"]
        for attrname in self._sentence_token_attrs:
            label_base = attrname
            if re.search(r"([sz]|[cs]h)$", attrname):
                label_base += "e"
            label_base += "s"
            label_base_readable = labels.get(label_base, label_base)
            self._sentence_token_attr_labels[attrname] = label_base
            labels[label_base + "_all"] = label_base_readable
            for tokens_type in ["match", "left_context", "right_context"]:
                labels[label_base + "_" + tokens_type] = (
                    labels.get(tokens_type, tokens_type) + " "
                    + label_base_readable)

    def _init_infoitems(self):
        """Initialize query result info items used in several format methods.

        Initialize a dictionary for the following format keys (query
        and result info items) to be used in the format strings of
        several different components:

        ``params``: formatted query parameters as a list
        ``param``: a dictionary of unformatted query parameters
        ``date``: current date
        ``hitcount``: the total number of hits
        ``sentence_field_headings``: headings for fields of a sentence
        ``token_field_headings``: headings for fields of a token
        ``title``: a "title" for the file
        ``korp_url``: URL of the Korp service (frontend) used
        ``korp_server_url``: URL of the Korp server (backend) used
        """
        self._infoitems = dict(
            params=lambda: self._format_params(),
            # Also allow format references {param[name]}
            param=self._query_params,
            date=lambda: self._format_date(),
            hitcount=lambda: self._format_hitcount(),
            sentence_field_headings=(
                lambda: self._format_field_headings("sentence")),
            token_field_headings=lambda: self._format_field_headings("token"),
            title=lambda: self._format_title(),
            korp_url=self._opts.get("korp_url"),
            korp_server_url=self._opts.get("korp_server_url"))

    def _convert_newlines(self, text):
        """Return `text` with newlines as specified in option ``newline``."""
        if self._opts["newline"] != "\n":
            return text.replace("\n", self._opts["newline"])
        else:
            return text

    def _postprocess(self, text):
        """Return the formatted content `text` post-processed.

        This method is designed to be overridden in subclasses. The
        default is to return `text` as is.
        """
        return text

    def _get_sentence_structs(self, sentence, all_structs=False):
        """Get the structural attributes of a sentence.

        Get the structural attributes of `sentence` as a list of pairs
        (struct name, value). If `all_structs` is `False` (the
        default), get the structs specified in the option ``structs``;
        otherwise get all structs.
        """
        return qr.get_sentence_structs(
            sentence, None if all_structs else self._opts.get("structs", []))

    def _get_formatted_sentence_structs(self, sentence, **kwargs):
        """Get all the formatted structural attributes of a sentence.

        Return a dict with structural attribute names as keys and
        formatted values as values.
        """
        return dict(
            [(key,
              lambda key=key, val=val: self._format_struct((key, val),
                                                           **kwargs))
             for (key, val)
             in self._get_sentence_structs(sentence, all_structs=True)])

    def _get_corpus_info(self, sentence):
        """Get information on the corpus from which a sentence originates.

        Return a `dict` containing the following corpus info items for
        `sentence` (each item may be empty):

        ``corpus_name``: name of the corpus
        ``urn``: corpus URN (without resolver prefix)
        ``link``: corpus link (URN with resolver prefix or URL)
        ``licence_name``: corpus licence name
        ``licence_link``: link to licence (URN with resolver prefix or URL)
        ``metadata_link``: link to metadata (URN with resolver prefix or URL)
        """
        corpus_name = qr.get_sentence_corpus(sentence)
        if corpus_name not in self._corpus_info:
            self._corpus_info[corpus_name] = dict(
                corpus_name=corpus_name,
                urn=qr.get_sentence_corpus_urn(sentence),
                link=qr.get_sentence_corpus_link(
                    sentence, urn_resolver=self._urn_resolver),
                licence_name=qr.get_sentence_corpus_info_item(
                    sentence, "licence", "name"),
                licence_link=qr.get_sentence_corpus_link(
                    sentence, "licence", urn_resolver=self._urn_resolver),
                metadata_link=qr.get_sentence_corpus_link(
                    sentence, "metadata", urn_resolver=self._urn_resolver))
        return self._corpus_info[corpus_name]

    def _get_token_attrs(self, token, all_attrs=False):
        """Get the (positional) attributes of a token.

        Get the positional attributes of `token` as a list of pairs
        (attr name, value). If `all_attrs` is `False` (the default),
        get the attributes specified in the option ``attrs`` otherwise
        get all attributes.
        """
        return qr.get_token_attrs(
            token, None if all_attrs else self._opts.get("attrs", []))

    # Generic formatter methods used by the concrete formatter methods
    # for formatting individual components of a query result. These
    # methods typically need not be extended or overridden in
    # subclasses.

    def _format_item(self, item_type, **format_args):
        """Format an item of `item_type` in the query result.

        Use the format string for `item_type` in the options as a
        template, filled with keys in `format_args`. Uses the string
        formatter handling missing keys in the format string. (The
        *item* in *item_type* does not refer to (only) list items, but
        to any component of a query result.)
        """
        return self._formatter.format(self._opts[item_type + "_format"],
                                      **format_args)

    def _format_list(self, item_type, list_, format_fn=None, **kwargs):
        """Format the list `list_` of items of `item_type`.

        Format list items using a formatting function (method)
        `format_fn`. If `format_fn` is not specified, use the method
        ``_format_``*item_type* in the class of `self`. `kwargs` is
        passed to `format_fn`, augmented with the value
        *item_type*``_num``, whose value is the number of the item in
        the list as a zero-based integer. Separate list items with the
        separator specified by the option *item_type*``_sep``.

        Supports the option *item_type*``_skip``, which specifies a
        regular expression. If specified and if a formatted list item
        as a whole matches the regular expression, the list item is
        not included in the result.
        """

        def updated(dict_, values):
            dict_.update(values)
            return dict_

        format_fn = format_fn or getattr(self, "_format_" + item_type)
        skip_re = self._opts.get(item_type + "_skip")
        if skip_re:
            skip_re = re.compile(r"^" + skip_re + r"$", re.UNICODE)
        return self._opts[item_type + "_sep"].join(
            formatted_elem
            for elemnum, elem in enumerate(list_)
            for formatted_elem in [
                    format_fn(elem, **updated(kwargs, dict([(item_type + "_num",
                                                             elemnum)])))]
            if not (skip_re and skip_re.match(formatted_elem)))

    def _format_label_list_item(self, item_type, key, value, **format_args):
        """Format an item of a list whose items have labels.

        Format a list item of `item_type`, having `key` and `value`.
        The options must contain a label dictionary for `item_type`
        (*item_type*``_labels``) that maps keys to labels.

        Format keys in *item_type*``_format``: ``key``, ``value``,
        ``label``, ``sp_or_nl`` (a newline if `value` contains
        newlines, otherwise what is specified in
        *item_type*``_spacechar`` or a space).
        """
        space = self._opts.get(item_type + "_spacechar", " ")
        return self._format_item(
            item_type,
            key=key,
            label=lambda: self._opts[item_type + "_labels"].get(key, key),
            value=value,
            sp_or_nl=lambda: "\n" if "\n" in str(value) else space,
            **format_args)

    def _format_field_headings(self, item_type, **kwargs):
        """Format field headings for `item_type`.

        Format headings for the fields specified in the option
        *item_type*``_fields``. Format each item as a labelled list
        item of the item type *item_type*``_field``. If the option
        ``show_field_headings`` is `False`, return an empty string.

        Format keys in ``field_headings_format``: ``field_headings``
        (the list of headings formatted).
        """
        if not self.get_option_bool("show_field_headings"):
            return ""
        fields = self._opts.get(item_type + "_fields")
        if fields:
            headings = lambda: self._format_list(
                item_type + "_field",
                fields,
                lambda item, **kwargs: (
                    self._format_label_list_item(
                        item_type + "_field", item,
                        self._opts[item_type + "_field_labels"]
                        .get(item, item))),
                **kwargs)
        else:
            headings = ""
        return self._format_item(
            "field_headings", field_headings=headings, **kwargs)

    # Concrete formatter methods, designed to be overridden in
    # subclasses as necessary.

    def _format_content(self, **kwargs):
        """Format a query result as the content of an exportable file.

        Format keys in ``content_format``: ``info`` (query result meta
        information), ``sentences`` (the sentences in the result).

        This is the main content-formatting method that may be
        overridden in subclasses if they do not need the formatting
        facilities of KorpExportFormatter.
        """
        return self._format_item(
            "content",
            info=lambda: self._format_infoitems(**kwargs),
            sentences=lambda: self._format_sentences(**kwargs),
            **self._infoitems)

    # Formatting methods for query and result information items (meta
    # information)

    def _format_infoitems(self, **kwargs):
        """Format query and result information items.

        If the option ``show_info`` is `False`, return an empty
        string. The pieces of information can be formatted directly
        here or as a list of the items specified in the option
        ``infoitems``.

        Format keys in ``infoitems_format``: ``infoitems`` (all info
        items formatted); those listed in :method:`_init_infoitems`.
        """
        if self.get_option_bool("show_info"):
            format_args = kwargs
            format_args.update(self._infoitems)
            return self._format_item(
                "infoitems",
                infoitems=lambda: self._format_infoitem_fields(),
                **format_args)
        else:
            return ""

    def _format_infoitem_fields(self, **kwargs):
        """Format query and result information items as a list.

        Format the information items listed in the option
        ``infoitems`` as a list. Use ``infoitem_format`` to format the
        individual info fields and ``infoitem_sep`` to separate them.
        """
        return self._format_list(
            "infoitem",
            self._opts.get("infoitems", []),
            **kwargs)

    def _format_infoitem(self, key, **format_args):
        """Format an individual query and result information field.

        Format keys in ``infoitem_format``: those listed in
        :method:`_format_label_list_item`. ``value`` is formatted if
        the formatting method ``_format_``*key* exists, otherwise it
        is the value of the option *key*.
        """
        try:
            value = getattr(self, "_format_" + key)()
        except AttributeError:
            value = self._opts.get(key)
        return self._format_label_list_item(
            "infoitem", key, value, **format_args)

    def _format_title(self, **format_args):
        """Format query result title.

        Format keys in ``title_format``: ``title`` (the value of the
        option ``title``). If ``title`` is empty, return an empty
        string.
        """
        title = self._opts.get("title")
        if title is None:
            return ""
        else:
            return self._format_item("title", title=title, **format_args)

    def _format_date(self, **kwargs):
        """Format the current date.

        Format the current date using the `strftime` format in the
        option ``date_format``.
        """
        return time.strftime(self._opts["date_format"])

    def _format_hitcount(self, **format_args):
        """Format the total number of hits.

        Format keys in ``hitcount_format``: ``hitcount`` (the number
        of hits as a string).
        """
        return self._format_item(
            "hitcount",
            hitcount=qr.get_hitcount(self._query_result),
            **format_args)

    def _format_params(self, **format_args):
        """Format query parameters.

        Format keys in ``params_format``: ``param`` (a dictionary of
        unformatted query parameters), ``params`` (a formatted list of
        query parameter fields), all parameter names as such.
        """
        # Allow format references {name} as well as {param[name]}
        format_args.update(self._query_params)
        return self._format_item(
            "params",
            param=self._query_params,
            params=lambda: self._format_param_fields(),
            **format_args)

    def _format_param_fields(self, **format_args):
        """Format query parameters as a list.

        Format the parameters listed in the option ``params`` as a
        list. Use ``param_format`` to format the individual parameters
        and ``param_sep`` to separate them.
        """
        return self._format_list(
            "param",
            self._opts.get("params", []),
            **format_args)

    def _format_param(self, key, **format_args):
        """Format an individual query parameter.

        Format keys in ``param_format``: those listed in
        :method:`_format_label_list_item`.
        """
        return self._format_label_list_item(
            "param", key, self._query_params.get(key), **format_args)

    # Formatting methods for the query result proper

    def _format_sentences(self, **kwargs):
        """Format the sentences of a query result.

        Format all the sentences of a query result as a list. Use
        ``sentence_format`` to format the individual sentences and
        ``sentence_sep`` to separate them.
        """
        return self._format_list(
            "sentence", qr.get_sentences(self._query_result), **kwargs)

    def _format_sentence(self, sentence, **kwargs):
        """Format a single sentence.

        Format keys in ``sentence_format``: ``corpus`` (the name (id)
        of the corpus), ``match_pos`` (corpus position (the number of
        the first token) of the match), ``tokens`` (all tokens in the
        sentence), ``match`` (the tokens that are part of the match),
        ``left_context`` (the tokens that precede the match),
        ``right_context`` (the tokens that follow the match),
        *attrs*´´_´´*type* where *attrs* is an attribute listed in
        ``sentence_token_attrs`` (pluralized) and *type* one of
        ``all``, ``match``, ``left_context``, ``right_context`` (list
        of values of all the attributes *attr* in tokens of *type* in
        the sentence), ``aligned`` (aligned sentences in a parallel
        corpus), ``structs`` (formatted structural attributes of the
        sentence), ``struct`` (a dict of the structural attributes,
        unformatted), ``sentence_num`` (the number of the sentence in
        this list of sentences, a zero-based integer), ``hit_num´´
        (the (global) number of the hit in the result, a zero-based
        integer), ``arg`` (a dict of additional keyword arguments
        passed), ``info`` (formatted sentence information), ``fields``
        (formatted sentence fields as specified in the option
        ``sentence_fields``); names of structural attributes
        (unformatted); ``corpus_info`` (formatted corpus info);
        ``corpus_info_field`` (unformatted corpus info fields); those
        listed in :method:`_init_infoitems`; those listed in
        :method:`_get_corpus_info`.
        """

        # struct cannot be a lambda function, since its keys are
        # referred to elsewhere.
        struct = self._get_formatted_sentence_structs(sentence, **kwargs)
        corpus = qr.get_sentence_corpus(sentence)
        corpus_info = self._get_corpus_info(sentence)
        format_args = dict(
            corpus=corpus,
            match_pos=qr.get_sentence_match_position(sentence),
            match_open=self._opts["match_open"],
            match_close=self._opts["match_close"],
            aligned=lambda: self._format_aligned_sentences(sentence),
            structs=lambda: self._format_structs(sentence),
            struct=struct,
            corpus_info_field=corpus_info,
            hit_num=lambda: (int(self._infoitems["param"].get("start") or 0)
                             + kwargs["sentence_num"]),
            arg=kwargs)
        tokens_type_info = [
            ("tokens", dict(tokens_type="all")),
            ("match", dict(match_mark=self._opts.get("match_marker", ""))),
            ("left_context", {}),
            ("right_context", {}),
        ]
        for tokens_type, opts in tokens_type_info:
            if "tokens_type" not in opts:
                opts["tokens_type"] = tokens_type
            opts.update(kwargs)
            tokens = qr.get_sentence_tokens(sentence, opts["tokens_type"])
            if (self._opts["match_open"] or self._opts["match_close"]
                or self._opts["match_marker"]):
                if tokens_type == "tokens":
                    opts["match_start"] = qr.get_sentence_match_info(sentence,
                                                                     "start")
                    opts["match_end"] = qr.get_sentence_match_info(sentence,
                                                                   "end")
                elif tokens_type == "match":
                    opts["match_start"] = 0
                    opts["match_end"] = len(tokens)
            # Pass default arguments to lambda, so that each call gets
            # its own argument values
            format_args[tokens_type] = (lambda tokens=tokens, opts=opts:
                                        self._format_tokens(tokens, **opts))
            for attrname in self._sentence_token_attrs:
                tokens_type2 = tokens_type if tokens_type != "tokens" else "all"
                format_arg_name = (self._sentence_token_attr_labels[attrname]
                                   + "_" + tokens_type2)
                format_args[format_arg_name] = (
                    lambda tokens=tokens, attrname=attrname, opts=opts:
                    self._format_tokens(tokens, attr_only=attrname, **opts))
        format_args.update(kwargs)
        # Allow direct format references to struct names (unformatted
        # values)
        format_args.update(dict(self._get_sentence_structs(sentence)))
        format_args.update(self._infoitems)
        format_args.update(corpus_info)
        format_args.update(
            dict(corpus_info=lambda: self._format_corpus_info(**format_args)))
        format_args.update(
            dict(info=lambda: self._format_item("sentence_info",
                                                **format_args)))
        return self._format_item(
            "sentence",
            fields=lambda: self._format_list(
                "sentence_field",
                self._opts.get("sentence_fields", []),
                **format_args),
            **format_args)

    def _format_sentence_field(self, key, **format_args):
        """Format a single sentence field with the key `key`.

        Format keys in ``sentence_field_format``: those listed in
        :method:`_format_label_list_item`. ``value`` is the value of
        `key` in `format_args`, containing the format keys for
        ``sentence_format``, if exists; otherwise the value of
        ``struct[key]``.
        """
        value = format_args.get(key)
        # FIXME: Is the following really necessary, since format_args
        # contains structural attributes directly as keys (with
        # unformatted values)? In any case, the values in struct are
        # functions that should be called.
        if value is None:
            value = format_args.get("struct", {}).get(key, "")
        return self._format_label_list_item(
            "sentence_field", key, value, **format_args)

    def _format_corpus_info(self, **kwargs):
        """Format corpus information items.

        Format keys in ``corpus_info_format``: ``fields`` (all info
        items formatted); those listed in :method:`_get_corpus_info`.
        """
        return self._format_item(
            "corpus_info",
            fields=lambda: self._format_corpus_info_fields(**kwargs),
            **kwargs)

    def _format_corpus_info_fields(self, **kwargs):
        """Format corpus information items as a list.

        Format the information items listed in the option
        ``corpus_info_fields`` as a list. Use
        ``corpus_info_field_format`` to format the individual info
        fields and ``corpus_info_field_sep`` to separate them.
        """
        return self._format_list(
            "corpus_info_field",
            self._opts.get("corpus_info_fields", []),
            **kwargs)

    def _format_corpus_info_field(self, key, **format_args):
        """Format an individual corpus information field.

        Format keys in ``corpus_info_field_format``: those listed in
        :method:`_format_label_list_item`. ``value`` is the value of
        `key` in `format_args`, containing the format keys for
        ``corpus_info_format``, if exists; otherwise the value of
        ``corpus_info_field[key]``.
        """
        value = format_args.get(key, "")
        if value is None:
            value = format_args.get("corpus_info_field", {}).get(key, "")
        return self._format_label_list_item(
            "corpus_info_field", key, value, **format_args)

    def _format_aligned_sentences(self, sentence, **kwargs):
        """Format the aligned sentences of `sentence`.

        Format the sentences aligned with `sentence` (in a parallel
        corpus) as a list. Use ``aligned_format`` to format individual
        sentences and ``aligned_sep`` to separate them.
        """
        # In practice, currently Korp returns only a single aligned
        # sentence, but CWB supports multiple alignments, so support
        # it here as well.
        return self._format_list("aligned",
                                 qr.get_aligned_sentences(sentence),
                                 self._format_aligned_sentence,
                                 **kwargs)

    def _format_aligned_sentence(self, aligned_sentence, **format_args):
        """Format a single aligned sentence.

        Format keys in ``aligned_format``: ``align_key`` (the name of
        the alignment attribute; in practice, the id of the aligned
        corpus in lowercase), ``sentence`` (the aligned sentence as a
        formatted string of tokens).
        """
        align_key, sentence = aligned_sentence
        return self._format_item(
            "aligned",
            align_key=align_key,
            sentence=lambda: self._format_tokens(
                sentence, tokens_type="aligned", **format_args),
            **format_args)

    def _format_structs(self, sentence, **kwargs):
        """Format the strucutral attributes of `sentence`.

        Format the structural attributes of `sentence` as a list. Use
        ``struct_format`` to format individual structural attributes
        and ``struct_sep`` to separate them.
        """
        return self._format_list("struct",
                                 self._get_sentence_structs(sentence),
                                 **kwargs)

    def _format_struct(self, struct, **format_args):
        """Format a single structural attribute `struct`.

        Format keys in ``struct_format``: ``name`` (the name of the
        attribute), ``value`` (its value).
        """
        return self._format_item(
            "struct", name=struct[0], value=struct[1], **format_args)

    def _format_tokens(self, tokens, **kwargs):
        """Format the tokens of a single sentence.

        Format `tokens` as a list. Use ``token_format`` to format the
        individual tokens and ``token_sep`` to separate them.
        """
        return self._format_list("token", tokens, **kwargs)

    def _format_token(self, token, **kwargs):
        """Format a single token `token`, possibly with attributes.

        Format a single token using the format ``token_format``, or
        ``token_noattrs_format`` if no (positional) token attributes
        have been specified in option ``attrs``, `structured_format`
        is `False` and the option ``token_fields`` contains at most
        one item, or ``attr_only_format`` if the option ``attr_only``
        specifies an attribute name.

        Format keys: ``word`` (formatted wordform; not if
        ``attr_only``), ``attr`` (formatted attribute value; only if
        ``attr_only``), ``attrs`` (formatted token attributes),
        ``structs_open`` (structural attributes opening immediately
        before the token, formatted), ``structs_close`` (structural
        attributes closing immediately after the token, formatted),
        ``fields`` (all the token fields specified in the option
        ``token_fields``, formatted; not if ``attr_only``),
        ``match_open`` (`_opts["match_open"]` for the first token of a
        match, the empty string otherwise), ``match_close``
        (`_opts["match_close"]` for the last token of a match, the
        empty string otherwise), ``match_marker``
        (`_opts["match_marker"]` for any token in a match, the empt
        string for non-match tokens); all the token attribute names
        (unformatted values).
        """
        attrname = kwargs.get("attr_only", "word")
        # Allow for None in word (but where do they come from?)
        if attrname == "word":
            itemname = "word"
            attrval = lambda: self._format_item("word",
                                                word=(token.get("word") or ""))
        else:
            itemname = "attr"
            attrval = lambda: self._format_token_attr(
                (attrname, token.get(attrname)), item_type="attr_only",
                **kwargs)
        if attrname != "word":
            format_name = "token_attr"
        elif (self._opts.get("attrs") or self.structured_format
              or len(self._opts.get("token_fields")) > 1):
            format_name = "token"
        else:
            format_name = "token_noattrs"
        format_args = dict(
            attrs=lambda: self._format_token_attrs(token),
            structs_open=lambda: self._format_token_structs_open(token),
            structs_close=lambda: self._format_token_structs_close(token))
        format_args[itemname] = attrval
        # Allow direct format references to attr names
        format_args.update(dict(self._get_token_attrs(token)))
        format_args.update(kwargs)
        if attrname == "word":
            fields = lambda: self._format_list(
                "token_field",
                self._opts.get("token_fields", []),
                **format_args)
        else:
            fields = ""
        match_open = match_close = match_marker = ""
        if kwargs.get("match_end"):
            token_num = kwargs.get("token_num", -1)
            match_start = kwargs.get("match_start")
            match_end = kwargs.get("match_end")
            if token_num == match_start:
                match_open = self._opts.get("match_open", "")
            if token_num == match_end - 1:
                match_close = self._opts.get("match_close", "")
            if match_start <= token_num < match_end:
                match_marker = self._opts.get("match_marker", "")
        result = self._format_item(
            format_name,
            fields=fields,
            match_open=match_open,
            match_close=match_close,
            match_marker=match_marker,
            **format_args)
        return result

    def _format_token_field(self, key, **format_args):
        """Format a single token field having the key `key`.

        Format keys in ``token_field_format``: those listed in
        :method:`_format_label_list_item`. ``value`` is the value of
        `key` in `format_args`, containing the format keys for
        ``_format_token``, if exists; otherwise the value of
        ``attr[key]`` or ``struct[key]``.
        """
        return self._format_label_list_item(
            "token_field", key,
            (format_args.get(key)
             or format_args.get("attr", {}).get(key, "")
             or format_args.get("struct", {}).get(key, "")),
            **format_args)

    def _format_token_attrs(self, token, **kwargs):
        """Format the attributes of `token` (excluding wordform) as a list.

        Use ``attr_format`` to format the individual attributes and
        ``attr_sep`` to separate them."""
        return self._format_list(
            "attr",
            self._get_token_attrs(token),
            self._format_token_attr,
            **kwargs)

    def _format_token_attr(self, attr_name_value, item_type="attr",
                           **format_args):
        """Format a single token attribute (name, value) pair.

        Format keys in ``attr_format``: ``name``, ``value``.

        A format different from ``attr`` may be specified via
        `item_type`.
        """
        attrname, value = attr_name_value
        return self._format_item(
            item_type, name=attrname, value=(value or ""), **format_args)

    def _format_token_structs_open(self, token, **kwargs):
        """Format the structural attributes opening at `token`.

        Format as a list the structural attributes opening immediately
        before `token`. Use ``token_struct_open_format`` to format
        individual attributes and ``token_struct_open_sep`` to
        separate them.

        The option ``combine_token_structs`` affects the result:
        whether to combine structural attributes representing the
        attributes of the same element or not.
        """
        combine = self.get_option_bool("combine_token_structs")
        return self._format_list(
            "token_struct_open",
            qr.get_token_structs_open(token, combine),
            **kwargs)

    def _format_token_struct_open(self, struct, **format_args):
        """Format a single structural attribute opening at `token`.

        If the option ``combine_token_structs`` is `False`, use the
        format string ``token_struct_open``. If it is `True`, use
        ``token_struct_open_attrs`` if the structural attribute has
        attribute values (XML attributes), else (XML element)
        ``token_struct_open_noattrs``. All these recognize the format
        key ``name`` (name of the structure (XML element));
        ``token_struct_open_attrs`` also recognizes ``attrs``
        containing a formatted list of attributes (in XML sense).
        """
        if self.get_option_bool("combine_token_structs"):
            structname, attrlist = struct
            attrstr = lambda: self._format_token_struct_attrs(attrlist,
                                                              **format_args)
            format_name = (
                "token_struct_open_" + ("attrs" if attrstr else "noattrs"))
            return self._format_item(
                format_name, name=structname, attrs=attrstr, **format_args)
        else:
            return self._format_item(
                "token_struct_open", name=struct, **format_args)

    def _format_token_struct_attrs(self, attrs, **kwargs):
        """Format the attributes `attrs` of a structure.

        Format as a list the attributes (in XML sense) of a structure
        (XML element) opening immediately before a token. Use
        ``token_struct_attr_format`` to format the individual
        attributes and ``token_struct_attr_sep`` to separate them.
        """
        return self._format_list("token_struct_attr", attrs, **kwargs)

    def _format_token_struct_attr(self, attr, **format_args):
        """Format a single attribute `attr` of a structure.

        Format a single attribute `attr` of a structure (XML element)
        opening immediately before a token. Format keys in
        ``token_struct_attr_format``: ``name``, ``value``.
        """
        name, value = attr
        return self._format_item(
            "token_struct_attr", name=name, value=value, **format_args)

    def _format_token_structs_close(self, token, **kwargs):
        """Format the structural attributes closing at `token`.

        Format as a list the structural attributes closing immediately
        after `token`. Use ``token_struct_close_format`` to format
        individual attributes and ``token_struct_close_sep`` to
        separate them.

        The option ``combine_token_structs`` affects the result:
        whether to combine structural attributes associated with the
        same (XML) element or not.
        """
        return self._format_list(
            "token_struct_close",
            qr.get_token_structs_close(
                token, self.get_option_bool("combine_token_structs")),
            **kwargs)

    def _format_token_struct_close(self, struct, **format_args):
        """Format a single structural attribute closing at `token`.

        Format keys in ``token_struct_close_format``: ``name`` (name
        of the structural attribute, or if ``combine_token_structs``
        is `True`, the XML element name in the structural attribute).
        """
        if self.get_option_bool("combine_token_structs"):
            struct, _ = struct
        return self._format_item(
            "token_struct_close", name=struct, **format_args)
