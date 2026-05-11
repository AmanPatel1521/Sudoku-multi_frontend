import os

theme_script_old = """<script>if(localStorage.getItem('sudoku-theme')==='light')document.body.classList.add('light-mode');</script>"""
theme_script_new = """<script>
document.addEventListener("DOMContentLoaded", function() {
    if(localStorage.getItem('sudoku-theme') === 'light') {
        document.body.classList.add('light-mode');
    }
});
</script>"""

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root: continue
    for filename in files:
        if filename.endswith('.html'):
            filepath = os.path.join(root, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content.replace(theme_script_old, theme_script_new)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
