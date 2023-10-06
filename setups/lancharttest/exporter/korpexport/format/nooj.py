# -*- coding: utf-8 -*-

"""
Format Korp query results in various delimited fields formats.
 
This module contains Korp result formatters for NooJ XML divided
into sentences using tag <S>.

Instructions to open exported file in NooJ:

a) Download and save the exported XML file
b) Launch NooJ
c) File > Open > Text
d) Choose correct language from the scroll menu (1). 
   If the language is not present, pick a language that does not
   have any resources installed (English and French are installed by
   default, so please do not pick them).
e) From the Text Unit Limiter menu (3) pick "XML Text Nodes" and
   write <S> into the text field (brackets must be included).
f) Click OK to load the file.

NooJ should now display annotation if you tick the "Show text
annotation structure" box. 
"""



import re
import korpexport.queryresult as qr
from korpexport.formatter import KorpExportFormatter

__all__ = ['KorpExportFormatterNooJ']

# TODO: Reorganize the classes so that we could more easily have both
# comma- and tab-separated versions of both sentence per line and
# token per line formats.

class KorpExportFormatterNooJ(KorpExportFormatter):

    """
    Format Korp query results in a delimited fields format.

    The superclass for actual formatters of delimited-fields formats.

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
        "content_format": "{sentences}\n\n<!--\n{info}\n-->",
        "infoitem_format": "## {label}:{sp_or_nl}{value}",
        "title_format": "## {title} \n",
        "param_format": "## {label}: {value}",
        "param_sep": "\n",
        "sentence_format": "<S>{tokens}</S>",
        "sentence_sep": "\n\n",
        "sentence_fields": ("tokens"),
        "sentence_field_sep": " ",
        "token_format": '<LU LEMMA="{lemma}" '\
                        'CAT="{nooj_attrs}"{nooj_dep}>{word}</LU>',
        "attr_sep": " ",
        "delimiter": ",",
        "quote": "\"",
        "replace_quote": "\"",
        }

    def __init__(self, *args, **kwargs):
        KorpExportFormatter.__init__(self, *args, **kwargs)

    def _format_tokens(self, tokens, tokens_type, **kwargs):
        """Format the tokens of a single sentence.

        Format `tokens` as a list. Use ``token_format`` to format the
        individual tokens and ``token_sep`` to separate them.
        """

        if tokens_type == "all":
            return self._format_list(
                "token", tokens, token_list=tokens, **kwargs)
        else:
            return ""

    def _format_token(self, token, token_list=None, **kwargs):
        """Format a single token `token`, possibly with attributes.
        
        Format a single token using the format ``token_format``, or
        ``token_noattrs_format`` if no (positional) token attributes
        have been specified in option ``attrs``, `structured_format`
        is `False` and the option ``token_fields`` contains at most
        one item.

        Format keys: ``word`` (formatted wordform), ``attrs``
        (formatted token attributes), ``structs_open`` (structural
        attributes opening immediately before the token, formatted),
        ``structs_close`` (structural attributes closing immediately
        after the token, formatted), ``fields`` (all the token fields
        specified in the option ``token_fields``, formatted); all the
        token attribute names (unformatted values).
        """

        if "lemma" in list(token.keys()):
            lemma_key = "lemma"
        else:
            lemma_key = ""

        dep_lemmas = {}
        for item in token_list:
            if 'deprel' in list(item.keys()) and lemma_key:
                dep_lemmas.update({item['ref']: item[lemma_key]})
    
        # rename " and , to overcome NooJ XML-restrictions
        rename_dict = {'"': 'QUOTE',
                       ',': 'COMMA',
                       '<': 'A_BRACKET_LEFT',
                       '>': 'A_BRACKET_RIGHT'}

        if lemma_key and token[lemma_key] in list(rename_dict.keys()):
            token[lemma_key] = rename_dict[token[lemma_key]]
        
        if token['msd']:
            token['msd'] = re.sub('>>>', '(', token['msd'])
        '''
        brackets = {'<': 'B',
                    '>': 'B'}

        if token['word'] in brackets.keys():
            token['word'] = brackets[token['word']]
        
        if token['msd']:
            token['msd'] = re.sub('<', u'\\u02C2', token['msd'])
            token['msd'] = re.sub('>', u'\\u02C3', token['msd'])
        '''
        # remove POS if found also in MSD, add default NooJ category
        # marker for unknowns (UNK)
        if "msd" and "pos" in list(token.keys()):
            if token["msd"] is None:
                token["msd"] = "None"
            #token["msd"] = token["msd"].encode("utf8", "replace")
            token["msd"] = "+".join(list(set(re.split("[\| ;]",
                                                      token["msd"])) -
                                         set([token["pos"]])))
        elif "msd" in list(token.keys()):
            token["pos"] = "UNK"
        elif "pos" in list(token.keys()):
            token["msd"] = ""
        else:
            token["pos"] = "UNK"
            token["msd"] = ""

        # format POS and MSD to NooJ standard
        nooj_attrs = re.sub("\+$", "", "{pos}+{msd}".format(
            pos=token["pos"].upper(),
            msd=token["msd"].lower()))

        # add lemma refenrences
        if "dephead" in list(token.keys()):
            if token["dephead"] == "0":
                dep_lemma = token[lemma_key]
                token["dephead"] = token["ref"]
            elif token["dephead"] in list(dep_lemmas.keys()):
                dep_lemma = dep_lemmas[token["dephead"]]
            elif token["dephead"] == "_":
                dep_lemma = "phrase"
            else:
                dep_lemma = "[   ]"

            nooj_dep = ' ID="{ref}" DEP="{deprel}+{dep_lemma}" ID_REF="{dephead}"'.format(
                ref=token["ref"],
                deprel=token["deprel"].upper(),
                dep_lemma=dep_lemma,
                dephead=token["dephead"])
        else:
            nooj_dep = ""

        word = self._format_item("word", word=(token.get("word") or ""))
        
        # Not sure if removing this will cause problems somewhere.
        # NooJ should show attribute information even if empty.
        """
        if (self._opts.get("attrs") or self.structured_format
            or len(self._opts.get("token_fields")) > 1):
            format_name = "token"
        else:
            format_name = "token_noattrs"
        """
        format_name = "token"
        format_args = dict(
            word=word,
            attrs=self._format_token_attrs(token),
            structs_open=self._format_token_structs_open(token),
            structs_close=self._format_token_structs_close(token))

        # Allow direct format references to attr names
        format_args.update(dict(self._get_token_attrs(token)))
        format_args.update(kwargs)
        format_args.update({"nooj_attrs": nooj_attrs})
        format_args.update({"nooj_dep": nooj_dep})
        if lemma_key: format_args.update({"lemma": token[lemma_key]})
        result = self._format_item(
            format_name,
            fields=self._format_list("token_field",
                                     self._opts.get("token_fields", []),
                                     **format_args),
            **format_args)

        return result

    def _postprocess(self, text):
        """Add quotes around fields in `text` if specified.

        Add the quotes specified with option ``quotes`` and convert
        tabs to the final field separator.
        """
        # FIXME: This does not work correctly if fields are not quoted
        # but the field separator is other than the tab
        '''
        if self._opts["quote"]:
            return "\n".join(self._quote_line(line)
                             for line in text.split("\n"))
        else:
            return text
        '''
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

class KorpExportFormatterCSV(KorpExportFormatterNooJ):

    r"""
    Format Korp results in comma-separated values format, sentence per line.

    Handle the format type ``csv``.

    The result uses \r\n as newlines, as it is specified in RFC 4180.
    """

    formats = ["nooj"]
    
    # NooJ format is invalid XML
    # default output format is .not.xml.txt
    # perhaps use text/.xml.txt

    mime_type = "application/xml"
    filename_extension = ".xml.txt"

    _option_defaults = {
        "newline": "\r\n",
        }

    def __init__(self, *args, **kwargs):
        #KorpExportFormatterNooJ.__init__(self, *args, **kwargs)
        super(KorpExportFormatterNooJ, self).__init__(**kwargs)

