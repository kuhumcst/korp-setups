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


def add_links(data: list):
    """Tilføj URL-links."""

    def add_link(text_elem):
        """Tilføj link til et enkelt <text>-element"""
        return re.sub(r'>$', ' url="LINK HER">', text_elem)

    return [add_link(line) if line.startswith('<text ') else line for line in data]


def write_outfile(data, outfile):
    """Skriv de færdigprocesserede vrt-data til fil."""
    with open(outfile, 'w', encoding='utf8') as out:
        out.write('\n'.join(data))


def main():
    rootpath = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', '..'))
    inputpath = os.path.join(rootpath, 'processing', 'data', 'input', 'DUDSDFK_BILLall.cqp')
    outputpath = os.path.join(rootpath, 'processing', 'data', 'output', 'DUDSDFK_BILLall.cqp')

    data = get_inputdata(inputpath)
    data_with_links = add_links(data)
    write_outfile(data_with_links, outputpath)


if __name__ == '__main__':
    main()
