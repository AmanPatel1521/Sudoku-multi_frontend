import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for f in html_files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Update cache-buster to force CSS reload
    content = re.sub(r'style\.css\?v=\d+', 'style.css?v=16', content)
    
    # Use native Bootstrap responsive classes instead of fixed ones
    content = content.replace('p-5 fs-5', 'p-3 p-md-5 fs-6 fs-md-5')
    content = content.replace('p-4 h-100', 'p-3 p-md-4 h-100')
    
    # Scale down headers gracefully
    content = content.replace('display-4', 'display-5')

    with open(f, 'w') as file:
        file.write(content)

print("Done updating HTML files.")
