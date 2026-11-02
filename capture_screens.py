import subprocess
import os
import tempfile
import time

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_URL = "http://localhost:4173"
OUT_DIR = os.path.abspath("verification_screenshots")
os.makedirs(OUT_DIR, exist_ok=True)
tmp_profile = tempfile.mkdtemp(prefix="chrome_headless_")

pages = [
    ("/", "home"),
    ("/day", "day"),
    ("/time", "time"),
    ("/genre", "genre"),
    ("/advisor", "advisor"),
    ("/models", "models"),
    ("/methodology", "methodology"),
    ("/pitch", "pitch"),
]

print("=== Capturing screenshots with dedicated temp profile ===")

for path, name in pages:
    url = f"{BASE_URL}{path}"
    out_desktop = os.path.join(OUT_DIR, f"{name}_1440.png")
    out_mobile = os.path.join(OUT_DIR, f"{name}_375.png")
    
    # Desktop
    cmd_d = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        f"--user-data-dir={tmp_profile}",
        "--window-size=1440,900",
        "--virtual-time-budget=3000",
        f"--screenshot={out_desktop}",
        url
    ]
    subprocess.run(cmd_d, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Mobile
    cmd_m = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        f"--user-data-dir={tmp_profile}",
        "--window-size=375,812",
        "--virtual-time-budget=3000",
        f"--screenshot={out_mobile}",
        url
    ]
    subprocess.run(cmd_m, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    d_size = os.path.getsize(out_desktop) if os.path.exists(out_desktop) else 0
    m_size = os.path.getsize(out_mobile) if os.path.exists(out_mobile) else 0
    print(f"Captured {name:12} | Desktop: {d_size/1024:6.1f} KB | Mobile: {m_size/1024:6.1f} KB")

# Dump DOM of Home page to verify text
cmd_dom = [
    CHROME,
    "--headless=new",
    "--disable-gpu",
    f"--user-data-dir={tmp_profile}",
    "--virtual-time-budget=3000",
    "--dump-dom",
    f"{BASE_URL}/"
]
res = subprocess.run(cmd_dom, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', errors='ignore')
with open(os.path.join(OUT_DIR, "home_dom.html"), "w", encoding="utf-8") as f:
    f.write(res.stdout)

print("Home DOM length:", len(res.stdout))
print("Contains 'Release on Sat':", "Release on Sat" in res.stdout)
print("Contains 'Demo data':", "Demo data" in res.stdout)
print("Contains 'DropClock':", "DropClock" in res.stdout)
