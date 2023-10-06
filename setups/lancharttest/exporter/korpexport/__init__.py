# -*- coding: utf-8 -*-

"""
Package for exporting Korp query results to various file formats.

This package contains the following modules:

- `exporter`: The main module for exporting Korp query results
- `formatter`: Common tools for formatting Korp query results
- `queryresult`: Functions for accessing a Korp query result object

The subpackage `format` contains modules that implement actual
formatting of Korp query results into various formats, by subclassing
:class:`korpexport.formatter.KorpExportFormatter`.
"""
