import re

def convert_to_jsx(html_file, jsx_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Convert class to className
    jsx = html.replace('class="', 'className="')
    
    # Convert style attributes
    # e.g., style="background-image: url('...');" -> style={{ backgroundImage: "url('...')" }}
    def style_replacer(match):
        style_str = match.group(1)
        # Parse simple style string
        styles = {}
        for prop in style_str.split(';'):
            if ':' in prop:
                key, val = prop.split(':', 1)
                key = key.strip()
                # camelCase the key
                parts = key.split('-')
                key = parts[0] + ''.join(p.capitalize() for p in parts[1:])
                val = val.strip().replace("'", '"')
                styles[key] = val
        
        style_jsx = ", ".join(f"{k}: '{v.replace('\"', '')}'" for k, v in styles.items())
        return f"style={{{{{style_jsx}}}}}"

    jsx = re.sub(r'style="([^"]+)"', style_replacer, jsx)
    
    # Close unclosed tags
    jsx = re.sub(r'(<img[^>]+)(?<!/)>', r'\1 />', jsx)
    jsx = re.sub(r'(<input[^>]+)(?<!/)>', r'\1 />', jsx)
    jsx = re.sub(r'(<br[^>]*)(?<!/)>', r'\1 />', jsx)
    jsx = re.sub(r'(<hr[^>]*)(?<!/)>', r'\1 />', jsx)
    
    # Create the React component
    component = """
import Image from "next/image";

export default function Home() {
  return (
    <>
""" + jsx + """
    </>
  );
}
"""
    with open(jsx_file, 'w', encoding='utf-8') as f:
        f.write(component)

convert_to_jsx('scratch.html', 'src/app/page.tsx')
