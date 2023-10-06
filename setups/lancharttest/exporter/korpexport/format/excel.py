# -*- coding: utf-8 -*-

"""
Format Korp query results as an Excel 97–2003 workbook (XLS).

:Author: Jyrki Niemi <jyrki.niemi@helsinki.fi> for FIN-CLARIN
:Date: 2014
"""




import io as strio

import xlwt

import korpexport.format.delimited as delimited


__all__ = ['KorpExportFormatterExcel']


class KorpExportFormatterExcel(delimited.KorpExportFormatterDelimited):

    """
    Format Korp query results as an Excel 97–2003 workbook (XLS).

    A mix-in class of actual formatters for XLS formats. The class
    does not specify the content of the fields. It assumess that the
    formatted result contains rows separated by newlines and columns
    separated by tabs (before postprocessing). The class overrides
    `_postprocess` to produce the XLS file. The class can be combined
    (via multiple inheritance) with the content formatting classes in
    `korpexport.format.delimited` to produce meaningful output.
    """

    mime_type = "application/vnd.ms-excel"
    filename_extension = ".xls"
    download_charset = None
    formats = ["xls", "excel"]

    def __init__(self, **kwargs):
        super(KorpExportFormatterExcel, self).__init__(**kwargs)

    def _postprocess(self, text):
        """Return an XLS file content of `text`.

        Assumes that `text` contains rows separated by newlines and
        columns separated by tabs.
        """
        # CHECK: Does the encoding parameter have an effect?
        workbook = xlwt.Workbook(encoding="utf-8")
        worksheet = workbook.add_sheet(self._opts.get("title", ""))
        for rownum, row in enumerate(text.split("\n")):
            if row:
                for colnum, value in enumerate(row.split("\t")):
                    worksheet.write(rownum, colnum, value)
        output = strio.StringIO()
        workbook.save(output)
        return output.getvalue()
