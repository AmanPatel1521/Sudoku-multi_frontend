import os

head_script = '''<script async custom-element="amp-auto-ads"
        src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
</script>'''

body_tag = '''<amp-auto-ads type="adsense"
        data-ad-client="ca-pub-9821792173458370">
</amp-auto-ads>'''

def inject_amp(directory):
    count = 0
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root or 'android/app/build' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                modified = False
                
                if head_script not in content and '</head>' in content:
                    content = content.replace('</head>', f'{head_script}\n</head>', 1)
                    modified = True
                
                if body_tag not in content and '<body' in content:
                    # Find where the <body> tag ends
                    body_idx = content.find('<body')
                    if body_idx != -1:
                        close_bracket_idx = content.find('>', body_idx)
                        if close_bracket_idx != -1:
                            insert_idx = close_bracket_idx + 1
                            content = content[:insert_idx] + f'\n{body_tag}' + content[insert_idx:]
                            modified = True
                            
                if modified:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Injected AMP ads to {path}")
                    count += 1
    print(f"Total files updated: {count}")

if __name__ == '__main__':
    inject_amp('.')
