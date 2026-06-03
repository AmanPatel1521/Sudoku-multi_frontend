import os
import re

new_footer = """    <footer id="seo-footer" class="pt-5 pb-4 mt-5" style="background-color: rgba(0, 0, 0, 0.2);">
        <div class="container text-center text-md-start">
            <div class="row mb-4">
                <div class="col-12 col-md-4 mb-4 mb-md-0">
                    <h5 class="text-white fw-bold mb-3">Multiplayer Sudoku</h5>
                    <p class="small text-white-50 pe-md-4">A completely free, real-time competitive logic puzzle game. Test your speed and accuracy against players globally.</p>
                </div>
                <div class="col-6 col-md-2 offset-md-1 mb-3 mb-md-0">
                    <h6 class="text-white fw-bold mb-3">Game</h6>
                    <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
                        <li><a href="/" class="text-decoration-none text-white opacity-75 hover-opacity-100">Play Now</a></li>
                        <li><a href="/leaderboard.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">Leaderboards</a></li>
                        <li><a href="/daily-sudoku-challenge.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">Daily Challenge</a></li>
                        <li><a href="/sudoku-solver.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">Sudoku Solver</a></li>
                    </ul>
                </div>
                <div class="col-6 col-md-3 mb-3 mb-md-0">
                    <h6 class="text-white fw-bold mb-3">Guides &amp; Tips</h6>
                    <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
                        <li><a href="/blog.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">Blog</a></li>
                        <li><a href="/multiplayer-sudoku-strategy.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">Strategy Guide</a></li>
                        <li><a href="/sudoku-difficulty-levels.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">Difficulty Levels</a></li>
                        <li><a href="/common-sudoku-mistakes.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">Common Mistakes</a></li>
                    </ul>
                </div>
                <div class="col-12 col-md-2 mt-3 mt-md-0">
                    <h6 class="text-white fw-bold mb-3">Company</h6>
                    <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
                        <li><a href="/about.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">About Us</a></li>
                        <li><a href="/contact.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">Contact</a></li>
                        <li><a href="/terms.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">Terms of Service</a></li>
                        <li><a href="/privacy.html" class="text-decoration-none text-white opacity-75 hover-opacity-100">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <hr class="border-secondary opacity-25">
            <div class="small text-white-50 text-center mt-3">
                &copy; 2026 Multiplayer Sudoku. All rights reserved.
            </div>
        </div>
    </footer>"""

for filename in os.listdir('.'):
    if filename.endswith('.html') and filename != 'googledd70a0d53d5cb57a.html':
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace existing footer
        if re.search(r'<footer.*?</footer>', content, flags=re.DOTALL):
            new_content = re.sub(r'<footer.*?</footer>', new_footer, content, flags=re.DOTALL)
        else:
            # Inject before </body> if no footer exists
            new_content = content.replace('</body>', new_footer + '\n</body>')
            
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
