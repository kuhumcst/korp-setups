import json
import os
import re

"""
Indlæs /Users/phb514/my_git/infrastructure/korp/setups/billeballads/processing/data/input/DUDSDFK_BILLall.cqp

Tilføj links fra resources/linklist.json til <text>-elementer.
"""


def get_inputdata(filename: str):
    """Hent den vrt-fil der skal forsynes med URL'er til HTML-visninger."""
    with open(filename, 'r', encoding='utf8') as infile:
        return infile.read().splitlines()


def add_links(data: list, linkdict: dict):
    """Tilføj URL-links."""

    base = 'https://cst.dk/dighumlab/duds/DFK/Dorthe/html/'

    def add_link(text_elem, urlbase=base):
        """Tilføj link til et enkelt <text>-element"""
        title = re.match(r'<text title="(.+) \[', text_elem).groups()[0]
        htmlfile = linkdict[title]
        return re.sub(r'>$', f' url="{urlbase}{htmlfile}">', text_elem)

    return [add_link(line) if line.startswith('<text ') else line for line in data]


def write_outfile(data, outfile):
    """Skriv de færdigprocesserede vrt-data til fil."""
    with open(outfile, 'w', encoding='utf8') as out:
        out.write('\n'.join(data))


def main():
    rootpath = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', '..'))
    inputpath = os.path.join(rootpath, 'processing', 'data', 'input', 'DUDSDFK_BILLall.cqp')
    jsonpath = os.path.join(rootpath, 'processing', 'data', 'resources', 'linklist.json')
    outputpath = os.path.join(rootpath, 'processing', 'data', 'output', 'DUDSDFK_BILLall.cqp')

    """
    with open(jsonpath, 'w') as jsonfile:
        json.dump(dict(zip(KEYS, VALS)), jsonfile, indent=2, ensure_ascii=False)
    """

    with open(jsonpath, 'r') as jsonfile:
        linkdict = json.load(jsonfile)

    data = get_inputdata(inputpath)
    data_with_links = add_links(data, linkdict)
    write_outfile(data_with_links, outputpath)


if __name__ == '__main__':
    main()
