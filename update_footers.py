import os

footer_to_find = """<a href="/about.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">About Us</a>"""
footer_to_replace = """<a href="/about.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">About Us</a>
                <span class="text-white-50">|</span>
                <a href="/daily-sudoku-challenge.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Daily Challenge</a>"""

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r') as f:
            content = f.read()
        
        if footer_to_find in content and "/daily-sudoku-challenge.html" not in content:
            new_content = content.replace(footer_to_find, footer_to_replace)
            with open(filename, 'w') as f:
                f.write(new_content)
            print(f"Updated footer in {filename}")

