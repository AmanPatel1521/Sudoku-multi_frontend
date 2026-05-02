import re

def create_sudoku_svg(highlights=[], numbers=[], lines=[], texts=[], title=""):
    # Base SVG
    svg = f'<svg viewBox="0 0 360 360" style="width: 100%; max-width: 360px; height: auto; border-radius: 8px; background: rgba(255,255,255,0.95); box-shadow: 0 4px 6px rgba(0,0,0,0.1);" xmlns="http://www.w3.org/2000/svg">\n'
    
    # Highlights (x, y, w, h, color)
    for h in highlights:
        svg += f'  <rect x="{h[0]*40}" y="{h[1]*40}" width="{h[2]*40}" height="{h[3]*40}" fill="{h[4]}" opacity="0.3"/>\n'
    
    # Grid lines
    for i in range(10):
        stroke_width = 3 if i % 3 == 0 else 1
        stroke = "#1e293b" if i % 3 == 0 else "#94a3b8"
        # Vertical
        svg += f'  <line x1="{i*40}" y1="0" x2="{i*40}" y2="360" stroke="{stroke}" stroke-width="{stroke_width}"/>\n'
        # Horizontal
        svg += f'  <line x1="0" y1="{i*40}" x2="360" y2="{i*40}" stroke="{stroke}" stroke-width="{stroke_width}"/>\n'
        
    # Numbers (x, y, val, color)
    for n in numbers:
        color = n[3] if len(n) > 3 else "#0f172a"
        weight = "bold" if color == "#0f172a" else "normal"
        svg += f'  <text x="{n[0]*40 + 20}" y="{n[1]*40 + 28}" font-family="Outfit, sans-serif" font-size="24" font-weight="{weight}" fill="{color}" text-anchor="middle">{n[2]}</text>\n'
        
    # Custom lines (x1, y1, x2, y2, color, dashed)
    for l in lines:
        dash = 'stroke-dasharray="5,5"' if len(l) > 5 and l[5] else ''
        svg += f'  <line x1="{l[0]*40+20}" y1="{l[1]*40+20}" x2="{l[2]*40+20}" y2="{l[3]*40+20}" stroke="{l[4]}" stroke-width="3" {dash}/>\n'

    # Custom texts (x, y, val, color, size)
    for t in texts:
        svg += f'  <text x="{t[0]*40+20}" y="{t[1]*40+28}" font-family="Outfit, sans-serif" font-size="{t[4]}" font-weight="bold" fill="{t[3]}" text-anchor="middle">{t[2]}</text>\n'

    svg += '</svg>'
    return svg

# 1. Blank grid highlighting rows, cols, boxes
svg1 = create_sudoku_svg(
    highlights=[(0, 2, 9, 1, "#3b82f6"), (4, 0, 1, 9, "#ef4444"), (6, 6, 3, 3, "#10b981")],
    texts=[(4.5, 2, "Row", "#1e40af", 18), (4, 4.5, "Col", "#991b1b", 18), (7.5, 7.5, "Box", "#065f46", 18)]
)

# 2. Cross-hatching for a 5
svg2 = create_sudoku_svg(
    highlights=[(0, 0, 3, 3, "#fef08a"), (2, 2, 1, 1, "#4ade80")],
    numbers=[(8, 0, "5", "#0f172a"), (5, 1, "5", "#0f172a")],
    lines=[(8, 0, 0, 0, "#ef4444", True), (5, 1, 0, 1, "#ef4444", True)],
    texts=[(2, 2, "5", "#166534", 24), (0, 0, "X", "#ef4444", 20), (1, 0, "X", "#ef4444", 20), (2, 0, "X", "#ef4444", 20), (0, 1, "X", "#ef4444", 20), (1, 1, "X", "#ef4444", 20), (2, 1, "X", "#ef4444", 20)]
)

# 3. Naked Pair 3,7
svg3 = create_sudoku_svg(
    highlights=[(1, 1, 1, 1, "#bfdbfe"), (1, 4, 1, 1, "#bfdbfe")],
    texts=[(1, 1, "3,7", "#2563eb", 14), (1, 4, "3,7", "#2563eb", 14), (1, 6, "X", "#ef4444", 20), (1, 8, "X", "#ef4444", 20)],
    numbers=[(1, 6, "3,8", "#94a3b8"), (1, 8, "7,9", "#94a3b8")]
)

# 4. X-Wing
svg4 = create_sudoku_svg(
    highlights=[(2, 1, 1, 1, "#bfdbfe"), (7, 1, 1, 1, "#bfdbfe"), (2, 5, 1, 1, "#bfdbfe"), (7, 5, 1, 1, "#bfdbfe")],
    texts=[(2, 1, "4", "#2563eb", 24), (7, 1, "4", "#2563eb", 24), (2, 5, "4", "#2563eb", 24), (7, 5, "4", "#2563eb", 24),
           (2, 3, "X", "#ef4444", 24), (2, 7, "X", "#ef4444", 24), (7, 8, "X", "#ef4444", 24)],
    lines=[(2, 1, 7, 1, "#3b82f6", False), (2, 5, 7, 5, "#3b82f6", False)]
)

# 5. Blitz target
svg5 = create_sudoku_svg(
    highlights=[(3, 3, 3, 3, "#fef08a")],
    numbers=[(3,3,"4"), (4,3,"9"), (5,3,"2"), (3,4,"1"), (5,4,"8"), (3,5,"7"), (4,5,"5")]
)

# 6. Slicing bands
svg6 = create_sudoku_svg(
    highlights=[(0, 0, 9, 3, "#bfdbfe"), (0, 3, 9, 3, "#fef08a"), (0, 6, 9, 3, "#bbf7d0")],
    texts=[(4.5, 1.5, "Band 1", "#1e40af", 24), (4.5, 4.5, "Band 2", "#854d0e", 24), (4.5, 7.5, "Band 3", "#166534", 24)]
)


# Replace in files
import re

def replace_placeholder(filename, search_text, svg_content):
    with open(filename, 'r') as f:
        content = f.read()
    
    # Create the full replacement HTML
    replacement = f'<div class="my-4 text-center">\n{svg_content}\n</div>'
    
    # We will look for the div containing the exact placeholder text
    pattern = re.compile(r'<div[^>]*>\s*<p[^>]*>\[Image Placeholder: ' + re.escape(search_text) + r'\]</p>\s*</div>')
    
    new_content = pattern.sub(replacement, content)
    with open(filename, 'w') as f:
        f.write(new_content)


replace_placeholder('how-to-play-sudoku.html', 'A blank Sudoku grid highlighting Rows, Columns, and 3x3 Boxes', svg1)
replace_placeholder('how-to-play-sudoku.html', 'Visual diagram showing red lines projecting from existing 5s, highlighting a single safe cell for the new 5', svg2)
replace_placeholder('how-to-play-sudoku.html', 'Screenshot showing a Naked Pair of 3 and 7, with arrows showing the elimination of 3s and 7s from adjacent cells', svg3)
replace_placeholder('how-to-play-sudoku.html', 'A grid highlighting an X-Wing pattern in blue, with red X\'s showing the eliminated candidates in the columns', svg4)

replace_placeholder('multiplayer-sudoku-strategy.html', 'Screenshot highlighting a 3x3 box with 7 pre-filled numbers, demonstrating a prime \'Blitz\' target', svg5)
replace_placeholder('multiplayer-sudoku-strategy.html', 'Diagram showing the Sudoku board divided into three horizontal shaded bands', svg6)

print("SVGs injected successfully.")
