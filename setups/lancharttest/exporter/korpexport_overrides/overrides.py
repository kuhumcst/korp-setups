from korpexport import queryresult as qr


def _format_sentence_override(self, sentence, **kwargs):
    """Format a single sentence.

    Format keys in ``sentence_format``: ``corpus`` (the name (id)
    of the corpus), ``match_pos`` (corpus position (the number of
    the first token) of the match), ``tokens`` (all tokens in the
    sentence), ``match`` (the tokens that are part of the match),
    ``left_context`` (the tokens that precede the match),
    ``right_context`` (the tokens that follow the match),
    *attrs*´´_´´*type* where *attrs* is an attribute listed in
    ``sentence_token_attrs`` (pluralized) and *type* one of
    ``all``, ``match``, ``left_context``, ``right_context`` (list
    of values of all the attributes *attr* in tokens of *type* in
    the sentence), ``aligned`` (aligned sentences in a parallel
    corpus), ``structs`` (formatted structural attributes of the
    sentence), ``struct`` (a dict of the structural attributes,
    unformatted), ``sentence_num`` (the number of the sentence in
    this list of sentences, a zero-based integer), ``hit_num´´
    (the (global) number of the hit in the result, a zero-based
    integer), ``arg`` (a dict of additional keyword arguments
    passed), ``info`` (formatted sentence information), ``fields``
    (formatted sentence fields as specified in the option
    ``sentence_fields``); names of structural attributes
    (unformatted); ``corpus_info`` (formatted corpus info);
    ``corpus_info_field`` (unformatted corpus info fields); those
    listed in :method:`_init_infoitems`; those listed in
    :method:`_get_corpus_info`.
    """

    # struct cannot be a lambda function, since its keys are
    # referred to elsewhere.
    # logging.info(f'_format_sentence Sentence: {type(sentence)} | {str(sentence)}')
    # struct = self._get_formatted_sentence_structs(sentence, **kwargs)
    # logging.info(f'_format_sentence struct: {type(struct)} | {str(struct)}')
    # corpus = qr.get_sentence_corpus(sentence)
    # logging.info(f'_format_sentence corpus: {type(corpus)} | {str(corpus)}')
    # corpus_info = self._get_corpus_info(sentence)
    # logging.info(f'_format_sentence corpus_info: {type(corpus_info)} | {str(corpus_info)}')
    # format_args = dict(
    #     corpus=corpus,
    #     match_pos=qr.get_sentence_match_position(sentence),
    #     match_open=self._opts["match_open"],
    #     match_close=self._opts["match_close"],
    #     aligned=lambda: self._format_aligned_sentences(sentence),
    #     structs=lambda: self._format_structs(sentence),
    #     struct=struct,
    #     corpus_info_field=corpus_info,
    #     hit_num=lambda: (int(self._infoitems["param"].get("start") or 0)
    #                      + kwargs["sentence_num"]),
    #     arg=kwargs)
    # tokens_type_info = [
    #     ("tokens", dict(tokens_type="all")),
    #     ("match", dict(match_mark=self._opts.get("match_marker", ""))),
    #     ("left_context", {}),
    #     ("right_context", {}),
    # ]
    # logging.info(f'_format_sentence tokens_type_info: {type(tokens_type_info)} | {str(tokens_type_info)}')
    #
    # for tokens_type, opts in tokens_type_info:
    #     if "tokens_type" not in opts:
    #         opts["tokens_type"] = tokens_type
    #     opts.update(kwargs)
    #     logging.info(f'_format_sentence token_type: {type(opts["tokens_type"])} | {str(opts["tokens_type"])}')
    #     tokens = qr.get_sentence_tokens(sentence, opts["tokens_type"])
    #     logging.info(f'_format_sentence tokens: {type(tokens)} | {str(tokens)}')
    #     if (self._opts["match_open"] or self._opts["match_close"]
    #         or self._opts["match_marker"]):
    #         if tokens_type == "tokens":
    #             opts["match_start"] = qr.get_sentence_match_info(sentence,
    #                                                              "start")
    #             opts["match_end"] = qr.get_sentence_match_info(sentence,
    #                                                            "end")
    #         elif tokens_type == "match":
    #             opts["match_start"] = 0
    #             opts["match_end"] = len(tokens)
    #     # Pass default arguments to lambda, so that each call gets
    #     # its own argument values
    #     format_args[tokens_type] = (lambda tokens=tokens, opts=opts:
    #                                 self._format_tokens(tokens, **opts))
    #     for attrname in self._sentence_token_attrs:
    #         tokens_type2 = tokens_type if tokens_type != "tokens" else "all"
    #         format_arg_name = (self._sentence_token_attr_labels[attrname]
    #                            + "_" + tokens_type2)
    #         format_args[format_arg_name] = (
    #             lambda tokens=tokens, attrname=attrname, opts=opts:
    #             self._format_tokens(tokens, attr_only=attrname, **opts))
    # format_args.update(kwargs)
    # # Allow direct format references to struct names (unformatted
    # # values)
    # format_args.update(dict(self._get_sentence_structs(sentence)))
    # format_args.update(self._infoitems)
    # format_args.update(corpus_info)
    # format_args.update(
    #     dict(corpus_info=lambda: self._format_corpus_info(**format_args)))
    # format_args.update(
    #     dict(info=lambda: self._format_item("sentence_info",
    #                                         **format_args)))
    # sent_fields = self._format_list(
    #         "sentence_field",
    #         self._opts.get("sentence_fields", []),
    #         **format_args)
    # logging.info(f'_format_sentence sentence fields: {type(sent_fields)} | {str(sent_fields)}')
    #
    # logging.info(f'_format_sentence format args: {str(dict(**format_args))}')
    # return self._format_item(
    #     "sentence",
    #     # fields=lambda: self._format_list(
    #     #     "sentence_field",
    #     #     self._opts.get("sentence_fields", []),
    #     #     **format_args),
    #     fields=lambda: 'BLAHAAA',
    #     **format_args)
    self._opts.update(self._option_defaults)
    sep = self._opts['sentence_field_sep']  # '\t'  # Separator should be tab as this is picked up by _postprocess().
    left_tokens = qr.get_sentence_tokens(sentence, 'left_context')
    match_tokens = qr.get_sentence_tokens(sentence, 'match')
    right_tokens = qr.get_sentence_tokens(sentence, 'right_context')

    match = [[v if v else '' for k, v in tok.items() if k not in ['word', 'structs']] for tok in match_tokens]
    match_annotations = sep.join([sep.join(tup) for tup in zip(*match)])

    left_words = ' '.join([d['word'] for d in left_tokens])
    match_words = ' '.join([d['word'] for d in match_tokens])
    right_words = ' '.join([d['word'] for d in right_tokens])
    separated_sentence = sep.join([left_words, match_words, right_words, match_annotations])
    return f'{sentence["corpus"]}{sep}{separated_sentence}'
