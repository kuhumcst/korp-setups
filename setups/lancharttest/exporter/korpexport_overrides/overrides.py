from korpexport import queryresult as qr


def _format_sentence_override(self, sentence, **kwargs):
    """Format a single sentence (= a delimited row in a given dataset).

    This overrides _format_sentence in KorpExportFormatter in formatter.py.
    It is a bit less abstract and hopefully a bit easier to understand.
    On the other hand it is of course less flexible.
    """
    p_attrs = kwargs['p_attrs'].split(',')
    s_attrs = kwargs['s_attrs'].split(',')
    self._opts.update(self._option_defaults)
    sep = self._opts['sentence_field_sep']  # '\t': Separator should be tab: this is picked up by _postprocess().
    left_toks = qr.get_sentence_tokens(sentence, 'left_context')
    match_toks = qr.get_sentence_tokens(sentence, 'match')
    right_toks = qr.get_sentence_tokens(sentence, 'right_context')

    match_tag_keys = [k for k in match_toks[0] if k not in ['word', 'structs']]
    match_tags = [[tok[k] if k in match_tag_keys else '' for k in p_attrs] for tok in match_toks]
    match_tags = [[v if v else '' for v in tag] for tag in match_tags]
    match_tags_str = sep.join([sep.join(tup) for tup in zip(*match_tags)])

    left_words_str = ' '.join([d['word'] for d in left_toks])
    match_words_str = ' '.join([d['word'] for d in match_toks])
    right_words_str = ' '.join([d['word'] for d in right_toks])
    separated_sentence = sep.join([left_words_str, match_words_str, right_words_str, match_tags_str])
    return f'{sentence["corpus"]}{sep}{separated_sentence}'
