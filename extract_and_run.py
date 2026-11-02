import json
import os

with open('Spotify_Release_Window_Advisor.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

lines = [
    'import matplotlib',
    'matplotlib.use("Agg")',
    'import os',
    'os.makedirs("outputs", exist_ok=True)',
    ''
]

for i, c in enumerate(nb['cells']):
    if c.get('cell_type') == 'code':
        lines.append(f'# --- Code Cell {i} ---')
        src = ''.join(c.get('source', []))
        for line in src.splitlines():
            s = line.strip()
            if s.startswith('%') or s.startswith('!'):
                lines.append(f'# {line}')
            else:
                lines.append(line)
        lines.append('')

with open('run_analysis.py', 'w', encoding='utf-8') as out:
    out.write('\n'.join(lines))

print('run_analysis.py written successfully')
