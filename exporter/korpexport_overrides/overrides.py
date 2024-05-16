import logging
from korpexport import queryresult as qr


def format_sentence_override(self, sentence, **kwargs):
    """Format a single sentence (= a delimited row in a given dataset).

    This overrides _format_sentence in KorpExportFormatter in formatter.py.
    It is a bit less abstract and hopefully a bit easier to understand.
    On the other hand it is of course less flexible.
    """
    # Note! kwargs are passed to exporter.make_download_file() - not part of the exporter's initialization.
    requested_p_attrs = kwargs['p_attrs'].split(',')
    requested_s_attrs = kwargs['s_attrs'].split(',')
    group_sep = kwargs['group_sep']
    s_attr_sep = kwargs['s_attr_sep']

    s_attrs_in_data = sentence["structs"]
    self._opts.update(self._option_defaults)
    sep = self._opts['sentence_field_sep']  # '\t': Separator should be tab: this is picked up by _postprocess().
    left_toks = qr.get_sentence_tokens(sentence, 'left_context')
    match_toks = qr.get_sentence_tokens(sentence, 'match')
    right_toks = qr.get_sentence_tokens(sentence, 'right_context')

    match_tag_keys = [k for k in match_toks[0] if k not in ['word', 'structs']]
    match_tags = [[tok[k] if k in match_tag_keys else '' for k in requested_p_attrs] for tok in match_toks]
    match_tags = [[v if v else '' for v in tag] for tag in match_tags]
    match_tags_str = sep.join([group_sep.join(tup) for tup in zip(*match_tags)])

    struct_attrs = [s_attrs_in_data.get(k, '') for k in requested_s_attrs]
    struct_attrs_str = s_attr_sep.join(struct_attrs)

    left_words_str = ' '.join([d['word'] if d['word'] else '▯' for d in left_toks])
    match_words_str = group_sep.join([d['word'] if d['word'] else '▯' for d in match_toks])
    right_words_str = ' '.join([d['word'] if d['word'] else '▯' for d in right_toks])
    separated_sentence = sep.join([left_words_str, match_words_str, right_words_str, match_tags_str, struct_attrs_str])
    return f'{sentence["corpus"]}{sep}{separated_sentence}'
