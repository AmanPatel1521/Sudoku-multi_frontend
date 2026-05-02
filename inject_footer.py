import os

standard_footer = """
    <footer class="mt-5 pb-5">
        <div class="container text-center">
            <div class="mb-4 d-flex flex-wrap justify-content-center gap-2 gap-md-3">
                <a href="/blog.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Blogs</a>
                <span class="text-white-50">|</span>
                <a href="/about.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">About Us</a>
                <span class="text-white-50">|</span>
                <a href="/daily-sudoku-challenge.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Daily Challenge</a>
                <span class="text-white-50">|</span>
                <a href="/difficulty-levels.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Difficulty Levels</a>
                <span class="text-white-50">|</span>
                <a href="/common-mistakes.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Common Mistakes</a>
                <span class="text-white-50">|</span>
                <a href="/strategy-guide.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Strategy Guide</a>
                <span class="text-white-50">|</span>
                <a href="/sudoku-solver.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Sudoku Solver</a>
                <span class="text-white-50">|</span>
                <a href="/privacy.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Privacy Policy</a>
                <span class="text-white-50">|</span>
                <a href="/terms.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Terms of Service</a>
                <span class="text-white-50">|</span>
                <a href="/contact.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Contact Us</a>
            </div>
            <div class="small text-white-50">
                &copy; 2026 Multiplayer Sudoku. All rights reserved.
            </div>
        </div>
    </footer>
"""

for filename in os.listdir('.'):
    if filename.endswith('.html') and filename != 'daily-sudoku-challenge.html':
        with open(filename, 'r') as f:
            content = f.read()
        
        # Check if footer already exists (even partially)
        if '<footer' in content:
            # We already updated index.html, let's make sure it's correct
            if '/daily-sudoku-challenge.html' not in content:
                 # Logic to replace old footer with new one
                 import re
                 new_content = re.sub(r'<footer.*?</footer>', standard_footer, content, flags=re.DOTALL)
                 with open(filename, 'w') as f:
                     f.write(new_content)
                 print(f"Updated existing footer in {filename}")
        else:
            # Inject before </body>
            new_content = content.replace('</body>', standard_footer + '\n</body>')
            with open(filename, 'w') as f:
                f.write(new_content)
            print(f"Injected new footer in {filename}")

