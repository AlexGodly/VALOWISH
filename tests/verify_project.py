#!/usr/bin/env python3
"""VALOWISH v14 GitHub Pages static verification. Python stdlib only."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess

ROOT=Path(__file__).resolve().parents[1]
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.css=[];self.js=[];self.ids=set();self.links=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag=='script' and a.get('src'): self.js.append(a['src'])
        if tag=='link' and a.get('rel')=='stylesheet' and a.get('href','').startswith('./'):self.css.append(a['href'])
        if tag=='link' and a.get('rel')=='icon':self.links.append(a['href'])
parser=Parser();html=(ROOT/'index.html').read_text(encoding='utf8');parser.feed(html)
assert '<style>' not in html and '<script>' not in html,"found embedded code"
assert len(parser.js)==20 and len(parser.css)==4
for rel in parser.js+parser.css+parser.links:
    assert rel.startswith('./') and (ROOT/rel).is_file(),f'missing Pages asset: {rel}'
for name in 'browse wishlist priority locker history settings browseCards wishCards lockerCards browseStatusDropdown'.split():
    assert name in parser.ids,name
for ref in parser.js:
    subprocess.run(['node','--check',str(ROOT/ref)],check=True,capture_output=True)
assert "valowish_v14" in (ROOT/'src/core/config.js').read_text()
assert "slice(start,start+PAGE_SIZE)" in (ROOT/'src/pages/wishlist.js').read_text()
assert "loadCloudClient" in (ROOT/'src/services/cloud.js').read_text()
print(f'PASS: {len(parser.js)} JS scripts syntax-checked, {len(parser.css)} CSS files, favicon, all relative Pages paths and core page IDs.')
