import sys
import subprocess
sys.stdout.reconfigure(encoding='utf-8')
import os
import json
import re

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_URL = "http://localhost:4173"
tmp_profile = os.path.abspath("temp_chrome_audit")
os.makedirs(tmp_profile, exist_ok=True)

with open('public/data/website_data.json', 'r', encoding='utf-8') as f:
    site_data = json.load(f)

def get_page_text(path):
    url = f"{BASE_URL}{path}"
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        f"--user-data-dir={tmp_profile}",
        "--virtual-time-budget=3000",
        "--dump-dom",
        url
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', errors='ignore')
    # strip HTML tags
    clean = re.sub(r'<[^>]+>', ' ', res.stdout)
    # collapse whitespaces
    return ' '.join(clean.split())

audit_checks = [
    # (path, label, required_substrings)
    ("/", "Home", [
        "Release on Sat at 19:00",
        "Pop",
        "0.549",
        "952",
        "499,995",
        "Demo data",
    ]),
    ("/day", "Best Day", [
        "F = 0.618",
        "p = 0.7164",
        "NOT statistically significant",
        "952 Tracks",
    ]),
    ("/time", "Best Time", [
        "499,995 Scrobble Events",
        "Release 1–2 hours BEFORE the peak",
        "Sat",
        "19:00",
    ]),
    ("/genre", "Genre Explorer", [
        "9 Target Genres",
        "Pop",
        "Sat",
        "19:00",
        "Demand Index",
    ]),
    ("/advisor", "Advisor", [
        "Interactive Release Advisor",
        "Listener Activity",
        "Day Performance",
        "Low Competition",
        "Sat",
        "19:00",
        "Copy Recommendation",
    ]),
    ("/models", "Models", [
        "0.467", # MAE
        "0.591", # RMSE
        "0.549", # R2
        "4.886", # MAE activity
        "6.484", # RMSE activity
        "0.941", # R2 activity
    ]),
    ("/methodology", "Methodology", [
        "Spotify Most Streamed Songs 2023",
        "Last.fm 1K User Listening Log",
        "Spotify Historical Daily Charts",
        "Sample Artist Release Catalog",
        "27 Weight Combinations Tested",
        "63.0% of combos",
    ]),
    ("/pitch", "Pitch Deck", [
        "When should your track drop?",
        "DropClock Analytics Platform",
        "Slide 1 of 14",
    ]),
]

print("=== Starting Full Zero-Mismatch DOM Audit ===")
all_passed = True
total_checks = 0

for path, page_name, assertions in audit_checks:
    text = get_page_text(path)
    page_passed = True
    print(f"\nAuditing [{page_name}] ({path}):")
    for expected in assertions:
        total_checks += 1
        if expected in text:
            print(f"  ✓ Found '{expected}'")
        else:
            print(f"  ✗ MISSING '{expected}'")
            page_passed = False
            all_passed = False
    if page_passed:
        print(f"  -> {page_name} AUDIT PASSED")

if all_passed:
    print(f"\nALL {total_checks} NUMBER AUDIT CHECKS PASSED WITH ZERO MISMATCHES!")
else:
    print(f"\nSOME CHECKS FAILED. Review missing items.")
    exit(1)
