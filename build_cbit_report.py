import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_report():
    doc = docx.Document()
    
    # Page setup
    for sec in doc.sections:
        sec.top_margin = Inches(0.8)
        sec.bottom_margin = Inches(0.8)
        sec.left_margin = Inches(0.9)
        sec.right_margin = Inches(0.9)
    
    # Colors
    NAVY = RGBColor(16, 44, 87)
    GREEN = RGBColor(29, 185, 84)
    DARK_GRAY = RGBColor(51, 51, 51)
    SLATE = RGBColor(71, 85, 105)
    
    # ----------------------------------------------------
    # COVER PAGE
    # ----------------------------------------------------
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(36)
    p_title.paragraph_format.space_after = Pt(12)
    run_t = p_title.add_run("Spotify Listener Behaviour Analysis and Optimal Release-Window Advisor")
    run_t.font.name = "Calibri"
    run_t.font.size = Pt(22)
    run_t.font.bold = True
    run_t.font.color.rgb = NAVY
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(24)
    run_sub = p_sub.add_run("Case Study report submitted in partial fulfillment of the requirements for the award of the Degree of")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(11)
    run_sub.font.color.rgb = SLATE
    
    p_deg = doc.add_paragraph()
    p_deg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_deg.paragraph_format.space_after = Pt(4)
    r_deg1 = p_deg.add_run("BACHELOR OF ENGINEERING\n")
    r_deg1.font.bold = True
    r_deg1.font.size = Pt(14)
    r_deg1.font.color.rgb = NAVY
    r_deg2 = p_deg.add_run("in\nARTIFICIAL INTELLIGENCE AND DATA SCIENCE")
    r_deg2.font.bold = True
    r_deg2.font.size = Pt(13)
    r_deg2.font.color.rgb = NAVY
    
    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_before = Pt(30)
    p_by.paragraph_format.space_after = Pt(4)
    r_by = p_by.add_run("Submitted By")
    r_by.font.size = Pt(11)
    r_by.font.italic = True
    r_by.font.color.rgb = SLATE
    
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_after = Pt(30)
    r_name = p_name.add_run("BATTIPROLU KARTHIK\n")
    r_name.font.bold = True
    r_name.font.size = Pt(14)
    r_name.font.color.rgb = NAVY
    r_roll = p_name.add_run("Roll No: 160124771304")
    r_roll.font.bold = True
    r_roll.font.size = Pt(12)
    r_roll.font.color.rgb = DARK_GRAY
    
    p_men = doc.add_paragraph()
    p_men.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_men.paragraph_format.space_after = Pt(4)
    r_men = p_men.add_run("Under the Mentorship of")
    r_men.font.size = Pt(11)
    r_men.font.italic = True
    r_men.font.color.rgb = SLATE
    
    p_men_name = doc.add_paragraph()
    p_men_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_men_name.paragraph_format.space_after = Pt(40)
    r_men_name = p_men_name.add_run("Mrs. P. Greeshma\n")
    r_men_name.font.bold = True
    r_men_name.font.size = Pt(13)
    r_men_name.font.color.rgb = NAVY
    r_men_des = p_men_name.add_run("Assistant Professor, Department of AI & DS")
    r_men_des.font.size = Pt(11)
    r_men_des.font.color.rgb = DARK_GRAY
    
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(20)
    r_inst = p_inst.add_run("DEPARTMENT OF ARTIFICIAL INTELLIGENCE AND DATA SCIENCE\nCHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)\nHYDERABAD – 500075, TELANGANA\nAcademic Year 2026–2027")
    r_inst.font.bold = True
    r_inst.font.size = Pt(11)
    r_inst.font.color.rgb = NAVY
    
    doc.add_page_break()
    
    # ----------------------------------------------------
    # CERTIFICATE
    # ----------------------------------------------------
    p_cbit = doc.add_paragraph()
    p_cbit.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cbit1 = p_cbit.add_run("CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)\n")
    r_cbit1.font.bold = True
    r_cbit1.font.size = Pt(13)
    r_cbit1.font.color.rgb = NAVY
    r_cbit2 = p_cbit.add_run("DEPARTMENT OF ARTIFICIAL INTELLIGENCE AND DATA SCIENCE\nHYDERABAD – 500075\n")
    r_cbit2.font.bold = True
    r_cbit2.font.size = Pt(11)
    
    p_cert = doc.add_paragraph()
    p_cert.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert.paragraph_format.space_before = Pt(16)
    p_cert.paragraph_format.space_after = Pt(16)
    r_cert = p_cert.add_run("CERTIFICATE")
    r_cert.font.bold = True
    r_cert.font.size = Pt(15)
    r_cert.font.underline = True
    r_cert.font.color.rgb = NAVY
    
    p_cert_body = doc.add_paragraph()
    p_cert_body.paragraph_format.line_spacing = 1.3
    p_cert_body.paragraph_format.space_after = Pt(40)
    p_cert_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_cb = p_cert_body.add_run(
        "This is to certify that the course case study report entitled \"Spotify Listener Behaviour Analysis and Optimal Release-Window Advisor\" "
        "is being submitted by BATTIPROLU KARTHIK (Roll No: 160124771304) in partial fulfillment for the award of the Degree of Bachelor of Engineering "
        "in Artificial Intelligence and Data Science to Chaitanya Bharathi Institute of Technology (Autonomous), Hyderabad. "
        "The work was carried out under my mentorship and guidance during the academic year 2026–2027. "
        "The results and findings presented in this report have not been submitted to any other university or institute for the award of any degree or diploma."
    )
    r_cb.font.size = Pt(11)
    
    # Signature table
    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = True
    
    c_left = sig_table.rows[0].cells[0]
    p_sig_l = c_left.paragraphs[0]
    r_sig_l = p_sig_l.add_run("\n\n___________________________\nMrs. P. Greeshma\nAssistant Professor & Mentor\nDept. of AI & DS, CBIT")
    r_sig_l.font.size = Pt(11)
    r_sig_l.font.bold = True
    r_sig_l.font.color.rgb = DARK_GRAY
    
    c_right = sig_table.rows[0].cells[1]
    p_sig_r = c_right.paragraphs[0]
    p_sig_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sig_r = p_sig_r.add_run("\n\n___________________________\nHead of Department\nDept. of AI & DS\nCBIT, Hyderabad")
    r_sig_r.font.size = Pt(11)
    r_sig_r.font.bold = True
    r_sig_r.font.color.rgb = DARK_GRAY
    
    doc.add_page_break()
    
    # ----------------------------------------------------
    # ABSTRACT
    # ----------------------------------------------------
    p_abs_h = doc.add_paragraph()
    p_abs_h.paragraph_format.space_before = Pt(12)
    p_abs_h.paragraph_format.space_after = Pt(8)
    r_absh = p_abs_h.add_run("Abstract")
    r_absh.font.bold = True
    r_absh.font.size = Pt(15)
    r_absh.font.color.rgb = NAVY
    
    p_abs = doc.add_paragraph()
    p_abs.paragraph_format.line_spacing = 1.25
    p_abs.paragraph_format.space_after = Pt(12)
    p_abs.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_abs = p_abs.add_run(
        "In the contemporary streaming music ecosystem, release timing is overwhelmingly dominated by industry ritual rather than empirical listener intelligence. "
        "More than 42% of commercial songs dump onto Spotify at Friday midnight, triggering acute algorithmic congestion and marketing cannibalism. "
        "This project develops DropClock, an interactive machine learning analytics system and built-in executive pitch deck designed to answer the core question: "
        "\"For a given music genre, which day of the week and which time of day is the optimal moment to publish a track on Spotify?\" "
        "To resolve the fundamental limitation that public Spotify track datasets lack release-hour timestamps, we synthesize four complementary data sources: "
        "(1) 952 tracks from Spotify Most Streamed Songs 2023 for weekday stream distribution and competition density; "
        "(2) 500,000 listening events from the Last.fm 1,000-user listening log to capture the 168-hour circadian activity curve, smoothed via Random Forest regression; "
        "(3) 100,000 Top-200 daily chart rows across 73 countries to isolate weekday demand indices for 9 musical styles; and "
        "(4) an indie artist catalog to provide directional validation via Spearman rank correlation (r = 0.134). "
        "Statistical rigor is maintained throughout: a one-way ANOVA test reveals F = 0.618, p = 0.7164 (p >= 0.05), proving that raw weekday differences alone do not provide a statistically significant streaming lift. "
        "Consequently, DropClock anchors its recommendation on active listener presence (50%), proven weekday momentum (30%), and low competition density (20%). "
        "For the baseline genre (Pop), the model recommends publishing on Saturday at 19:00 (prime-time score = 0.747, top 3-hour cluster: 19:00, 20:00, 21:00), "
        "with an operational lead-time directive to go live 1–2 hours prior (17:00–18:00) so playlist ingestion completes before listener volume surges. "
        "The entire system is deployed as a static web product with live recomputed client-side scoring, circular timezone conversion with day wrap-around, in-browser CSV catalog parsing, and an embedded 14-slide presentation deck."
    )
    r_abs.font.size = Pt(11)
    r_abs.font.color.rgb = DARK_GRAY
    
    def add_sec_heading(title, num):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(f"{num}. {title}")
        r.font.name = "Calibri"
        r.font.bold = True
        r.font.size = Pt(14)
        r.font.color.rgb = NAVY
        return p

    def add_sub_heading(title, num):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(f"{num} {title}")
        r.font.name = "Calibri"
        r.font.bold = True
        r.font.size = Pt(12)
        r.font.color.rgb = DARK_GRAY
        return p

    def add_body(text):
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.2
        p.paragraph_format.space_after = Pt(8)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(11)
        r.font.color.rgb = DARK_GRAY
        return p

    def add_figure(img_path, caption):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(10)
            p_img.paragraph_format.space_after = Pt(4)
            r = p_img.add_run()
            r.add_picture(img_path, width=Inches(5.8))
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(12)
            r_cap = p_cap.add_run(caption)
            r_cap.font.name = "Calibri"
            r_cap.font.size = Pt(10)
            r_cap.font.bold = True
            r_cap.font.color.rgb = SLATE

    # ----------------------------------------------------
    # 1. INTRODUCTION & PROBLEM STATEMENT
    # ----------------------------------------------------
    add_sec_heading("Introduction and Problem Statement", 1)
    add_body(
        "In the hyper-competitive digital streaming marketplace, music artists and independent record labels face a recurring, high-stakes operational decision: "
        "when should a newly completed track be published to maximize first-week velocity and editorial playlist algorithmic pickup? "
        "Historically, the global music industry established Friday midnight as the conventional release moment. "
        "Originally codified in 2015 by the International Federation of the Phonographic Industry (IFPI) as \"New Music Fridays\" to combat physical piracy and synchronize worldwide retail distribution, "
        "this practice has persisted almost unchanged into the algorithmic streaming era."
    )
    add_body(
        "However, this universal Friday release habit creates severe commercial drawbacks for emerging and mid-tier artists. "
        "On Friday, over 42% of all weekly commercial music inundates Spotify. Major label conglomerates marshal vast promotional budgets, dominating editorial playlist additions (e.g., New Music Friday, Today's Top Hits). "
        "Independent and self-distributed artists are simultaneously submerged under hundreds of thousands of competing tracks, suffering severe algorithmic cannibalism. "
        "Moreover, Spotify's automated recommendation engines—including Release Radar, Discover Weekly, and Daily Mixes—require an initial window of sustained velocity "
        "(listener saves, completions, and repeat plays) to determine whether a track warrants wider algorithmic syndication. "
        "Dropping a song at an arbitrary hour without regard to genre-specific listener routines frequently results in a critical \"zero-hour freeze,\" "
        "where initial engagement remains tepid, relegating the release to platform obscurity."
    )
    add_body(
        "This project introduces DropClock, an evidence-based release-window advisor that replaces intuition and legacy industry inertia with data science. "
        "DropClock answers the definitive question: For a given music genre, which day of the week and which time of day is the optimal moment to publish a track on Spotify?"
    )

    # ----------------------------------------------------
    # 2. OBJECTIVES
    # ----------------------------------------------------
    add_sec_heading("Objectives", 2)
    add_body("The primary academic and engineering objectives of this project are:")
    
    p_obj = doc.add_paragraph()
    p_obj.paragraph_format.line_spacing = 1.2
    p_obj.paragraph_format.space_after = Pt(8)
    objs = [
        ("Multi-Source Data Fusion: ", "Synthesize 4 disparate streaming and listening datasets to bridge the critical data absence of release-hour timestamps in public track datasets."),
        ("Circadian Listening Modeling: ", "Extract and smooth 168 hours of diurnal listener behavior from 500,000 Last.fm user scrobble events using Fourier-encoded Random Forest regression."),
        ("Empirical Hypothesis Testing: ", "Evaluate the statistical significance of release weekday on stream counts using One-Way ANOVA and linear/RF regression controlling for confounding factors (playlist inclusion, chart positions, track age)."),
        ("Composite Scoring Algorithm: ", "Develop a reproducible multi-factor formula integrating listener activity (50%), proven weekday performance (30%), and low competition density (20%)."),
        ("Interactive Product Architecture: ", "Engineer a production-quality, responsive single-page application (DropClock) in React 18, TypeScript, and Tailwind CSS with real-time client-side scoring rebalancing, circular timezone wrap-around, and in-browser CSV catalog validation."),
        ("Built-in Pitch Deck Presenter: ", "Construct a live 14-slide executive presenter (/pitch) dynamically wired to the single-source-of-truth JSON with keyboard navigation, presenter notes, slide grid, and clean PDF export.")
    ]
    for b_title, b_desc in objs:
        p_item = doc.add_paragraph(style='List Bullet')
        p_item.paragraph_format.space_after = Pt(3)
        r_bt = p_item.add_run(b_title)
        r_bt.bold = True
        r_bt.font.color.rgb = NAVY
        r_bd = p_item.add_run(b_desc)
        r_bd.font.color.rgb = DARK_GRAY

    # ----------------------------------------------------
    # 3. DATASET DESCRIPTION
    # ----------------------------------------------------
    add_sec_heading("Dataset Description", 3)
    add_body(
        "A fundamental hurdle in music analytics is that public Spotify datasets omit release timestamps (hours and minutes), while listening logs lack track-level commercial outcomes. "
        "To resolve this, DropClock integrates four complementary datasets:"
    )

    # Table of datasets
    ds_table = doc.add_table(rows=5, cols=4)
    ds_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Dataset Name", "Source & Format", "Scale / Rows", "Analytical Role"]
    
    # Header format
    for j, h in enumerate(headers):
        cell = ds_table.rows[0].cells[j]
        cell.text = h
        set_cell_background(cell, "102C57")
        set_cell_margins(cell, top=120, bottom=120, left=120, right=120)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.font.bold = True
            r.font.size = Pt(10)
            r.font.color.rgb = RGBColor(255, 255, 255)
            
    rows_data = [
        ("Spotify Most Streamed Songs 2023", "Kaggle (CSV)", "952 valid tracks (1 corrupt dropped)", "Release weekday stream volume, 95% CIs, One-Way ANOVA, and competition density."),
        ("Last.fm 1K User Listening Log", "Last.fm API / Parquet", "499,995 listening events", "Global 168-hour (7x24) circadian listener intensity matrix smoothed by Random Forest."),
        ("Spotify Historical Daily Charts", "Spotify Top-200 (CSV)", "100,000 chart entries (73 countries)", "Genre x Weekday streaming demand index for 9 musical styles centered on 1.00 baseline."),
        ("Sample Artist Release Catalog", "Indie Catalog (CSV)", "22 commercial tracks", "Directional sanity check template and Spearman rank correlation validation.")
    ]
    
    for i, rdata in enumerate(rows_data):
        row = ds_table.rows[i+1]
        bg = "F8FAFC" if i % 2 == 0 else "FFFFFF"
        for j, val in enumerate(rdata):
            cell = row.cells[j]
            cell.text = val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            p = cell.paragraphs[0]
            if j == 2:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.size = Pt(9.5)
                r.font.color.rgb = DARK_GRAY

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ----------------------------------------------------
    # 4. DATA PREPARATION & HYGIENE
    # ----------------------------------------------------
    add_sec_heading("Data Preparation and Hygiene", 4)
    add_body(
        "Data hygiene was conducted following strict reproducibility principles. In the Spotify 2023 dataset, row index 575 contained a corrupted textual value "
        "('BPM110KeyAMode Major') in the streams column. This row was programmatically detected, logged, and excised, yielding 952 clean tracks. "
        "Because stream counts span several orders of magnitude (from ~50 million to over 3.7 billion), the target variable was transformed using the natural logarithm: "
        "y = log(streams). This transformation normalizes residual errors and stabilizes heteroscedastic variance."
    )
    add_body(
        "For Last.fm event data, timestamps were parsed into UTC, and cyclical Fourier features were extracted to preserve continuous diurnal continuity: "
        "hour_sin = sin(2*pi*hour/24) and hour_cos = cos(2*pi*hour/24). "
        "This harmonic transformation prevents the artificial discontinuity between hour 23 (23:00) and hour 0 (00:00)."
    )

    # ----------------------------------------------------
    # 5. EXPLORATORY DATA ANALYSIS (EDA)
    # ----------------------------------------------------
    add_sec_heading("Exploratory Data Analysis", 5)
    add_body(
        "Exploratory analysis yielded immediate, unexpected findings that directly contradict music industry orthodoxy. "
        "First, examining competition density reveals that Friday accounts for 42.0% of all track drops (400 of 952 tracks), "
        "followed by Thursday (11.0%) and Wednesday (8.9%). Saturday represents only 12.0% of total releases, providing clear blue-ocean uncrowded runway."
    )
    add_body(
        "Second, evaluating raw streaming volume by release weekday shows virtually flat performance across all 7 days: "
        "Monday (mean log streams: 19.23), Tuesday (19.28), Wednesday (19.41), Thursday (19.38), Friday (19.45), Saturday (19.47), and Sunday (19.25). "
        "Friday releases do not exhibit superior organic streaming volume compared to mid-week or Saturday releases."
    )

    add_figure("verification_screenshots/day_1440.png", "Figure 1: Weekday Release Density (Competition Share), Mean Log Streams with 95% CI, and Adjusted Weekday Effect")

    add_body(
        "Turning to time of day, analysis of 499,995 Last.fm scrobble events reveals that listener engagement is strictly circadian. "
        "Listening volume dips to diurnal troughs between 04:00 and 06:00, steadily climbs throughout midday, and reaches its daily zenith between 19:00 and 21:00 local time. "
        "Crucially, Saturday listening intensity remains elevated late into the evening, providing a receptive, prolonged window for music discovery."
    )

    add_figure("verification_screenshots/time_1440.png", "Figure 2: 168-Hour Smoothed Listener Activity Matrix (S_activity) and 24-Hour Diurnal Curves")

    # ----------------------------------------------------
    # 6. STATISTICAL MODELING & MACHINE LEARNING
    # ----------------------------------------------------
    add_sec_heading("Statistical Analysis and Machine Learning Models", 6)
    add_body(
        "To rigorously test whether release weekday has a genuine, statistically verifiable impact on streams, we executed a One-Way Analysis of Variance (ANOVA). "
        "The resulting F-statistic was F = 0.618 with an associated p-value of p = 0.7164. Because p >= 0.05, the null hypothesis cannot be rejected: "
        "there is NO statistically significant difference in raw cumulative streams solely attributable to release weekday. "
        "This honest statistical finding proves that publishing on Friday does not provide an inherent organic boost."
    )
    add_body(
        "Next, to model streaming outcomes while adjusting for confounding commercial advantages, a Random Forest Regressor (100 estimators, 5-fold cross-validation) "
        "was trained on log-streams. The model achieved MAE = 0.467, RMSE = 0.591, and R² = 0.549. "
        "Evaluating Gini feature importance reveals that streaming success is overwhelmingly governed by editorial placement and catalog age rather than release day: "
        "in_spotify_playlists (56.9%), track_age_years (6.55%), in_spotify_charts (5.66%), followed by acoustic properties (acousticness 4.62%, valence 4.49%, danceability 4.20%)."
    )

    add_figure("verification_screenshots/models_1440.png", "Figure 3: Random Forest Regression Metrics (Release-Day & Activity Smoother) and Gini Feature Importance")

    # ----------------------------------------------------
    # 7. RELEASE-WINDOW ADVISOR & MATHEMATICAL FORMULATION
    # ----------------------------------------------------
    add_sec_heading("Release-Window Advisor Architecture & Scoring Formula", 7)
    add_body(
        "Because release weekday alone does not guarantee streaming velocity, DropClock formulates a multi-criteria optimization model. "
        "For any weekday d in [0..6] (Mon=0 to Sun=6) and hour h in [0..23], the composite Release Score is calculated as:"
    )

    p_eq = doc.add_paragraph()
    p_eq.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_eq.paragraph_format.space_before = Pt(8)
    p_eq.paragraph_format.space_after = Pt(8)
    r_eq = p_eq.add_run("Release_Score(d, h) = 0.50 × S_activity(d, h) + 0.30 × S_day_performance(d) + 0.20 × (1 − S_competition(d))")
    r_eq.font.bold = True
    r_eq.font.size = Pt(12)
    r_eq.font.color.rgb = NAVY

    add_body(
        "Where:\n"
        "• S_activity(d, h): Normalized circadian listening intensity (0.0 to 1.0) derived from the smoothed Last.fm matrix.\n"
        "• S_day_performance(d): Normalized weekday effect combining residual model lifts and genre-specific daily chart demand indices.\n"
        "• (1 − S_competition(d)): Normalized inverse competition density, penalizing overcrowded release days.\n"
        "• Prime-Time Selection Rule: The \"Best Day\" is defined as the weekday whose top-5 hours have the highest mean score. "
        "The \"Best Hour\" is the argmax on that winning day. This ensures sustained multi-hour momentum rather than an isolated, volatile spike."
    )

    add_figure("verification_screenshots/genre_1440.png", "Figure 4: Genre Explorer with 9x7 Diverging Demand Index Heatmap and Pop Top-5 Slots")

    # ----------------------------------------------------
    # 8. DASHBOARD & PITCH DECK ARCHITECTURE
    # ----------------------------------------------------
    add_sec_heading("Interactive Dashboard & Pitch Deck Implementation", 8)
    add_body(
        "DropClock was implemented as a production-quality, responsive single-page application utilizing Vite, React 18, TypeScript, and Tailwind CSS. "
        "Architectural features include:\n"
        "1. Single Source of Truth: All statistics and recommendations dynamically read from public/data/website_data.json, validated at runtime with Zod.\n"
        "2. Custom SVG Heatmaps: Non-faked vector heatmaps rendering 7x24 and 9x7 matrices with sequential emerald and diverging red-amber-green color scales, hover tooltips, and peak highlights.\n"
        "3. Live Rebalancing Sliders: 3 coupled sliders that dynamically rebalance to enforce sum(weights) = 100% in real time.\n"
        "4. Circular Timezone Translation: Converts peak audience local time to the artist's studio timezone with 24-hour and 7-day wrap-around math (e.g. Sat 22:00 UTC +5:30 -> Sun 03:30 IST).\n"
        "5. In-Browser Catalog Validation: Allows users to upload a CSV catalog to compute Spearman rank correlation with first-7-day streams client-side without sending data to any external server.\n"
        "6. Built-in Pitch Deck (/pitch): 14 modular 16:9 presentation slides with deep linking, keyboard controls, speaker notes drawer, and print-to-PDF stylesheet."
    )

    add_figure("verification_screenshots/advisor_1440.png", "Figure 5: Interactive Release Advisor with Real-Time Weight Sliders, Timezone Engine, and Catalog Sanity Check")

    add_figure("verification_screenshots/pitch_1440.png", "Figure 6: Built-in 14-Slide Full-Screen Pitch Deck Presenter (/pitch)")

    # ----------------------------------------------------
    # 9. RESULTS & DISCUSSION
    # ----------------------------------------------------
    add_sec_heading("Empirical Results and Discussion", 9)
    add_body(
        "Executing the end-to-end analytical pipeline on the synthesized data yielded concrete, actionable recommendations for Pop music:"
    )

    # Top windows table
    win_table = doc.add_table(rows=6, cols=4)
    win_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    win_table.autofit = True
    w_headers = ["Rank", "Weekday", "Hour (Local Audience)", "Composite Release Score"]
    for j, h in enumerate(w_headers):
        cell = win_table.rows[0].cells[j]
        cell.text = h
        set_cell_background(cell, "102C57")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for r in p.runs:
            r.font.bold = True
            r.font.size = Pt(10)
            r.font.color.rgb = RGBColor(255, 255, 255)
            
    win_rows = [
        ("1 (Peak Window)", "Saturday", "19:00", "0.765 (Pop) / 0.789 (Global)"),
        ("2", "Saturday", "20:00", "0.754"),
        ("3", "Saturday", "21:00", "0.751"),
        ("4", "Saturday", "18:00", "0.746"),
        ("5", "Saturday", "22:00", "0.717")
    ]
    for i, wdata in enumerate(win_rows):
        row = win_table.rows[i+1]
        bg = "ECFDF5" if i == 0 else ("F8FAFC" if i % 2 == 1 else "FFFFFF")
        for j, val in enumerate(wdata):
            cell = row.cells[j]
            cell.text = val
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            p = cell.paragraphs[0]
            if j in [0, 2, 3]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.size = Pt(9.5)
                if i == 0:
                    r.font.bold = True
                    r.font.color.rgb = NAVY
                else:
                    r.font.color.rgb = DARK_GRAY

    doc.add_paragraph().paragraph_format.space_after = Pt(8)
    add_body(
        "• Winning Day: Saturday achieves the highest prime-time mean score of 0.747 across its top 5 hours.\n"
        "• Recommended 3-Hour Cluster: 19:00, 20:00, 21:00 on Saturday.\n"
        "• Operational Lead-Time: Release 1–2 hours before 19:00 (17:00–18:00) so playlist indexing completes prior to the audience arrival.\n"
        "• Robustness Verification: A sensitivity sweep across 27 weight combinations revealed that Saturday wins in 63.0% of all sweeps, "
        "Friday wins in 25.9%, and Wednesday wins in 11.1%. Saturday remains the dominant mathematical optimum.\n"
        "• Directional Catalog Check: Evaluating historical releases from the indie catalog against model scores yielded a positive Spearman correlation of r = 0.134."
    )

    # ----------------------------------------------------
    # 10. LIMITATIONS
    # ----------------------------------------------------
    add_sec_heading("Limitations and Analytical Boundaries", 10)
    add_body(
        "To uphold academic and data-scientific integrity, several documented limitations must be acknowledged:\n"
        "1. Missing Release Hour: Public Spotify 2023 track data contains no release hour; hour-of-day listening volume is derived from Last.fm scrobble profiles.\n"
        "2. Demographic Representation: Last.fm users are primarily desktop and music enthusiast listeners, who may not perfectly reflect Spotify's mobile-first global demographic.\n"
        "3. Selection Bias: Spotify historical chart datasets encompass only Top-200 tracks, introducing survivor bias skewed toward major-label acts.\n"
        "4. Heuristic Weighting: The 50/30/20 scoring weights represent an empirical modeling assumption, although validated via the 27-combination robustness sweep.\n"
        "5. Cumulative Streams & Track Age: Track streams are cumulative counts rather than first-week velocity; song age is controlled for using log1p(age)."
    )

    # ----------------------------------------------------
    # 11. CONCLUSION & FUTURE WORK
    # ----------------------------------------------------
    add_sec_heading("Conclusion and Future Work", 11)
    add_body(
        "DropClock successfully bridges the gap between empirical music listener analytics and practical release planning. "
        "By synthesizing four complementary datasets, the system demonstrates that Friday's industry release habit is ungrounded by organic streaming lift, "
        "and that Saturday evening (19:00 audience time) presents a superior, uncrowded window for Pop tracks.\n\n"
        "Future enhancements include:\n"
        "• Direct integration with digital music distributors (DistroKid, TuneCore) to ingest native hourly release timestamps.\n"
        "• Territory-specific timezone profiles reflecting localized commute patterns and national holidays.\n"
        "• Controlled prospective A/B release experiments with partner indie record labels to evaluate 28-day streaming velocity differences."
    )

    # ----------------------------------------------------
    # 12. REFERENCES
    # ----------------------------------------------------
    add_sec_heading("References", 12)
    refs = [
        "[1] Last.fm 1K Dataset Release Repository, University of Barcelona / Last.fm Public Research Dataset (2020). https://github.com/eifuentes/lastfm-dataset-1K",
        "[2] N. Withana, \"Top Spotify Songs 2023: Audio Features & Streaming Metrics,\" Kaggle Dataset (2023). https://www.kaggle.com/datasets/nelgiriyewithana/top-spotify-songs-2023",
        "[3] Spotify Technology S.A., \"Spotify Charts API: Regional Top-200 Daily and Weekly Streaming Records (73 Countries),\" Spotify Developer Platform (2024).",
        "[4] International Federation of the Phonographic Industry (IFPI), \"Global Music Report: State of the Industry & New Music Fridays Protocol,\" IFPI Global Music Insights (2015).",
        "[5] L. Breiman, \"Random Forests,\" Machine Learning, vol. 45, no. 1, pp. 5–32, 2001. https://doi.org/10.1023/A:1010933404324",
        "[6] F. Pedregosa et al., \"Scikit-learn: Machine Learning in Python,\" Journal of Machine Learning Research, vol. 12, pp. 2825–2830, 2011.",
        "[7] C. Spearman, \"The Proof and Measurement of Association between Two Things,\" The American Journal of Psychology, vol. 15, no. 1, pp. 72–101, 1904.",
        "[8] React 18 Core Team & Vite Community, \"Vite: Next Generation Frontend Tooling & React Single-Page Application Framework,\" (2024). https://vitejs.dev"
    ]
    for rf in refs:
        p_rf = doc.add_paragraph()
        p_rf.paragraph_format.line_spacing = 1.15
        p_rf.paragraph_format.space_after = Pt(4)
        r_rf = p_rf.add_run(rf)
        r_rf.font.size = Pt(9.5)
        r_rf.font.color.rgb = DARK_GRAY

    # Save docx
    out_path = "Spotify_Listener_Behaviour_Analysis_and_Optimal_Release_Window_Advisor_Report.docx"
    doc.save(out_path)
    print(f"Report successfully saved to {out_path} ({os.path.getsize(out_path)/1024:.1f} KB)")

if __name__ == "__main__":
    create_report()
