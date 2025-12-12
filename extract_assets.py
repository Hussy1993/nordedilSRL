import re
import os

html_file = 'index.html'
css_file = 'style.css'
js_file = 'app.js'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
css_content = ""
def replace_css(match):
    global css_content
    css_content += match.group(1) + "\n"
    return ""  # Remove the style tag

# Find all style tags
# We use a pattern that captures content strictly
content_no_css = re.sub(r'<style>(.*?)</style>', replace_css, content, flags=re.DOTALL)

# Add link to CSS
if css_content:
    # Insert link before </head>
    link_tag = '<link rel="stylesheet" href="style.css">\n'
    content_no_css = content_no_css.replace('</head>', link_tag + '</head>')
    
    with open(css_file, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print(f"Extracted {len(css_content)} bytes of CSS to {css_file}")

# Extract JS
js_content = ""
# We need to be careful. Some scripts are libraries (src=...). We only want inline scripts.
# Pattern: <script>...</script> (no attributes) or <script type="text/javascript">
# We should SKIP <script src="..."> and <script type="module"> if it has content (rare but possible)

def replace_js(match):
    global js_content
    attrs = match.group(1)
    script_body = match.group(2)
    
    # If src is present, don't touch
    if 'src=' in attrs:
        return match.group(0)
    
    # If type is module, maybe better to leave it or handle separately? 
    # For now, let's assume we extract standard scripts.
    if 'type="module"' in attrs:
        return match.group(0)
        
    # If it's a specific type like application/ld+json, SKIP
    if 'application/ld+json' in attrs:
        return match.group(0)

    js_content += "// Extracted script block\n" + script_body + "\n"
    return "" # Remove the script tag

# Regex to match <script attributes>content</script>
# simple regex: <script([^>]*)>(.*?)</script>
content_final = re.sub(r'<script([^>]*)>(.*?)</script>', replace_js, content_no_css, flags=re.DOTALL)

if js_content:
    # Append app.js to body end
    # script_tag = '<script src="app.js" defer></script>\n'
    # content_final = content_final.replace('</body>', script_tag + '</body>')
    
    # Check if there is already a script at the end?
    # Just insert it before </body>
    script_tag = '<script src="app.js" defer></script>\n'
    content_final = content_final.replace('</body>', script_tag + '</body>')

    with open(js_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Extracted {len(js_content)} bytes of JS to {js_file}")

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(content_final)

print("Extraction complete.")
