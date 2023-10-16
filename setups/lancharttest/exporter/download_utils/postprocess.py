"""
Module for postprocessing the temp file written by the get_data module.
Specifically, groups of match tokens (and annotations) are expanded into fields.
The max number of match tokens in a row can only be known once the whole dataset is complete.
So, an extra pass through the file is needed to expand and pad groups of tokens as needed.
"""


import re


def expand_rows_and_rewrite_w_bom(_tmpfile1, _tmpfile2, _max_match, _query_params, opts):
    """Expand groups of tokens and annotations, formatted as
    strings concatenated with a special separator, to the number
    of fields corresponding to the maximal number of match tokens."""
    headings = _get_headings(_query_params, _max_match, opts.sentence_fields)
    with open(_tmpfile2, 'w') as f:
        # Prepending the BOM '\uFEFF', creating a file encoded in UTF-8-BOM, makes
        # e.g. csv readable in Excel as well as text editors on Windows as well as Mac.
        f.write('\uFEFF' + opts.csv_sep.join(headings.split(',')))
        with open(_tmpfile1) as tf:
            for line in tf:
                new_line_fields = _expand_row(line, _max_match, opts)
                f.write(opts.csv_sep.join(new_line_fields) + '\n')


def _get_headings(query_params, max_match, sentence_fields):
    """Build a string with headings - with tokens and tag headings expanded and enumerated"""
    token_tag_headings_str = query_params.get('show', '')
    base_headings_str = sentence_fields

    if max_match > 1:
        zipped_enumerated = [enumerate(tup) for tup in zip(*[token_tag_headings_str.split(',')] * max_match)]
        string_lists = [[f'{tag}_{i+1}' for i, tag in tup] for tup in zipped_enumerated]
        token_tag_headings_str = ','.join([heading for sublist in string_lists for heading in sublist])

        base_header_parts = []
        for s in sentence_fields.split(','):
            header_part = s if s != 'match' else ','.join([f'match_{str(i+1)}' for i in range(max_match)])
            base_header_parts.append(header_part)
        base_headings_str = ','.join(base_header_parts)

    return f'{base_headings_str},{token_tag_headings_str}\n'


def _expand_row(row, overall_max_match, opts):
    """Expand groups of tokens (and annotations), formatted as
    strings concatenated with a special separator, to the number
    of fields corresponding to the maximal number of match tokens."""
    new_row_fields = []
    sentence_fields = opts.sentence_fields.split(',')
    row = re.sub(r'^"(.*)"$', r'\1', row.strip())  # Remove overall quotes
    row_fields = row.split(f'"{opts.csv_sep}"')
    for i, field in enumerate(row_fields):
        # We are in the initial base fields - but not in the match
        if i < len(sentence_fields) and sentence_fields[i] != 'match':
            new_row_fields.append(f'"{field}"')
        else:
            parts = field.split(opts.group_sep)
            parts = parts + [''] * (overall_max_match - len(parts))  # Expand to max match length
            parts = [f'"{part}"' for part in parts]  # Quote parts
            for part in parts:
                new_row_fields.append(part)
    return new_row_fields
