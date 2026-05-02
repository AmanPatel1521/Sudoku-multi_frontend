import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

pattern = re.compile(
    r'<header class="main-header mb-5">\s*<div class="mt-2 mb-4">\s*<a href="([^"]+)" class="text-decoration-none text-info fw-bold">(.*?)</a>\s*</div>\s*<h1 class="([^"]+)">(.*?)</h1>\s*<p class="([^"]+)">(.*?)</p>\s*</header>',
    re.DOTALL
)

def replacer(match):
    href = match.group(1)
    text = match.group(2)
    h1_class = match.group(3)
    h1_text = match.group(4)
    p_class = match.group(5)
    p_text = match.group(6)
    
    return f"""<header class="main-header mb-5 text-center">
            <h1 class="{h1_class}">{h1_text}</h1>
            <p class="{p_class}">{p_text}</p>
            <div class="mt-4">
                <a href="{href}" class="btn btn-outline-light rounded-pill px-4">{text}</a>
            </div>
        </header>"""

for f in html_files:
    with open(f, 'r') as file:
        content = file.read()
    
    new_content = pattern.sub(replacer, content)
    
    if new_content != content:
        with open(f, 'w') as file:
            file.write(new_content)
        print(f"Updated {f}")

