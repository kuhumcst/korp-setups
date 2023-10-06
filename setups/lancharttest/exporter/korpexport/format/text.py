# -*- coding: utf-8 -*-

"""
Format Korp query results in plain text formats.

:Author: Jyrki Niemi <jyrki.niemi@helsinki.fi> for FIN-CLARIN
:Date: 2014
"""




from korpexport.formatter import KorpExportFormatter


class KorpExportFormatterText(KorpExportFormatter):

    """
    Format Korp query results in plain text.

    Handle the format type ``text``.

    The resulting content has the following features when using the
    default options: title and info items are at the beginning, each
    preceded by "##". Each sentence is on its own line, matches marked
    with ``<<<`` and ``>>>``. The sentence tokens are followed by
    ``||`` and structural attributes separated by a ``|``.
    """

    formats = ["text"]
    mime_type = "text/plain"
    filename_extension = ".txt"

    # This class only modifies `_option_defaults` values; all the
    # methods are as inherited from :class:`KorpExportFormatter`.

    _option_defaults = {
        "content_format": "{info}{sentences}",
        "infoitems_format": "{title}\n{infoitems}\n\n",
        "infoitem_format": "## {label}:{sp_or_nl}{value}",
        "title_format": "## {title}\n",
        "param_format": "##   {label}: {value}",
        "param_sep": "\n",
        "sentence_format": ("{corpus} [{match_pos}]: {tokens} || {structs}\n"),
        "struct_sep": " | ",
        "match_open": "<<< ",
        "match_close": " >>>",
        }

    _subformat_options = {
        # Bare sentences without annotations or metadata, sentence per
        # line; the fist line contains title, timestamp and Korp URL
        "sentences-bare": {
            "infoitems_format": "{title} | {infoitems}\n",
            "infoitem_format": "{value}",
            "infoitems" : "date,korp_url",
            "infoitem_sep" : " | ",
            "title_format": "{title}",
            "sentence_format": "{tokens}\n",
            "skip_leading_lines": "1",
        },
    }
    # Subformat aliases
    _subformat_options["bare"] = _subformat_options["sentences-bare"]

    def __init__(self, **kwargs):
        super(KorpExportFormatterText, self).__init__(**kwargs)
