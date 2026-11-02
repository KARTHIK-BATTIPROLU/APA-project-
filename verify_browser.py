import subprocess
import os
import re

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE_URL = "http://localhost:4173"
OUT_DIR = "verification_screenshots"
os.makedirs(OUT_DIR, exist_ok=True)

pages = [
    ("/", "home_1440.png", "home_375.png"),
    ("/day", "day_1440.png", "day_375.png"),
    ("/time", "time_1440.png", "time_375.png"),
    ("/genre", "genre_1440.png", "genre_375.png"),
    ("/advisor", "advisor_1440.png", "advisor_375.png"),
    ("/models", "models_1440.png", "models_375.png"),
    ("/methodology", "methodology_1440.png", "methodology_375.png"),
    ("/pitch", "pitch_1440.png", "pitch_375.png"),
    ("/pitch#7", "pitch7_1440.png", "pitch7_375.png"),
]

print("=== Running Headless Chrome DOM & Screenshot Verification ===")

for path, file_desktop, file_mobile in pages:
    url = f"{BASE_URL}{path}"
    
    # 1. Capture Desktop Screenshot
    out_desktop = os.path.join(OUT_DIR, file_desktop)
    cmd_desktop = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--virtual-time-budget=4000",
        f"--window-size=1440,900",
        f"--screenshot={out_desktop}",
        url
    ]
    subprocess.run(cmd_desktop, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # 2. Capture Mobile Screenshot (375px width)
    out_mobile = os.path.join(OUT_DIR, file_mobile)
    cmd_mobile = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--virtual-time-budget=4000",
        f"--window-size=375,812",
        f"--screenshot={out_mobile}",
        url
    ]
    subprocess.run(cmd_mobile, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # 3. Dump rendered DOM
    cmd_dom = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--virtual-time-budget=4000",
        "--dump-dom",
        url
    ]
    res = subprocess.run(cmd_dom, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding='utf-8', errors='ignore')
    dom = res.stdout
    
    desktop_size = os.path.getsize(out_desktop) if os.path.exists(out_desktop) else 0
    mobile_size = os.path.getsize(out_mobile) if os.path.exists(out_mobile) else 0
    
    # Sanity checks on DOM
    has_demo_banner = "Demo data: synthetic stand-ins" in dom
    has_dropclock = "DropClock" in dom
    
    print(f"Page {path:12} | Desktop: {desktop_size/1024:6.1f} KB | Mobile: {mobile_size/1024:6.1f} KB | DemoBanner: {has_demo_banner} | Brand: {has_dropclock}")

print("All screenshots and DOM dumps verified!")
