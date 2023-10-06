# -*- coding: utf-8 -*-

"""
Format Korp query results in JSON.

:Author: Jyrki Niemi <jyrki.niemi@helsinki.fi> for FIN-CLARIN
:Date: 2014
"""




import json

import korpexport.queryresult as qr
from korpexport.formatter import KorpExportFormatter


class KorpExportFormatterJSON(KorpExportFormatter):

    """
    Format Korp query results in JSON.

    Handle the format type ``json``.

    The formatter recognizes the following options (in 
    `_option_defaults`):
        sort_keys (bool): Whether to sort keys in JSON
        indent (int): The indent step for JSON structures; if
            unspecified, the result is a single long line

    The result does not contain any meta information about the query.
    """

    formats = ['json']
    mime_type = 'application/json'
    filename_extension = '.json'

    _option_defaults = {
        "sort_keys": "True",
        "indent": "4"
        }

    def __init__(self, **kwargs):
        super(KorpExportFormatterJSON, self).__init__(**kwargs)

    # This class does not use the formatting methods or
    # `_option_default` values in :class:`KorpExportFormatter`.
    # Instead, it overrides the method `_format_content`.

    # TODO: Add meta information (as an item in the JSON).

    def _format_content(self, **kwargs):
        """Convert Korp query result directly to JSON."""
        return (json.dumps(qr.get_sentences(self._query_result),
                           sort_keys=self.get_option_bool("sort_keys"),
                           indent=self.get_option_int("indent"))
                + "\n")
