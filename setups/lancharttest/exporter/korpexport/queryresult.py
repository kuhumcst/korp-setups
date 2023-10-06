# -*- coding: utf-8 -*-

"""
Functions for accessing Korp query result elements (a dict).

To keep things simple, the Korp query result dict is kept as a
(composite) dictionary and not converted to a composite object. The
components of the query result or its parts can be accessed using the
functions in this module.

:Author: Jyrki Niemi <jyrki.niemi@helsinki.fi> for FIN-CLARIN
:Date: 2014
"""





def get_sentences(query_result):
    """Get the sentences  contained in `query_result`."""
    return query_result.get("kwic", [])


def get_hitcount(query_result):
    """Get the total number of hits in `query_result`."""
    return query_result.get("hits", 0)


def get_corpus_hitcount(query_result, corpus=None):
    """Get the number of hits for a single corpus or all corpora.

    Arguments:
        query_result (dict): The query result from which to get the
            number of hits
        corpus (str): The name (id) of the corpus for which to return
            the number of hits

    Returns:
        str|dict: If `corpus` is specified, the number of hits in it
            (as a str); otherwise, a dict of the number of hits for
            all corpora, with corpus id as the key and the number of
            hits as the value.
    """
    if corpus is None:
        return query_result.get("corpus_hits", {})
    else:
        return query_result.get("corpus_hits", {}).get(corpus, 0)


def get_occurring_attrnames(query_result, keys, struct_name):
    """Get the attribute names that actually occur in a query result.

    Arguments:
        query_result (dict): The query result to inspect
        keys (list): The attribute names to look for in the result
        struct_name (str): The structure in query result in which to
            check the attribute names: either ``tokens`` for word
            (positional) attributes or ``structs`` for structural
            attributes

    Returns:
        list[str]: The attribute names in ` keys` that occur in the
            `struct_name` of `query_result`
    """
    # FIXME: This does not take into account attributes in aligned
    # sentences
    occurring_keys = set()
    for sent in get_sentences(query_result):
        result_struct = sent.get(struct_name)
        if isinstance(result_struct, list):
            for item in result_struct:
                occurring_keys |= set(item.keys())
        elif result_struct:
            occurring_keys |= set(result_struct.keys())
    return [key for key in keys if key in occurring_keys]


def get_occurring_corpus_info(query_result):
    """Return the keys of ``corpus_info`` in `query_result` as a set."""
    result = set()
    for sentence in get_sentences(query_result):
        for key, val in (sentence.get("corpus_info") or {}).items():
            if isinstance(val, str):
                result.add(key)
            else:
                for subval in val:
                    result.add(key + "_" + subval)
    return result


def get_sentence_corpus(sentence):
    """Get the corpus id (str) for `sentence`."""
    return sentence.get("corpus", "")


def get_sentence_corpus_urn(sentence):
    """Get the corpus URN for `sentence`."""
    return get_sentence_corpus_info_item(sentence, "urn")


def get_sentence_corpus_info_item(sentence, item, subitem=None):
    """Get a corpus info item value for `sentence`.

    Arguments:
        sentence (dict): The sentence for which to get corpus info
        item (str): The (main) item name in `sentence["corpus_info"]`
        subitem (str): The name of a subitem in `item` which is a
            dict; if `None`, `item` is a string.

    Returns:
        str: The requested info item from `sentence["corpus_info"]` if
            it exists; otherwise, the empty string
    """
    info = sentence.get("corpus_info") or {}
    if item in info:
        if subitem is not None:
            if not isinstance(info[item], str) and subitem in info[item]:
                return info[item][subitem]
            else:
                return ""
        else:
            return info[item]
    else:
        return ""


def get_sentence_corpus_link(sentence, itemname=None, urn_resolver=""):
    """Get the value of a corpus URN or URL info item for `sentence`.

    Arguments:
        sentence (dict): The sentence for which to get link info
        itemname (str): The name (dict key in corpus info) of the main
            object (a dict) from which to get ``urn`` or ``url``; if
            `None`, get the unqualified ``urn`` or ``url``
        urn_resolver (str): The string to prefix to a URN

    Returns:
        str: The URN (preferred) or URL in the `itemname` (or top
            level) of the corpus info for `sentence`, URN prefixed
            with `urn_resolver`
    """
    for linktype in ["urn", "url"]:
        if itemname:
            link = get_sentence_corpus_info_item(sentence, itemname, linktype)
        else:
            link = get_sentence_corpus_info_item(sentence, linktype)
        if link:
            if linktype == "urn" and urn_resolver:
                link = urn_resolver + link
            return link
    return ""


def get_sentence_tokens_base(sentence, start, end):
    """Get the tokens (list) of `sentence`, in the range [`start`:`end`]."""
    if (start is None or start >= 0) and (end is None or end >= 0):  #
        return sentence["tokens"][start:end]
    else:
        return []


def get_sentence_tokens_all(sentence):
    """Get all tokens in `sentence`."""
    return get_sentence_tokens_base(sentence, None, None)


def get_sentence_match(sentence):
    """Get match information in `sentence`; empty dict if none."""
    return sentence.get("match", {})


def get_sentence_match_info(sentence, infoname):
    """Get match information `infoname` in `sentence`; -1 if nonexistent."""
    return get_sentence_match(sentence).get(infoname, -1)


def get_sentence_tokens_match(sentence):
    """Get the tokens in `sentence` that are part of the query match."""
    match = get_sentence_match(sentence)
    if match:
        return get_sentence_tokens_base(sentence, match.get("start"),
                                        match.get("end"))
    else:
        return []


def get_sentence_tokens_left_context(sentence):
    """Get the tokens in `sentence` on the left of the query match.

    If no match in `sentence`, return all tokens.
    """
    match_start = get_sentence_match_info(sentence, "start")
    if match_start < 0:
        match_start = None
    return get_sentence_tokens_base(sentence, None, match_start)


def get_sentence_tokens_right_context(sentence):
    """Get the tokens in `sentence` on the right of the query match."""
    return get_sentence_tokens_base(
        sentence, get_sentence_match_info(sentence, "end"), None)


def get_sentence_tokens(sentence, type_):
    """Get the toknes in `sentence` of the kind specified by `type_`."""
    return globals()["get_sentence_tokens_" + type_](sentence)


def get_sentence_match_position(sentence):
    """Get the corpus position (token number) of the match in `sentence`."""
    return get_sentence_match_info(sentence, "position")


def get_aligned_sentences(sentence):
    """Get the aligned sentences for `sentence` in a parallel corpus.

    Returns:
        list[(str, dict)]: A list of pairs (align key, sentence) of
            the aligned sentences; the align key is the name of the
            alignment attribute, corresponding to the id of the
            aligned corpus. The list is sorted by the align key.
    """
    return sorted(sentence.get("aligned", {}).items())


def get_sentence_structs(sentence, structnames=None):
    """Get the structural attributes (name-value pairs) of `sentence`.

    Arguments:
        sentence (dict): The sentence for which to get the structures
        structnames (list[str]): The names of the structures to get;
            if `None`, get all structures

    Returns:
        list[(str, str)]: A list of pairs (struct name, value) of the
            structures occurring in `sentence`. If a value is `None`,
            it is converted to an empty string.
    """
    sentence_structs = sentence.get("structs")
    if sentence_structs is None:
        return []
    elif structnames is None:
        return list(sentence_structs.items())
    else:
        # Value may be None; convert them to empty strings
        return [(structname, sentence_structs.get(structname) or "")
                for structname in structnames]


def get_sentence_struct_values(sentence, structnames=None):
    """Get a list of the structural attribute values of `sentence`."""
    return [value for name, value in
            get_sentence_structs(sentence, structnames)]


def get_token_attrs(token, attrnames=None):
    """Get the (positional) attributes (name-value pairs) of `token`.

    Arguments:
        token (dict): The token for which to get the attributes
        attrnames (list[str]): The names of the attributes to get; if
            `None`, get all attributes

    Returns:
        list[(str, str)]: A list of pairs (attribute name, value) of
            the attributes occurring in `token`
    """
    if attrnames is None:
        return [(attrname, val) for attrname, val in token.items()
                if attrname != "structs"]
    else:
        return [(attrname, token.get(attrname) or "") for attrname in attrnames]


def get_token_attr(token, attrname="word"):
    """Get a single (positional) attribute value of `token`.

    Arguments:
        token (dict): The token for which to get the attributes
        attrname (str): The name of the attributes to get

    Returns:
        str: The value of attribute `attrname` in `token`; `None` if
            not found
    """
    return token.get(attrname)


def get_token_structs_open(token, combine_attrs=False):
    """Get a list of the structures that open at (immediately before) `token`.

    Arguments:
        token (dict): The token for which to get the opening
            structural attributes
        combine_attrs (bool): Corpus Workbench (on which Korp is
            based) represents XML element *e* with attribute names *a*
            and *b* as structural attributes *e_a* and *e_b*. If
            `combine_attrs` is `False` (the default), return them as
            such. If it is `True`, combine the attributes and return
            the structure *e* with a list of attribute name-value
            pairs (containing *a* and *b*).

    Returns:
        list[str] | list[(str, list[(str, str)])]: A list of
            structural attributes (name, possibly followed by a space
            and the value) if `combine_attrs` is `False`; otherwise a
            list of pairs (struct name, list of attribute (name,
            value) pairs)
    """
    return _get_token_structs(token, "open", combine_attrs)


def get_token_structs_close(token, combine_attrs=False):
    """Get a list of the structures that close at (immediately after) `token`.

    Arguments:
        token (dict): The token for which to get the closing
            structural attributes
        combine_attrs (bool): If `False` (the default), return
            structural attributes as represented in CWB (see the
            arguments of :func:`get_token_structs_open`) such. If
            `True`, return the structure only once for each element,
            disregarding element attribute names.

    Returns:
        list[str] | list[(str, [])]: A list of structural attribute
            names (*elemname*_*attrname*) if `combine_attrs` is
            `False`; otherwise a list of pairs (*elemname*, []), where
            the second element is always an empty list.
    """
    return _get_token_structs(token, "close", combine_attrs)


def _get_token_structs(token, struct_type, combine_attrs=False):
    """Get the list of structural attributes at `token`.

    Arguments:
        token (dict): The token for which to get the structures
        struct_type (str): The structure type to get: either ``open``
            or ``close``
        combine_attrs (bool): `True` to combine attributes XML-style,
            `False` to keep them as in Corpus Workbench
    """
    try:
        structs = token["structs"][struct_type]
    except KeyError:
        return []
    if combine_attrs:
        structs = _combine_struct_attrs(structs, struct_type)
    return structs


def _combine_struct_attrs(structs, struct_type):
    """Combine the attributes in structures `structs`.

    Return the structures `structs` so that each XML element is
    represented only once with a list of its attributes.

    Note that the function assumes that element names do not contain
    underscores, whereas attribute names may contain them.
    """
    result_structs = []
    for struct in structs:
        if struct_type == "open":
            struct, sp, attrval = struct.partition(" ")
            if not sp:
                attrval = None
        else:
            attrval = None
        struct, _, attrname = struct.partition("_")
        if not result_structs or result_structs[-1][0] != struct:
            result_structs.append((struct, []))
        if attrval is not None:
            result_structs[-1][1].append((attrname, attrval))
    return result_structs


def is_parallel_corpus(query_result):
    """Test if `query_result` is from a parallel corpus."""
    # FIXME: This does not work if the script gets the query result
    # from frontend instead of redoing the query, since the frontend
    # has processed the corpus names not to contain the vertical bar.
    # A more reliable way would be to go through the query_result to
    # find "aligned" attributes.
    try:
        return "|" in query_result["kwic"][0]["corpus"]
    except (KeyError, IndexError):
        return False
