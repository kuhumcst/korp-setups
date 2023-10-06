# -*- coding: utf-8 -*-

"""
Format Korp query results in the VeRticalized Text (VRT) format of CWB.

:Author: Jyrki Niemi <jyrki.niemi@helsinki.fi> for FIN-CLARIN
:Date: 2014
"""




from korpexport.formatter import KorpExportFormatter


__all__ = ["KorpExportFormatterVRT"]


class KorpExportFormatterVRT(KorpExportFormatter):

    """
    Format Korp results in VeRticalized Text format.

    Handle the format type ``vrt``.

    The formatter uses the following additional option:
        xml_declaration (bool): Whether to add an XML declaration at
            the beginning of the result; the default is `False`, since
            the result is not necessarily even well-formed XML

    The result contains matches marked with the element (structural
    attribute) ``MATCH``. The start and end tags of elements in the
    result are currently not necessarily paired correctly.
    """

    formats = ["vrt"]
    mime_type = "text/plain"
    filename_extension = ".vrt"
    structured_format = True

    _option_defaults = {
        "content_format": ("{info}{token_field_headings}"
                           "<korp_kwic>\n{sentences}</korp_kwic>\n"),
        "infoitem_format": "<!-- {label}:{sp_or_nl}{value} -->",
        "title_format": "<!-- {title} -->\n",
        "param_format": "       {label}: {value}",
        "param_sep": "\n",
        "field_headings_format": "<!-- Fields: {field_headings} -->\n",
        # FIXME: This adds MATCH tags before any opening tags and
        # aftore any closing tags in match. It might require a
        # customized _format_sentence to get it right.
        "sentence_format": ("{left_context}<MATCH position=\"{match_pos}\">\n"
                            "{match}</MATCH>\n{right_context}"),
        "token_format": "{structs_open}{fields}\n{structs_close}",
        "token_sep": "",
        "token_field_sep": "\t",
        "attr_sep": "\t",
        "token_struct_open_noattrs_format": "<{name}>\n",
        "token_struct_open_attrs_format": "<{name} {attrs}>\n",
        "token_struct_close_format": "</{name}>\n",
        "token_struct_attr_format": "{name}=\"{value}\"",
        "token_struct_attr_sep": " ",
        "combine_token_structs": "True",
        "xml_declaration": "False"
        }

    def __init__(self, **kwargs):
        super(KorpExportFormatterVRT, self).__init__(**kwargs)

    def _adjust_opts(self):
        super(KorpExportFormatterVRT, self)._adjust_opts()
        if self.get_option_bool("xml_declaration"):
            self._opts["content_format"] = (
                '<?xml version="1.0" encoding="UTF-8" standalone="yes” ?>\n'
                + self._opts["content_format"])

    # FIXME: Close open tags if the struct attribute value for a
    # sentence is different from the currently open one. Maybe also
    # add start tags for such struct attribute values; but how to know
    # the order of structures as structs is a dict?
