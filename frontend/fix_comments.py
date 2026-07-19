import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content, flags=re.DOTALL)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
