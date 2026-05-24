import os

adsense_code = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9821792173458370" crossorigin="anonymous"></script>'

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if adsense_code in content:
        continue
        
    if '<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9821792173458370" crossorigin="anonymous"></script> -->' in content:
        content = content.replace('<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9821792173458370" crossorigin="anonymous"></script> -->', adsense_code)
    else:
        # Inject just before </head>
        content = content.replace('</head>', f'    {adsense_code}\n</head>')
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed {len(html_files)} files.")
