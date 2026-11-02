import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_apa_report():
    doc = docx.Document()
    
    # Page setup
    sec = doc.sections[0]
    sec.top_margin = Inches(0.8)
    sec.bottom_margin = Inches(0.8)
    sec.left_margin = Inches(0.9)
    sec.right_margin = Inches(0.9)
    
    # Configure Header & Footer
    header = sec.header
    p_head = header.paragraphs[0]
    p_head.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_h1 = p_head.add_run("DropClock: Spotify Listener Behaviour Analysis & Release-Window Advisor\nApplied Predictive Analytics (22ADE57N.PE2) | Dept. of AI & DS, CBIT")
    r_h1.font.name = "Calibri"
    r_h1.font.size = Pt(8.5)
    r_h1.font.color.rgb = RGBColor(100, 116, 139)
    
    footer = sec.footer
    p_foot = footer.paragraphs[0]
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f = p_foot.add_run("Chaitanya Bharathi Institute of Technology (Autonomous), Gandipet, Hyderabad – 500075")
    r_f.font.name = "Calibri"
    r_f.font.size = Pt(8.5)
    r_f.font.color.rgb = RGBColor(148, 163, 184)

    # Colors
    NAVY = RGBColor(16, 44, 87)
    DARK_GRAY = RGBColor(51, 51, 51)
    SLATE = RGBColor(71, 85, 105)
    
    # ----------------------------------------------------
    # COVER PAGE
    # ----------------------------------------------------
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(36)
    p_title.paragraph_format.space_after = Pt(12)
    run_t = p_title.add_run("DROPCLOCK: SPOTIFY LISTENER BEHAVIOUR ANALYSIS &\nOPTIMAL RELEASE-WINDOW ADVISOR")
    run_t.font.name = "Calibri"
    run_t.font.size = Pt(20)
    run_t.font.bold = True
    run_t.font.color.rgb = NAVY
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(20)
    run_sub = p_sub.add_run("Course End Project report submitted in partial fulfillment of the Requirements for the Award of the Degree of")
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
    r_deg2 = p_deg.add_run("in\nARTIFICIAL INTELLIGENCE AND DATA SCIENCE\nApplied Predictive Analytics (22ADE57N.PE2)")
    r_deg2.font.bold = True
    r_deg2.font.size = Pt(12)
    r_deg2.font.color.rgb = NAVY
    
    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_before = Pt(36)
    p_by.paragraph_format.space_after = Pt(4)
    r_by = p_by.add_run("Submitted By")
    r_by.font.size = Pt(11)
    r_by.font.italic = True
    r_by.font.color.rgb = SLATE
    
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_after = Pt(36)
    r_name = p_name.add_run("BATTIPROLU KARTHIK\n")
    r_name.font.bold = True
    r_name.font.size = Pt(15)
    r_name.font.color.rgb = NAVY
    r_roll = p_name.add_run("Roll No: 160124771304\n(Single Contributor)")
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
    r_men_name = p_men_name.add_run("Mrs. V. Vasuki Rohini Devi / Mrs. P. Greeshma\n")
    r_men_name.font.bold = True
    r_men_name.font.size = Pt(13)
    r_men_name.font.color.rgb = NAVY
    r_men_des = p_men_name.add_run("Assistant Professor, Department of AI & DS")
    r_men_des.font.size = Pt(11)
    r_men_des.font.color.rgb = DARK_GRAY
    
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(20)
    r_inst = p_inst.add_run("DEPARTMENT OF ARTIFICIAL INTELLIGENCE AND DATA SCIENCE\nCHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY (AUTONOMOUS)\nGANDIPET, HYDERABAD – 500075, TELANGANA\nOctober / November 2026")
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
    p_cert_body.paragraph_format.space_after = Pt(20)
    p_cert_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_cb = p_cert_body.add_run(
        "This is to certify that the course end project report entitled \"DROPCLOCK: SPOTIFY LISTENER BEHAVIOUR ANALYSIS & OPTIMAL RELEASE-WINDOW ADVISOR\" "
        "(Applied Predictive Analytics - 22ADE57N.PE2) being submitted by:"
    )
    r_cb.font.size = Pt(11)
    
    # Table with student name
    stu_tbl = doc.add_table(rows=2, cols=2)
    stu_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    stu_tbl.rows[0].cells[0].text = "Student Name"
    stu_tbl.rows[0].cells[1].text = "Roll Number"
    stu_tbl.rows[1].cells[0].text = "BATTIPROLU KARTHIK"
    stu_tbl.rows[1].cells[1].text = "160124771304"
    for r in stu_tbl.rows:
        for c in r.cells:
            set_cell_margins(c, top=80, bottom=80, left=120, right=120)
    set_cell_background(stu_tbl.rows[0].cells[0], "102C57")
    set_cell_background(stu_tbl.rows[0].cells[1], "102C57")
    stu_tbl.rows[0].cells[0].paragraphs[0].runs[0].font.bold = True
    stu_tbl.rows[0].cells[0].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    stu_tbl.rows[0].cells[1].paragraphs[0].runs[0].font.bold = True
    stu_tbl.rows[0].cells[1].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    stu_tbl.rows[1].cells[0].paragraphs[0].runs[0].font.bold = True
    stu_tbl.rows[1].cells[1].paragraphs[0].runs[0].font.bold = True
    
    p_cert_body2 = doc.add_paragraph()
    p_cert_body2.paragraph_format.line_spacing = 1.3
    p_cert_body2.paragraph_format.space_before = Pt(16)
    p_cert_body2.paragraph_format.space_after = Pt(40)
    p_cert_body2.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_cb2 = p_cert_body2.add_run(
        "in partial fulfillment for the award of the Degree of Bachelor of Engineering in Artificial Intelligence and Data Science "
        "to Chaitanya Bharathi Institute of Technology (Autonomous), Hyderabad carried out under our mentorship and supervision during the academic year 2026–2027. "
        "The results presented in this course end project report have not been submitted to any other university or institute for the award of any degree."
    )
    r_cb2.font.size = Pt(11)
    
    sig_table = doc.add_table(rows=1, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = True
    
    c_left = sig_table.rows[0].cells[0]
    p_sig_l = c_left.paragraphs[0]
    r_sig_l = p_sig_l.add_run("___________________________\nMrs. V. Vasuki Rohini Devi\nCourse Coordinator & Mentor\nDept. of AI & DS, CBIT")
    r_sig_l.font.size = Pt(11)
    r_sig_l.font.bold = True
    
    c_right = sig_table.rows[0].cells[1]
    p_sig_r = c_right.paragraphs[0]
    p_sig_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sig_r = p_sig_r.add_run("___________________________\nHead of Department\nDept. of AI & DS\nCBIT, Hyderabad")
    r_sig_r.font.size = Pt(11)
    r_sig_r.font.bold = True
    
    doc.add_page_break()
    
    # ----------------------------------------------------
    # TABLE OF CONTENTS
    # ----------------------------------------------------
    p_toc_h = doc.add_paragraph()
    p_toc_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_th = p_toc_h.add_run("TABLE OF CONTENTS")
    r_th.font.bold = True
    r_th.font.size = Pt(14)
    r_th.font.color.rgb = NAVY
    
    toc_items = [
        ("Abstract", "1"),
        ("1. Introduction", "2"),
        ("   1.1 Project Overview and Industry Problem", "2"),
        ("   1.2 Objectives", "2"),
        ("   1.3 Scope of the Study", "3"),
        ("2. Problem and Domain Analysis", "3"),
        ("   2.1 The Friday Midnight Dilemma", "3"),
        ("   2.2 Cost of Suboptimal Release Windows", "4"),
        ("3. Data Acquisition and Hygiene", "4"),
        ("   3.1 Multi-Source Dataset Integration", "4"),
        ("   3.2 Data Cleaning and Harmonization", "5"),
        ("4. Exploratory Data Analysis (EDA)", "6"),
        ("   4.1 Competition Density & Weekday Distribution", "6"),
        ("   4.2 168-Hour Circadian Listener Intensity", "7"),
        ("   4.3 Cross-Genre Historical Demand Indices", "8"),
        ("5. Predictive Analytics and Modeling", "8"),
        ("   5.1 One-Way ANOVA Hypothesis Testing", "8"),
        ("   5.2 Random Forest Diurnal Activity Smoother", "9"),
        ("   5.3 Supervised Stream Regression & Gini Importance", "9"),
        ("6. DropClock Release-Window Advisor Engine", "10"),
        ("   6.1 Mathematical Formulation of Release Score", "10"),
        ("   6.2 Prime-Time Multi-Hour Selection Rule", "10"),
        ("   6.3 Circular Timezone Translation Engine", "11"),
        ("7. Product Implementation & Pitch Deck Presenter", "11"),
        ("   7.1 Web Dashboard Architecture", "11"),
        ("   7.2 Built-in 14-Slide Presentation Deck", "12"),
        ("8. Model Evaluation and Empirical Results", "12"),
        ("   8.1 Headline Pop Recommendations & Top-5 Windows", "12"),
        ("   8.2 Robustness Sensitivity Sweep", "13"),
        ("   8.3 Catalog Validation (Spearman Rank Correlation)", "13"),
        ("9. Limitations and Ethical Considerations", "14"),
        ("10. Conclusion and Future Roadmap", "14"),
        ("11. References", "15")
    ]
    
    t_toc = doc.add_table(rows=len(toc_items), cols=2)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_toc.autofit = True
    for i, (title, pg) in enumerate(toc_items):
        r = t_toc.rows[i]
        r.cells[0].text = title
        r.cells[1].text = pg
        r.cells[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p0 = r.cells[0].paragraphs[0]
        p1 = r.cells[1].paragraphs[0]
        p0.paragraph_format.line_spacing = 1.15
        p1.paragraph_format.line_spacing = 1.15
        p0.paragraph_format.space_after = Pt(2)
        p1.paragraph_format.space_after = Pt(2)
        for c in [r.cells[0], r.cells[1]]:
            set_cell_margins(c, top=20, bottom=20, left=50, right=50)
            
    doc.add_page_break()
    
    def add_sec_heading(title, num):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(f"{num}. {title}")
        r.font.name = "Calibri"
        r.font.bold = True
        r.font.size = Pt(13)
        r.font.color.rgb = NAVY
        return p

    def add_sub_heading(title, num):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(f"{num} {title}")
        r.font.name = "Calibri"
        r.font.bold = True
        r.font.size = Pt(11.5)
        r.font.color.rgb = DARK_GRAY
        return p

    def add_body(text):
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.2
        p.paragraph_format.space_after = Pt(6)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(10.5)
        r.font.color.rgb = DARK_GRAY
        return p

    def add_figure(img_path, caption):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(8)
            p_img.paragraph_format.space_after = Pt(2)
            r = p_img.add_run()
            r.add_picture(img_path, width=Inches(5.6))
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(10)
            r_cap = p_cap.add_run(caption)
            r_cap.font.name = "Calibri"
            r_cap.font.size = Pt(9.5)
            r_cap.font.bold = True
            r_cap.font.color.rgb = SLATE

    # ----------------------------------------------------
    # ABSTRACT
    # ----------------------------------------------------
    p_abs_h = doc.add_paragraph()
    p_abs_h.paragraph_format.space_before = Pt(10)
    p_abs_h.paragraph_format.space_after = Pt(6)
    r_absh = p_abs_h.add_run("ABSTRACT")
    r_absh.font.bold = True
    r_absh.font.size = Pt(14)
    r_absh.font.color.rgb = NAVY
    
    add_body(
        "Commercial music publishing has long relied on legacy release schedules, with over 42% of tracks released indiscriminately at Friday midnight. "
        "This Course End Project develops DropClock, an applied predictive analytics solution to determine the optimal release weekday and hour on Spotify. "
        "By fusing 4 datasets—Spotify 2023 tracks (n=952), Last.fm 1K user listening events (n=499,995), Spotify historical daily charts across 73 countries (n=100,000), "
        "and an indie release catalog (n=22)—we model the trade-offs between listener presence, weekday momentum, and competition density. "
        "One-way ANOVA indicates that raw weekday differences are not statistically significant (F = 0.618, p = 0.7164), meaning timing must exploit active listener presence. "
        "A Random Forest model yields R² = 0.549 on log-streams, highlighting playlist placement (56.9%) as the dominant driver. "
        "For Pop music, DropClock identifies Saturday at 19:00 as the global optimal drop slot (prime-time score = 0.747), recommending that artists publish 1–2 hours earlier (17:00–18:00) "
        "to ensure algorithmic indexing before audience arrival. The application is packaged with an interactive React dashboard, real-time recalculating sliders, circular timezone translation, and a 14-slide presentation deck."
    )

    # ----------------------------------------------------
    # 1. INTRODUCTION
    # ----------------------------------------------------
    add_sec_heading("Introduction", 1)
    add_sub_heading("Project Overview and Industry Problem", "1.1")
    add_body(
        "Every week, thousands of music tracks compete for consumer attention across Spotify, Apple Music, and social media. "
        "Record labels and self-releasing artists face a pivotal decision: what exact moment should a song be published to maximize initial algorithmic velocity? "
        "Since the establishment of the Global Release Day in 2015, Friday midnight has served as the default release time. "
        "However, this practice produces severe market saturation. Independent artists releasing on Friday must contend with massive marketing blitzes from major labels, "
        "frequently failing to capture algorithmic pickup on Release Radar or Discover Weekly."
    )
    
    add_sub_heading("Objectives", "1.2")
    add_body(
        "The project aims to:\n"
        "1. Resolve the release timestamp absence by synthesizing micro-level scrobble logs with macro-level chart outcomes.\n"
        "2. Empirically test the statistical validity of the Friday release convention using ANOVA and adjusted regression.\n"
        "3. Model the 168-hour circadian listener profile using Fourier-encoded Random Forest regression.\n"
        "4. Formulate a multi-objective scoring function balancing listener volume, day lift, and competition avoidance.\n"
        "5. Deploy a zero-backend interactive web tool with real-time scoring, timezone wrap-around, and pitch presenter."
    )

    add_sub_heading("Scope of the Study", "1.3")
    add_body(
        "The study investigates 9 major music genres (Pop, Hip-Hop/Rap, Rock, Electronic, R&B, Indie, Latin, K-Pop, Indian). "
        "It provides prescriptive decision support for self-releasing artists and indie labels seeking optimal release timing."
    )

    # ----------------------------------------------------
    # 2. PROBLEM & DOMAIN ANALYSIS
    # ----------------------------------------------------
    add_sec_heading("Problem and Domain Analysis", 2)
    add_sub_heading("The Friday Midnight Dilemma", "2.1")
    add_body(
        "When 42% of tracks release on Friday, listener attention is divided across an excessive number of new offerings. "
        "For non-superstar acts, playlist editors have limited bandwidth to review catalogs. "
        "Releasing on days with lower competition density (e.g., Saturday, Wednesday) provides clear runway for audience engagement."
    )

    add_sub_heading("Cost of Suboptimal Release Windows", "2.2")
    add_body(
        "Streaming algorithms prioritize velocity—the rate of streams, saves, and playlist additions in the first 24 to 72 hours. "
        "Publishing during listener troughs (e.g., early weekday mornings) creates a flat initial curve, causing algorithmic systems to abandon wider distribution."
    )

    # ----------------------------------------------------
    # 3. DATA ACQUISITION & HYGIENE
    # ----------------------------------------------------
    add_sec_heading("Data Acquisition and Hygiene", 3)
    add_sub_heading("Multi-Source Dataset Integration", "3.1")
    add_body(
        "DropClock synthesizes four datasets:\n"
        "• Spotify Most Streamed Songs 2023 (Kaggle): 952 tracks, evaluating weekday stream distribution and competition share.\n"
        "• Last.fm 1K User Listening Log: 499,995 timestamped scrobbles, modeling 168-hour circadian listener intensity.\n"
        "• Spotify Historical Daily Charts (73 countries): 100,000 Top-200 chart rows, extracting genre-specific weekday demand indices.\n"
        "• Sample Artist Release Catalog: 22 tracks, providing directional validation via Spearman correlation."
    )

    add_sub_heading("Data Cleaning and Harmonization", "3.2")
    add_body(
        "Corrupted entries (such as track 575's text value in streams) were purged. Streams were log-transformed: y = log(streams). "
        "Timestamps in Last.fm were decomposed into sine and cosine Fourier harmonics to ensure seamless 24-hour cyclical transitions."
    )

    # ----------------------------------------------------
    # 4. EXPLORATORY DATA ANALYSIS
    # ----------------------------------------------------
    add_sec_heading("Exploratory Data Analysis", 4)
    add_sub_heading("Competition Density & Weekday Distribution", "4.1")
    add_body(
        "Friday captures 42.0% of all track releases, followed by Thursday (11.0%) and Saturday (12.0%). "
        "Raw stream averages remain statistically flat across all seven days, demonstrating that Friday confers no inherent volume boost."
    )
    add_figure("verification_screenshots/day_1440.png", "Figure 1: Weekday Release Density, Raw Log-Streams with 95% CI, and Adjusted Weekday Residuals")

    add_sub_heading("168-Hour Circadian Listener Intensity", "4.2")
    add_body(
        "Last.fm scrobble events demonstrate that listener activity rises monotonically from 07:00, reaching global peaks between 18:00 and 21:00. "
        "Saturday displays sustained high-intensity listening throughout late evening hours."
    )
    add_figure("verification_screenshots/time_1440.png", "Figure 2: 168-Hour Listener Activity Heatmap and 24-Hour Diurnal Curves")

    add_sub_heading("Cross-Genre Historical Demand Indices", "4.3")
    add_body(
        "Historical Spotify charts indicate distinct weekly demand profiles across genres: "
        "Electronic and Hip-Hop exhibit heavy weekend surges, while Pop and R&B maintain balanced engagement across weekdays."
    )
    add_figure("verification_screenshots/genre_1440.png", "Figure 3: 9x7 Diverging Demand Index Heatmap and Genre Top-5 Windows")

    # ----------------------------------------------------
    # 5. PREDICTIVE ANALYTICS & MODELING
    # ----------------------------------------------------
    add_sec_heading("Predictive Analytics and Modeling", 5)
    add_sub_heading("One-Way ANOVA Hypothesis Testing", "5.1")
    add_body(
        "A One-Way ANOVA on raw log-streams across release weekdays yields F = 0.618, p = 0.7164. "
        "Since p >= 0.05, there is no statistically significant raw weekday effect in isolation."
    )

    add_sub_heading("Random Forest Modeling & Feature Importance", "5.2")
    add_body(
        "A 100-tree Random Forest regressor on log-streams achieves MAE = 0.467, RMSE = 0.591, and R² = 0.549. "
        "Gini feature importance confirms that playlist inclusions (56.9%), track age (6.55%), and chart counts (5.66%) dominate stream generation."
    )
    add_figure("verification_screenshots/models_1440.png", "Figure 4: Random Forest Model Metrics and Gini Feature Importance Ranking")

    # ----------------------------------------------------
    # 6. DROPCLOCK ADVISOR ENGINE
    # ----------------------------------------------------
    add_sec_heading("DropClock Release-Window Advisor Engine", 6)
    add_sub_heading("Mathematical Formulation", "6.1")
    add_body(
        "The composite score balances three pillars:\n"
        "Release_Score(d, h) = 0.50 × S_activity(d, h) + 0.30 × S_day_performance(d) + 0.20 × (1 − S_competition(d))\n\n"
        "Prime-time selection calculates the mean score across the top 5 hours of each weekday, selecting the day with the highest average to prevent single-hour outlier instability."
    )

    add_sub_heading("Circular Timezone Translation Engine", "6.2")
    add_body(
        "To operationalize recommendations across international markets, DropClock implements a 24-hour and 7-day circular wrap-around engine: "
        "targetMinute = (startMinute + offsetMinutes) mod 10080. "
        "For example, targeting a US Saturday 22:00 window from India (+5:30 offset) shifts the local studio release to Sunday 03:30 (approx. 04:00 slot)."
    )

    # ----------------------------------------------------
    # 7. PRODUCT IMPLEMENTATION & PITCH DECK
    # ----------------------------------------------------
    add_sec_heading("Product Implementation & Built-in Pitch Deck", 7)
    add_sub_heading("Web Application Architecture", "7.1")
    add_body(
        "DropClock was implemented as a production-grade single-page application built on Vite, React 18, TypeScript, and Tailwind CSS. "
        "All calculations occur client-side without backend latency, preserving user privacy during catalog CSV uploads."
    )
    add_figure("verification_screenshots/advisor_1440.png", "Figure 5: Interactive Release Advisor with Coupled Weight Sliders and Catalog Validation")

    add_sub_heading("Built-in Pitch Deck Presenter", "7.2")
    add_body(
        "The /pitch route provides a 14-slide full-screen presentation tool with keyboard navigation, presenter notes drawer (N key), "
        "thumbnail grid overview (G key), and clean 1-slide-per-page print-to-PDF styles."
    )
    add_figure("verification_screenshots/pitch_1440.png", "Figure 6: Built-in 14-Slide Presentation Deck (/pitch)")

    # ----------------------------------------------------
    # 8. MODEL EVALUATION & RESULTS
    # ----------------------------------------------------
    add_sec_heading("Model Evaluation and Empirical Results", 8)
    add_sub_heading("Pop Genre Optimal Release Window", "8.1")
    add_body(
        "For Pop music, DropClock identifies Saturday at 19:00 as the global optimal drop slot (prime-time score = 0.747). "
        "The recommended 3-hour cluster spans 19:00, 20:00, and 21:00 on Saturday. "
        "Artists are instructed to publish 1–2 hours prior (17:00–18:00) so playlist ingestion finishes before listener volume peaks."
    )

    add_sub_heading("Sensitivity and Robustness Verification", "8.2")
    add_body(
        "Sweeping activity weights from 0.20 to 0.80 and day performance from 0.10 to 0.60 across 27 combinations "
        "confirmed Saturday as the winner in 63.0% of sweeps, Friday in 25.9%, and Wednesday in 11.1%."
    )

    add_sub_heading("Catalog Validation via Spearman Correlation", "8.3")
    add_body(
        "Evaluating historical releases from the indie catalog against model scores yielded a positive Spearman rank correlation of r = 0.134, "
        "confirming that higher-scoring release windows directionally correlate with higher first-7-day streams."
    )

    # ----------------------------------------------------
    # 9. LIMITATIONS
    # ----------------------------------------------------
    add_sec_heading("Limitations and Analytical Boundaries", 9)
    add_body(
        "1. Public Spotify data lacks release hours; hourly profiles rely on Last.fm scrobble data.\n"
        "2. Last.fm users skew desktop/enthusiast compared to the global mobile streaming audience.\n"
        "3. Spotify charts reflect Top-200 survivor bias toward established major-label tracks.\n"
        "4. Scoring weights (50/30/20) represent an empirical modeling assumption.\n"
        "5. Streams are cumulative counts; track age is controlled for using log1p(age)."
    )

    # ----------------------------------------------------
    # 10. CONCLUSION & FUTURE ROADMAP
    # ----------------------------------------------------
    add_sec_heading("Conclusion and Future Roadmap", 10)
    add_body(
        "DropClock demonstrates that Friday's release habit lacks organic streaming support and that Saturday evening offers an optimal uncrowded window for Pop. "
        "Future enhancements include direct distributor telemetry (DistroKid, TuneCore), territory-specific commute adjustments, and controlled A/B release experiments."
    )

    # ----------------------------------------------------
    # 11. REFERENCES
    # ----------------------------------------------------
    add_sec_heading("References", 11)
    refs = [
        "[1] Last.fm 1K Dataset Release Repository, University of Barcelona / Last.fm Public Research (2020).",
        "[2] N. Withana, \"Top Spotify Songs 2023: Audio Features & Streaming Metrics,\" Kaggle Dataset (2023).",
        "[3] Spotify Technology S.A., \"Spotify Charts API: Top-200 Daily Records (73 Countries),\" (2024).",
        "[4] International Federation of the Phonographic Industry (IFPI), \"Global Music Report,\" (2015).",
        "[5] L. Breiman, \"Random Forests,\" Machine Learning, vol. 45, no. 1, pp. 5–32, 2001.",
        "[6] F. Pedregosa et al., \"Scikit-learn: Machine Learning in Python,\" JMLR, vol. 12, pp. 2825–2830, 2011.",
        "[7] C. Spearman, \"The Proof and Measurement of Association between Two Things,\" Am. J. Psychol., 1904.",
        "[8] Vite Community, \"Vite: Next Generation Frontend Tooling & React Single-Page Application Framework,\" (2024)."
    ]
    for rf in refs:
        p_rf = doc.add_paragraph()
        p_rf.paragraph_format.line_spacing = 1.15
        p_rf.paragraph_format.space_after = Pt(3)
        r_rf = p_rf.add_run(rf)
        r_rf.font.size = Pt(9)
        r_rf.font.color.rgb = DARK_GRAY

    out_file = "APA_Course_End_Project_Report_Karthik.docx"
    doc.save(out_file)
    print(f"APA report saved to {out_file} ({os.path.getsize(out_file)/1024:.1f} KB)")

if __name__ == "__main__":
    create_apa_report()
