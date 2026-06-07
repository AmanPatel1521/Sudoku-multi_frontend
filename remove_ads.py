import os

adsense_code = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9821792173458370" crossorigin="anonymous"></script>'

def remove_ads(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if adsense_code in content:
                    # Replace the exact code
                    content = content.replace(adsense_code, '')
                    
                    # Also remove the commented version if it exists
                    commented_code = '<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9821792173458370" crossorigin="anonymous"></script> -->'
                    content = content.replace(commented_code, '')
                    
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Removed ads from {path}")

if __name__ == '__main__':
    remove_ads('.')
