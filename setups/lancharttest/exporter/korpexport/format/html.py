# -*- coding: utf-8 -*-

"""
Format Korp query results in HTML.

:Author: Jyrki Niemi <jyrki.niemi@helsinki.fi> for FIN-CLARIN
:Date: 2016
"""




import re

from xml.sax.saxutils import escape

from korpexport.formatter import KorpExportFormatter


class KorpExportFormatterHtml(KorpExportFormatter):

    """
    Format Korp query results in HTML.

    A mix-in class of actual formatters for HTML formats. The class
    does not specify the content of the fields. The class overrides
    `_postprocess` to produce the HTML file. The class can be combined
    (via multiple inheritance) with content formatting classes
    producing sentence-per-line output to produce meaningful output.

    The formatter uses the following options (in `_option_defaults`)
    in addition to those specified in :class:`KorpExportFormatter`:
        html_page_format: Format string for the complete HTML page;
            format keys: ``doctype`` (HTML doctype), ``head`` (HTML
            ``head`` content), ``body`` (HTML ``body`` content)
        html_doctype_format: Format string for the HTML doctype
            (literal string, no format keys)
        html_head_format: Format string for the HTML ``head`` element
            content; format key: ``title`` (``title`` element
            content)
        html_style: CSS style definitions to be added inside the
            ``style`` element of ``head``; no format keys. Note that
            the option name does _not_ end in ``_format``, so that the
            <, > and & in the content are encoded as HTML character
            entity references.
        html_title_format: Format string for the HTML ``title``
            content; the format keys are the same as for
            ``infoitems_format``
        html_body_format: Format string for the HTML ``body`` content;
            format keys: ``heading`` (a page heading, not necessarily
            only heading elements), ``korp_link`` (a link to the Korp
            search), ``lines`` (the actual content linewise)
        html_haeding_format: Format string for the HTML page heading;
             the format keys are the same as for ``infoitems_format``
        html_korp_link_format: Format string for the HTML Korp search
            link; the format keys are the same as for
            ``infoitems_format``
        html_line_format: Format string for the HTML markup of a
            single line in the text to be postprocessed; format key:
            ``line`` (the text of the line, possibly with matches
            marked)
        html_match_format: Format string for the HTML markup of a
            match; format key: ``match`` (the text enclosed in
            ``match_open`` and ``match_close``)
        skip_leading_lines (int): The number of lines to skip in the
            content before formatting content lines, typically some
            kind of header lines

    The literal HTML tags and ampersands in the HTML formatting
    options ``html_*_format`` are protected from conversion to HTML
    character entity references.
    """

    formats = ["html"]
    mime_type = "text/html"
    filename_extension = ".html"

    _option_defaults = {
        "html_page_format": (
            "{doctype}\n<html>\n<head>\n{head}\n</head>\n"
            "<body>\n{body}</body>\n</html>\n"),
        "html_doctype_format": "<!DOCTYPE html>",
        "html_head_format": ("<meta charset=\"utf-8\"/>\n"
                             "<title>{title}</title>\n"
                             "<style>{style}</style>"),
        "html_title_format": "{title} {date}",
        "html_style": "",
        "html_body_format": "{heading}\n{korp_link}\n<hr/>\n{lines}",
        "html_heading_format": "<h1>{title} {date}</h1>",
        "html_korp_link_format": (
            "<p><a href=\"{korp_url}\" target=\"_blank\">{korp_url}</a></p>"),
        "html_line_format": "<p>{line}</p>\n",
        "html_match_format": "<strong>{match}</strong>",
    }

    def __init__(self, **kwargs):
        super(KorpExportFormatterHtml, self).__init__(**kwargs)
        self._match_open = self._opts.get("match_open") or ""
        self._match_close = self._opts.get("match_close") or ""
        self._match_starttag = ""
        self._match_endtag = ""
        self._match_re = None
        if (self._match_open and self._match_close
            and self._opts["html_match_format"]):
            self._match_re = re.compile(re.escape(self._match_open) + r"(.*?)"
                                        + re.escape(self._match_close))
        for optname, optval in self._opts.items():
            if optname.startswith('html_') and optname.endswith('_format'):
                self._opts[optname] = self._protect_html_tags(optval)
        self._skip_leading_lines = (self.get_option_int("skip_leading_lines")
                                    or 0)

    def _protect_html_tags(self, html_text):
        return (html_text.replace("<", "\x01")
                .replace(">", "\x02")
                .replace("&", "\x03"))

    def _restore_html_tags(self, html_text):
        return (html_text.replace("\x01", "<")
                .replace("\x02", ">")
                .replace("\x03", "&"))

    def _postprocess(self, text):
        return self._restore_html_tags(escape(self._format_html_page(text)))

    def _format_html_page(self, text):
        return self._format_item("html_page",
                                 doctype=self._opts.get("html_doctype_format"),
                                 head=self._format_html_head(),
                                 body=self._format_html_body(text))

    def _format_html_head(self):
        return self._format_item("html_head",
                                 title=self._format_html_title(),
                                 style=self._opts.get("html_style"))

    def _format_html_title(self):
        return self._format_item("html_title", **self._infoitems)

    def _format_html_body(self, text):
        return self._format_item("html_body",
                                 heading=self._format_html_heading(),
                                 korp_link=self._format_html_korp_link(),
                                 lines=self._format_html_lines(text))

    def _format_html_heading(self):
        return self._format_item("html_heading", **self._infoitems)

    def _format_html_korp_link(self):
        return self._format_item("html_korp_link", **self._infoitems)

    def _format_html_lines(self, text):
        result = []
        for linenr, line in enumerate(text.rstrip("\n").split("\n")):
            if linenr >= self._skip_leading_lines:
                result.append(
                    self._format_item("html_line",
                                      line=self._format_html_line(
                                          line, linenr=linenr)))
        return "".join(result)

    def _format_html_line(self, line, linenr=None):
        return (self._format_html_match(line) if self._match_re else line)

    def _format_html_match(self, line):
        return self._match_re.sub(
            lambda mo: self._format_item("html_match", match=mo.group(1)),
            line)


class KorpExportFormatterHtmlTable(KorpExportFormatterHtml):

    """
    Format a tabular Korp query result as an HTML table.

    A mix-in class of actual formatters for HTML formats. The class
    does not specify the content of the fields. The class overrides
    `_postprocess` to produce the HTML file. The class can be combined
    (via multiple inheritance) with content formatting classes
    producing tabular output (columns separated by tabs, rows by
    newlines) to produce meaningful output.

    The formatter uses the following options (in `_option_defaults`)
    in addition to those specified in :class:`KorpExportFormatterHtml`
    above:
        html_heading_cell_format: Format string for a heading cell,
            including the cell tags; format keys: ``cell`` (cell
            content)
        html_data_cell_format: Format string for a data cell,
            including the cell tags; format keys: ``cell`` (cell
            content)
        heading_rows (int): The number of rows at the beginning of the
            table to format as headings
        heading_cols (int): The number of columns on the left side of
            the table to format as headings
    """

    formats = ["html-table", "html_table"]

    _option_defaults = {
        "html_style": "th { text-align: left; }",
        "html_body_format": (
            "{heading}\n{korp_link}\n<hr/>\n<table>\n{lines}</table>\n"),
        "html_line_format": "<tr>{line}</tr>\n",
        "html_heading_cell_format": "<th>{cell}</th>",
        "html_data_cell_format": "<td>{cell}</td>",
    }

    def __init__(self, **kwargs):
        super(KorpExportFormatterHtmlTable, self).__init__(**kwargs)
        self._heading_rows = self.get_option_int("heading_rows") or 0
        self._heading_cols = self.get_option_int("heading_cols") or 0

    def _format_html_line(self, line, linenr=None):
        result = []
        for colnr, col in enumerate(line.split("\t")):
            fmt = ("html_heading_cell"
                   if ((linenr is not None and linenr < self._heading_rows)
                       or (colnr < self._heading_cols))
                   else "html_data_cell")
            result.append(self._format_item(fmt, cell=col))
        return "".join(result)
