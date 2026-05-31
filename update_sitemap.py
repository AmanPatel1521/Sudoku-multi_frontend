import os
import xml.etree.ElementTree as ET
from xml.dom import minidom

base_url = "https://multiplayersudoku.in/"

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'googledd70a0d53d5cb57a.html']

urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

for f in sorted(html_files):
    url = ET.SubElement(urlset, "url")
    loc = ET.SubElement(url, "loc")
    
    if f == 'index.html' or f == 'play-multiplayer-sudoku-online.html':
        loc.text = base_url if f == 'index.html' else base_url + f
        changefreq = ET.SubElement(url, "changefreq")
        changefreq.text = "daily"
        priority = ET.SubElement(url, "priority")
        priority.text = "1.0"
    elif f in ['sudoku-solver.html', 'daily-sudoku-challenge.html', 'leaderboard.html', 'blog.html', 'daily-challenges.html']:
        loc.text = base_url + f
        changefreq = ET.SubElement(url, "changefreq")
        changefreq.text = "daily"
        priority = ET.SubElement(url, "priority")
        priority.text = "0.9"
    elif f in ['privacy.html', 'terms.html', 'contact.html', 'about.html']:
        loc.text = base_url + f
        changefreq = ET.SubElement(url, "changefreq")
        changefreq.text = "monthly"
        priority = ET.SubElement(url, "priority")
        priority.text = "0.5"
    else:
        loc.text = base_url + f
        changefreq = ET.SubElement(url, "changefreq")
        changefreq.text = "weekly"
        priority = ET.SubElement(url, "priority")
        priority.text = "0.8"

xmlstr = minidom.parseString(ET.tostring(urlset)).toprettyxml(indent="  ")
with open("sitemap.xml", "w") as f:
    f.write(xmlstr)

print("Updated sitemap.xml")
