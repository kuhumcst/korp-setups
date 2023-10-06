# -*- coding: utf-8 -*-

"""
Format Korp query results in various delimited-fields formats.

This module contains Korp result formatters for logical content in
both sentence per line and token per line, and for concrete
representation as CSV (comma-separated values) and TSV (tab-separated
values).

:Author: Jyrki Niemi <jyrki.niemi@helsinki.fi> for FIN-CLARIN
:Date: 2014
"""




import re

import korpexport.queryresult as qr
from korpexport.formatter import KorpExportFormatter


__all__ = ['KorpExportFormatterDelimitedSentence',
           'KorpExportFormatterDelimitedToken',
           'KorpExportFormatterDelimitedReference',
           'KorpExportFormatterCSV',
           'KorpExportFormatterTSV']


class KorpExportFormatterDelimited(KorpExportFormatter):

    """
    Format Korp query results in a delimited-fields format.

    The base class of actual formatters for delimited-fields formats.

    The formatter uses the following options (in `_option_defaults`)
    in addition to those specified in :class:`KorpExportFormatter`:
        delimiter (str): The delimiter with which to separate fields
        quote (str): The quote character around fields
        replace_quote (str): The string with which to replace quote
            characters occurring in field values

    The fields returned by the formatting methods should be delimited
    by tabs; they are converted to the final delimiter in
    `_postprocess`.
    """

    _option_defaults = {
        "infoitem_format": "## {label}:{sp_or_nl}{value}",
        "title_format": "## {title}\n",
        "param_format": "##   {label}: {value}",
        "param_sep": "\n",
        "sentence_fields": ("corpus,urn,metadata_link,licence_name,"
                            "licence_link,match_pos,left_context,match,"
                            "right_context,?aligned,*structs"),
        "delimiter": "\t",
        "quote": "",
        "replace_quote": "",
        }

    def __init__(self, **kwargs):
        super(KorpExportFormatterDelimited, self).__init__(**kwargs)

    def _postprocess(self, text):
        """Add quotes around fields in `text` if specified.

        Add the quotes specified with option ``quotes`` and convert
        tabs to the final field separator.
        """
        # FIXME: This does not work correctly if fields are not quoted
        # but the field separator is other than the tab
        if self._opts["quote"]:
            return "\n".join(self._quote_line(line)
                             for line in text.split("\n"))
        else:
            return text

    def _quote_line(self, line):
        """Add quotes around the fields (separated by tabs) in `line`."""
        if line == "":
            return line
        else:
            return self._opts["delimiter"].join(self._quote_field(field)
                                                for field in line.split("\t"))

    def _quote_field(self, text):
        """Add quotes around `text` and replace quotes within `text`."""
        quote = self._opts["quote"]
        return quote + text.replace(quote, self._opts["replace_quote"]) + quote


class KorpExportFormatterDelimitedSentence(KorpExportFormatterDelimited):

    """
    Format Korp results in a delimited-fields format, sentence per line.

    A logical content formatter class for delimited-fields formats
    with a sentence per line. The sentence fields contain corpus name,
    match position, the match and contexts and structural attributes.
    
    This class does not specify the concrete delimiters; they need to
    be specified in the subclass or in a mix-in class.
    """

    formats = ["sentence_line", "sentences", "fields_sentence"]

    _option_defaults = {
        "content_format": "{sentence_field_headings}{sentences}\n\n{info}",
        "sentence_format": "{fields}",
        "sentence_sep": "\n",
        "sentence_fields": ("corpus,?urn,?metadata_link,?licence_name,"
                            "?licence_link,match_pos,left_context,match,"
                            "right_context,?aligned,*structs"),
        "sentence_field_sep": "\t",
    }

    # In the subformats lemmas-resultinfo and lemmas-kwic, add columns
    # containing the values of these (corpus-specific) attributes for
    # each token, separated by spaces. The columns are added only if
    # the corpora in the result contain them.
    _lemmas_extra_pos_attrs = [
        "lemma",
        # LA-murre
        "cleanword",
        # Reittidemo
        "spoken",
        # SKN
        "original",
        "normalized",
        # DMA
        "searchword",
    ]
    _lemmas_sentence_token_attrs = ",".join(_lemmas_extra_pos_attrs)
    _lemmas_resultinfo_extra_pos_fields = ",".join(
        "?" + attrname + "s_all" for attrname in _lemmas_extra_pos_attrs)
    _lemmas_kwic_extra_pos_fields = ",".join(
        "?" + attrname + "s_" + type_
        for attrname in _lemmas_extra_pos_attrs
        for type_ in ["left_context", "match", "right_context"])
    _subformat_options = {
        "lemmas-resultinfo": {
            "show_info": "false",
            "title_format": "{title}",
            "infoitem_format": "{value}",
            "param_format": "{key}={value}",
            "param_sep": "; ",
            "infoitems": "date,korp_url",
            "sentence_fields": ("hit_num,corpus,tokens,"
                                + _lemmas_resultinfo_extra_pos_fields
                                + ",?aligned,"
                                "*structs,?urn,?metadata_link,?licence_name,"
                                "date,hitcount,?korp_url,params"),
            "sentence_token_attrs": _lemmas_sentence_token_attrs,
            "token_format": "{match_open}{word}{match_close}",
            "heading_rows": 1,
            # "match_open": u"<<<",
            # "match_close": u">>>",
        },
        # Similar to "lemmas-resultinfo" above, but separate columns
        # for matching tokens and context tokens. To combine with
        # lemmas-resultinfo, specify "lemmas-resultinfo,lemmas-kwic"
        # as the subformat.
        "lemmas-kwic": {
            "sentence_fields": (
                "hit_num,corpus,left_context,match,right_context,"
                + _lemmas_kwic_extra_pos_fields
                + "?aligned,*structs,?urn,?metadata_link,?licence_name,date,"
                "hitcount,?korp_url,params"),
            "sentence_token_attrs": _lemmas_sentence_token_attrs,
        },
    }

    def __init__(self, **kwargs):
        super(KorpExportFormatterDelimitedSentence, self).__init__(**kwargs)


class KorpExportFormatterDelimitedSentenceSimple(
        KorpExportFormatterDelimitedSentence):

    """
    Format Korp results in a delimited-fields format, sentence per line.

    A logical content formatter class for delimited-fields formats
    with a sentence per line.

    This class is a faster but simplified version of
    KorpExportFormatterDelimitedSentence. The speed is achieved by
    using specialized methods for formatting sentences and a single
    sentence and by not supporting all the formatting features of the
    superclass. In particular, the class requires using
    ``sentence_fields`` for formatting the sentence
    (``sentence_format`` is ignored), and the token format cannot
    refer to token attributes.

    This class does not specify the concrete delimiters; they need to
    be specified in the subclass or in a mix-in class.
    """

    formats = ["sentence_line_simple",
               "sentences_simple",
               "fields_sentence_simple"]

    def __init__(self, **kwargs):
        super(KorpExportFormatterDelimitedSentenceSimple, self).__init__(
            **kwargs)

    def _format_sentences(self, **kwargs):
        """Format the sentences of a query result.

        Format all the sentences of a query result as a list.
        Individual sentences are separated by ``sentence_sep``.
        """
        sentence_fields = self._opts["sentence_fields"]
        tokens_type_info_all = [
            ("tokens", dict(tokens_type="all"), "tokens|.*_all"),
            ("match", dict(match_mark=self._opts.get("match_marker", "")),
             ".*_match"),
            ("left_context", {}, ".*_left_context"),
            ("right_context", {}, ".*_right_context"),
        ]
        tokens_type_info = [
            (tokens_type, opts)
            for tokens_type, opts, regexp in tokens_type_info_all
            if any(re.match("^(" + regexp + ")$", fieldname)
                   for fieldname in sentence_fields)]
        for tokens_type, opts in tokens_type_info:
            if "tokens_type" not in opts:
                opts["tokens_type"] = tokens_type
            opts.update(kwargs)
        sentences = qr.get_sentences(self._query_result)
        token_format = self._opts["token_format"]
        match_format = {}
        for opt_name in ["match_open", "match_close", "match_marker"]:
            opt_val = self._opts.get(opt_name, "")
            if ("{" + opt_name + "}") in token_format and opt_val:
                match_format[opt_name] = opt_val
            else:
                match_format[opt_name] = ""
                token_format = token_format.replace("{" + opt_name + "}", "")
        mark_matches = any(match_format.values())
        # If token_format contains no match marking placeholders nor
        # any additional content, set token_format to None to speed up
        # token formatting in _format_sentence.
        if not mark_matches and token_format == "{word}":
            token_format = None
        return self._opts["sentence_sep"].join(
            self._format_sentence(
                sent, sentence_num=sentnum, tokens_type_info=tokens_type_info,
                token_format=token_format, match_format=match_format,
                mark_matches=mark_matches, **kwargs)
            for sentnum, sent in enumerate(
                    qr.get_sentences(self._query_result)))

    def _format_sentence(self, sentence, sentence_num=None,
                         tokens_type_info=None, token_format="",
                         match_format=None, mark_matches=False, **kwargs):
        """Format a single sentence as a list of sentence fields.

        Field values are separated by ``sentence_field_sep``.

        Supported field names in ``sentence_fields``: ``corpus`` (the
        name (id) of the corpus), ``match_pos`` (corpus position (the
        number of the first token) of the match), ``tokens`` (all
        tokens in the sentence), ``match`` (the tokens that are part
        of the match), ``left_context`` (the tokens that precede the
        match), ``right_context`` (the tokens that follow the match),
        *attrs*´´_´´*type* where *attrs* is an attribute listed in
        ``sentence_token_attrs`` (pluralized) and *type* one of
        ``all``, ``match``, ``left_context``, ``right_context`` (list
        of values of all the attributes *attr* in tokens of *type* in
        the sentence), ``aligned`` (aligned sentences in a parallel
        corpus), ``structs`` (formatted structural attributes of the
        sentence), structural attribute names as such (unformatted
        values), ``sentence_num`` (the number of the sentence in this
        list of sentences, a zero-based integer), ``hit_num´´ (the
        (global) number of the hit in the result, a zero-based
        integer), ``info`` (formatted sentence information); names of
        structural attributes (unformatted); ``corpus_info``
        (formatted corpus info); those listed in
        :method:`_init_infoitems`; those listed in
        :method:`_get_corpus_info`; any additional keyword arguments
        passed via ``kwargs``.

        If `token_format` is `None`, output each word (or token
        attribute) as such, with no formatting, faster than using the
        `token_format` ``{word}``.
        """
        struct = lambda: self._get_formatted_sentence_structs(sentence,
                                                              **kwargs)
        corpus = qr.get_sentence_corpus(sentence)
        corpus_info = self._get_corpus_info(sentence)
        field_vals = dict(
            corpus=corpus,
            match_pos=qr.get_sentence_match_position(sentence),
            # Would it make sense to have match_open and match_close
            # as fields?
            match_open=match_format["match_open"],
            match_close=match_format["match_close"],
            aligned=lambda: self._format_aligned_sentences(sentence),
            structs=lambda: self._format_structs(sentence),
            # struct=struct,
            # corpus_info_field=corpus_info,
            sentence_num=sentence_num,
            hit_num=(int(self._infoitems["param"].get("start") or 0)
                     + sentence_num))
        token_sep = self._opts["token_sep"]
        token_attrs = ["word"]
        token_attrs.extend(self._sentence_token_attrs)
        token_sep = self._opts["token_sep"]
        match_open = match_format["match_open"]
        match_close = match_format["match_close"]
        match_marker = match_format["match_marker"]
        match_start = match_end = -1
        for tokens_type, opts in tokens_type_info:
            tokens = qr.get_sentence_tokens(sentence, opts["tokens_type"])
            if mark_matches:
                if tokens_type == "tokens":
                    match_start = qr.get_sentence_match_info(sentence, "start")
                    match_end = qr.get_sentence_match_info(sentence, "end")
                elif tokens_type == "match":
                    match_start = 0
                    match_end = len(tokens)
            for attrname in token_attrs:
                if attrname == "word":
                    field_name = tokens_type
                else:
                    field_name = (
                        self._sentence_token_attr_labels[attrname] + "_"
                        + (tokens_type if tokens_type != "tokens" else "all"))
                token_list = []
                for token_num, token in enumerate(tokens):
                    token_str = qr.get_token_attr(token, attrname) or ""
                    if token_format is not None:
                        # Sring replacing is faster than using
                        # string.format (called by self._format_item)
                        token_str = token_format.replace("{word}", token_str)
                        if match_open:
                            token_str = token_str.replace(
                                "{match_open}",
                                match_open if token_num == match_start else "")
                        if match_close:
                            token_str = token_str.replace(
                                "{match_close}",
                                (match_close if token_num == match_end - 1
                                 else ""))
                        if match_marker:
                            token_str = token_str.replace(
                                "{match_marker}",
                                (match_marker
                                 if match_start <= token_num < match_end
                                 else ""))
                    token_list.append(token_str)
                field_vals[field_name] = token_sep.join(token_list)
        # Allow direct format references to extra keyword arguments,
        # struct names (unformatted values), query info items and
        # corpus info items.
        field_vals.update(kwargs)
        field_vals.update(dict(self._get_sentence_structs(sentence)))
        field_vals.update(self._infoitems)
        field_vals.update(corpus_info)
        field_vals.update(
            dict(corpus_info=lambda: self._format_corpus_info(**field_vals)))
        field_vals.update(
            dict(info=lambda: self._format_item("sentence_info", **field_vals)))
        fieldnames = self._opts["sentence_fields"]
        for fieldname in fieldnames:
            if callable(field_vals[fieldname]):
                field_vals[fieldname] = field_vals[fieldname]()
        return self._opts["sentence_field_sep"].join(
            str(field_vals[fieldname]) for fieldname in fieldnames)


class KorpExportFormatterDelimitedToken(KorpExportFormatterDelimited):

    r"""
    Format Korp results in a delimited-fields format, token per line.

    A logical content formatter class for delimited-fields formats
    with a token per line. The token fields contain the word and its
    attributes and a possible match marker.

    This class does not specify the concrete delimiters; they need to
    be specified in the subclass or in a mix-in class.

    The formatter uses the following additional option:
        match_field (int): The position of the match marker field: if
            empty, no match marker field; if 0, as the first field;
            otherwise as the last field
    """

    formats = ["token_line", "tokens", "fields_token", "annotations", "annot"]

    _option_defaults = {
        "content_format": "{info}{token_field_headings}{sentences}",
        "infoitems_format": "{title}\n{infoitems}\n\n",
        "field_headings_format": "{field_headings}\n\n",
        "sentence_format": "{info}{fields}",
        "sentence_info_format": ("# {corpus}"
                                 " ({corpus_info}):"
                                 " sentence {sentence_id},"
                                 " position {match_pos};"
                                 " text attributes: {structs}\n"),
        "sentence_fields": "left_context,match,right_context",
        "sentence_field_format": "{value}",
        "sentence_field_sep": "",
        # Skip empty fields or fields containing only spaces
        "sentence_field_skip": r"\s*",
        "corpus_info_format": ("URN {urn};"
                               " licence {licence_name}: {licence_link};"
                               " metadata {metadata_link}"),
        "token_format": "{fields}\n",
        "token_noattrs_format": "{fields}\n",
        "token_sep": "",
        "token_fields": "word,*attrs",
        "token_field_sep": "\t",
        "struct_format": "{name}: {value}",
        "match_marker": "*",
        "match_field": "0"
        }

    def __init__(self, **kwargs):
        super(KorpExportFormatterDelimitedToken, self).__init__(**kwargs)

    def _adjust_opts(self):
        """Add a match field to ``token_fields`` based on ``match_field``."""
        super(KorpExportFormatterDelimitedToken, self)._adjust_opts()
        if self._opts["match_field"]:
            if self._opts["match_field"] == "0":
                self._opts["token_fields"][0:0] = ["match_mark"]
            else:
                self._opts["token_fields"].append("match_mark")


class KorpExportFormatterDelimitedReference(KorpExportFormatterDelimited):

    r"""
    Format Korp results as a delimited-fields bibliographical reference.

    A logical content formatter class for delimited-fields formats
    with information relevant to bibliographical references. The
    output contains two columns: headings and values. The sentence is
    on its own line with the match marked, and the following lines
    contain corpus information and the structural attributes for the
    sentence. Sentences are separated by blank lines.

    This class does not specify the concrete delimiters; they need to
    be specified in a subclass or in a mix-in class.
    """

    formats = ["reference", "biblio", "bibref", "ref"]

    _option_defaults = {
        "content_format": "{info}\n{sentences}",
        "title_format": "## {title}\n",
        "infoitem_format": "## {label}{sp_or_nl}{value}",
        "infoitem_spacechar": "\t",
        "param_format": "##   {label}\t{value}",
        "sentence_format": "sentence\t{tokens}\n{corpus_info}\n{structs}\n",
        "sentence_sep": "\n",
        "corpus_info_fields": (
            "corpus_name,urn,licence_name,licence_link,metadata_link"),
        "corpus_info_field_format": "{label}\t{value}",
        "corpus_info_field_sep": "\n",
        "struct_format": "{name}\t{value}",
        "struct_sep": "\n",
        "token_format": "{match_open}{word}{match_close}",
        "match_open": "<<< ",
        "match_close": " >>>",
        "heading_cols": 1,
        }

    def __init__(self, **kwargs):
        super(KorpExportFormatterDelimitedReference, self).__init__(**kwargs)


class KorpExportFormatterCSV(KorpExportFormatterDelimited):

    r"""
    Format Korp results in a comma-separated values format.

    A mix-in class of actual formatters for comma-separated values
    formats. The result contains commas as field separators, and all
    fields are enclosed in double quotes, with internal double quotes
    doubled. The result uses \r\n as newlines, as it is specified in
    RFC 4180.

    This class does not specify the content of the fields.
    """

    mime_type = "text/csv"
    filename_extension = ".csv"
    formats = ["csv"]

    _option_defaults = {
        "newline": "\r\n",
        "delimiter": ",",
        "quote": "\"",
        "replace_quote": "\"\"",
        }

    def __init__(self, **kwargs):
        super(KorpExportFormatterCSV, self).__init__(**kwargs)


class KorpExportFormatterTSV(KorpExportFormatterDelimited):

    """
    Format Korp results in a tab-separated values format.

    A mix-in class for actual formatters for tab-separated values
    formats. The result contains tabs as field separators and no
    quotes around fied values.

    This class does not specify the content of the fields.
    """

    mime_type = "text/tsv"
    filename_extension = ".tsv"
    formats = ["tsv"]

    _option_defaults = {
        "delimiter": "\t",
        "quote": "",
        "replace_quote": ""
        }

    def __init__(self, **kwargs):
        super(KorpExportFormatterTSV, self).__init__(**kwargs)
