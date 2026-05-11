import os
import re

standard_footer = """    <footer id="seo-footer" class="pt-4 pb-2 footer-container">
        <div class="container text-center">
            <div class="row mb-3 text-center">
                <div class="col-md-8 offset-md-2">
                    <h5 class="text-white">About Multiplayer Sudoku</h5>
                    <p class="small text-white-50">Multiplayer Sudoku is a completely free, real-time competitive logic puzzle game. Test your speed and accuracy against players globally. Fill the 9x9 grid so that each column, row, and 3x3 box contains all digits from 1 to 9. Play solo to practice, or join a room to challenge friends.</p>
                </div>
            </div>
            <div class="d-flex justify-content-center flex-wrap gap-3 mb-2">
                <a href="/" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Home</a>
                <span class="text-white-50">|</span>
                <a href="/blog.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Blog</a>
                <span class="text-white-50">|</span>
                <a href="/sudoku-difficulty-levels.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Difficulty Levels</a>
                <span class="text-white-50">|</span>
                <a href="/common-sudoku-mistakes.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Common Mistakes</a>
                <span class="text-white-50">|</span>
                <a href="/multiplayer-sudoku-strategy.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Strategy Guide</a>
                <span class="text-white-50">|</span>
                <a href="/sudoku-solver.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Sudoku Solver</a>
                <span class="text-white-50">|</span>
                <a href="/about.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">About Us</a>
                <span class="text-white-50">|</span>
                <a href="/daily-sudoku-challenge.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Daily Challenge</a>
                <span class="text-white-50">|</span>
                <a href="/privacy.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Privacy Policy</a>
                <span class="text-white-50">|</span>
                <a href="/terms.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Terms of Service</a>
                <span class="text-white-50">|</span>
                <a href="/contact.html" class="text-decoration-none text-white opacity-75 hover-opacity-100 fw-bold">Contact Us</a>
            </div>
            <div class="small text-white-50 mt-2">
                &copy; 2026 Multiplayer Sudoku. All rights reserved.
            </div>
        </div>
    </footer>"""

theme_script = """<script>if(localStorage.getItem('sudoku-theme')==='light')document.body.classList.add('light-mode');</script>"""

for root, dirs, files in os.walk('.'):
    # skip node_modules and build if they exist, but actually it's fine just .
    if 'node_modules' in root: continue
    for filename in files:
        if filename.endswith('.html'):
            filepath = os.path.join(root, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace footer
            # This regex finds <footer ... > ... </footer>
            new_content = re.sub(r'<footer[^>]*>.*?</footer>', standard_footer, content, flags=re.DOTALL)
            
            # Inject theme script if not present
            if "sudoku-theme" not in new_content:
                # Add before </head>
                new_content = new_content.replace('</head>', f'{theme_script}\n</head>')
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
