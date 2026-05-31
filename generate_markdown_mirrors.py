import os
import glob
from bs4 import BeautifulSoup

def html_to_markdown(html_content, url_path):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Extract title and description
    title = soup.title.string if soup.title else 'No Title'
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    description = meta_desc['content'] if meta_desc else 'No Description'

    # Extract main content (assuming it's in #main-container or fallback to body)
    main_container = soup.find(id='main-container')
    if not main_container:
        main_container = soup.find('body')
        
    if not main_container:
        return None

    # Remove scripts, styles, and navs
    for tag in main_container(['script', 'style', 'nav', 'footer']):
        tag.decompose()

    text_content = main_container.get_text(separator='\n', strip=True)

    # Add frontmatter and structured markdown
    markdown = f"""---
title: "{title}"
description: "{description}"
url: "https://multiplayersudoku.in/{url_path}"
---

# {title}

{text_content}
"""
    return markdown

def main():
    print("Generating Markdown Mirrors...")
    html_files = glob.glob('*.html')
    
    mirror_dir = 'md_mirrors'
    if not os.path.exists(mirror_dir):
        os.makedirs(mirror_dir)

    processed_files = []

    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        md_content = html_to_markdown(content, html_file)
        if md_content:
            md_filename = html_file.replace('.html', '.md')
            md_path = os.path.join(mirror_dir, md_filename)
            
            with open(md_path, 'w', encoding='utf-8') as mf:
                mf.write(md_content)
            
            processed_files.append((html_file, md_filename))
            print(f"Generated: {md_path}")
            
    print(f"Successfully generated {len(processed_files)} markdown mirrors.")

    # Update llms.txt with the mirrors
    try:
        with open('llms.txt', 'a', encoding='utf-8') as f:
            f.write("\n\n## Markdown Documentation Mirrors\n")
            f.write("The following files are clean markdown versions of our core pages, optimized for AI consumption:\n")
            for html_file, md_file in processed_files:
                f.write(f"- [{html_file}](https://multiplayersudoku.in/md_mirrors/{md_file})\n")
        print("Updated llms.txt with mirror links.")
    except Exception as e:
        print(f"Failed to update llms.txt: {e}")

if __name__ == "__main__":
    main()
