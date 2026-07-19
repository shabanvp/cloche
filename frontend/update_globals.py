import re

with open('src/app/globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

new_vars = """  --color-primary: #0F4C45;
  --color-primary-container: #E7F0EF;
  --color-on-primary-container: #072B27;
  --color-secondary: #C8A96A;
  --color-surface: #F8F6F2;
  --color-surface-dim: #EFEBE4;
  --color-on-surface: #1C1C17;
  --color-on-surface-variant: #494740;
  --color-outline: #7A776E;
  --color-outline-variant: #CAC6BA;
  --color-inverse-surface: #31302C;
  --font-headline: var(--font-public-sans);
  --font-body: var(--font-public-sans);
  --font-label: var(--font-public-sans);
}"""

content = content.replace('--font-display: var(--font-playfair);\n}', f"--font-display: var(--font-playfair);\n{new_vars}")

with open('src/app/globals.css', 'w', encoding='utf-8') as f:
    f.write(content)
