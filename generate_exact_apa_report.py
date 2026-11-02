import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.enum.section import WD_SECTION_START
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_margins(cell, top=80, bottom=80, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def generate_report():
    doc = docx.Document()
    
    # ----------------------------------------------------
    # SECTION 1: COVER & CERTIFICATE (No Header, No Footer)
    # ----------------------------------------------------
    sec1 = doc.sections[0]
    sec1.top_margin = Inches(0.8)
    sec1.bottom_margin = Inches(0.8)
    sec1.left_margin = Inches(1.0)
    sec1.right_margin = Inches(1.0)
    sec1.header.is_linked_to_previous = False
    sec1.footer.is_linked_to_previous = False
    
    # Clear any header/footer in section 1
    sec1.header.paragraphs[0].text = ""
    sec1.footer.paragraphs[0].text = ""

    BLACK = RGBColor(0, 0, 0)
    
    # --- PAGE 1: COVER PAGE ---
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(24)
    p_title.paragraph_format.space_after = Pt(16)
    p_title.paragraph_format.line_spacing = 1.15
    r_t = p_title.add_run("SPOTIFY LISTENER BEHAVIOUR ANALYSIS &\nRELEASE-WINDOW ADVISOR")
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(15)
    r_t.font.bold = True
    r_t.font.color.rgb = BLACK
    
    p_desc = doc.add_paragraph()
    p_desc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_desc.paragraph_format.space_after = Pt(2)
    p_desc.paragraph_format.line_spacing = 1.15
    r_d1 = p_desc.add_run("Course End Project report submitted in partial fulfillment of the Requirements for the\nAward of the Degree of")
    r_d1.font.name = "Times New Roman"
    r_d1.font.size = Pt(10.5)
    r_d1.font.bold = True
    r_d1.font.color.rgb = BLACK
    
    p_deg = doc.add_paragraph()
    p_deg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_deg.paragraph_format.space_before = Pt(2)
    p_deg.paragraph_format.space_after = Pt(16)
    p_deg.paragraph_format.line_spacing = 1.15
    r_deg1 = p_deg.add_run("BACHELOR OF ENGINEERING\n")
    r_deg1.font.name = "Times New Roman"
    r_deg1.font.size = Pt(11.5)
    r_deg1.font.bold = True
    r_deg1.font.color.rgb = BLACK
    r_deg2 = p_deg.add_run("in\n")
    r_deg2.font.name = "Times New Roman"
    r_deg2.font.size = Pt(10.5)
    r_deg2.font.color.rgb = BLACK
    r_deg3 = p_deg.add_run("ARTIFICIAL INTELLIGENCE AND DATA SCIENCE\n")
    r_deg3.font.name = "Times New Roman"
    r_deg3.font.size = Pt(11.5)
    r_deg3.font.bold = True
    r_deg3.font.color.rgb = BLACK
    r_deg4 = p_deg.add_run("Applied Predictive Analytics (22ADE57N.PE2)")
    r_deg4.font.name = "Times New Roman"
    r_deg4.font.size = Pt(10.5)
    r_deg4.font.bold = True
    r_deg4.font.color.rgb = BLACK
    
    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_before = Pt(8)
    p_by.paragraph_format.space_after = Pt(4)
    r_by = p_by.add_run("By")
    r_by.font.name = "Times New Roman"
    r_by.font.size = Pt(11)
    r_by.font.bold = True
    r_by.font.color.rgb = BLACK
    
    p_author = doc.add_paragraph()
    p_author.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_author.paragraph_format.space_after = Pt(18)
    r_a1 = p_author.add_run("BATTIPROLU KARTHIK     160124771304")
    r_a1.font.name = "Times New Roman"
    r_a1.font.size = Pt(11)
    r_a1.font.bold = True
    r_a1.font.color.rgb = BLACK
    
    p_men = doc.add_paragraph()
    p_men.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_men.paragraph_format.space_before = Pt(4)
    p_men.paragraph_format.space_after = Pt(2)
    r_men = p_men.add_run("Under the Mentorship of")
    r_men.font.name = "Times New Roman"
    r_men.font.size = Pt(11)
    r_men.font.bold = True
    r_men.font.color.rgb = BLACK
    
    p_men_name = doc.add_paragraph()
    p_men_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_men_name.paragraph_format.space_after = Pt(16)
    r_mn = p_men_name.add_run("Mrs. V. Vasuki Rohini Devi")
    r_mn.font.name = "Times New Roman"
    r_mn.font.size = Pt(11.5)
    r_mn.font.bold = True
    r_mn.font.color.rgb = BLACK
    
    # CBIT Logo on Cover
    if os.path.exists("cbit_logo.png"):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(6)
        p_logo.paragraph_format.space_after = Pt(14)
        r_logo = p_logo.add_run()
        r_logo.add_picture("cbit_logo.png", width=Inches(1.35))
        
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.line_spacing = 1.2
    p_inst.paragraph_format.space_after = Pt(0)
    r_ins = p_inst.add_run("DEPARTMENT OF ARTIFICIAL INTELLIGENCE AND DATA SCIENCE\nCHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY\nHYDERABAD - 500075\nOctober 2026")
    r_ins.font.name = "Times New Roman"
    r_ins.font.size = Pt(11)
    r_ins.font.bold = True
    r_ins.font.color.rgb = BLACK
    
    doc.add_page_break()
    
    # --- PAGE 2: CERTIFICATE ---
    p_cbit_h = doc.add_paragraph()
    p_cbit_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cbit_h.paragraph_format.space_before = Pt(18)
    p_cbit_h.paragraph_format.line_spacing = 1.15
    p_cbit_h.paragraph_format.space_after = Pt(10)
    r_cb1 = p_cbit_h.add_run("CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY\n(AUTONOMOUS)\nDEPARTMENT OF ARTIFICIAL INTELLIGENCE AND DATA SCIENCE")
    r_cb1.font.name = "Times New Roman"
    r_cb1.font.size = Pt(11.5)
    r_cb1.font.bold = True
    r_cb1.font.color.rgb = BLACK
    
    # CBIT Logo on Certificate
    if os.path.exists("cbit_logo_cert.png"):
        p_logo_cert = doc.add_paragraph()
        p_logo_cert.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo_cert.paragraph_format.space_before = Pt(4)
        p_logo_cert.paragraph_format.space_after = Pt(12)
        r_lc = p_logo_cert.add_run()
        r_lc.add_picture("cbit_logo_cert.png", width=Inches(1.05))
        
    p_cert_title = doc.add_paragraph()
    p_cert_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_title.paragraph_format.space_before = Pt(6)
    p_cert_title.paragraph_format.space_after = Pt(14)
    r_ct = p_cert_title.add_run("CERTIFICATE")
    r_ct.font.name = "Times New Roman"
    r_ct.font.size = Pt(13)
    r_ct.font.bold = True
    r_ct.font.color.rgb = BLACK
    
    p_cert_txt1 = doc.add_paragraph()
    p_cert_txt1.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_cert_txt1.paragraph_format.line_spacing = 1.3
    p_cert_txt1.paragraph_format.space_after = Pt(14)
    r_ctxt1 = p_cert_txt1.add_run(
        "This is to certify that the course end project report SPOTIFY LISTENER BEHAVIOUR ANALYSIS & RELEASE-WINDOW ADVISOR "
        "(Applied Predictive Analytics) being submitted by"
    )
    r_ctxt1.font.name = "Times New Roman"
    r_ctxt1.font.size = Pt(11)
    r_ctxt1.font.color.rgb = BLACK
    
    # Student Table exactly like reference
    cert_tbl = doc.add_table(rows=2, cols=2)
    cert_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cert_tbl.autofit = False
    cert_tbl.columns[0].width = Inches(3.2)
    cert_tbl.columns[1].width = Inches(3.0)
    
    # Row 0: Headers
    cell_n_h = cert_tbl.rows[0].cells[0]
    cell_r_h = cert_tbl.rows[0].cells[1]
    cell_n_h.text = "Name"
    cell_r_h.text = "Roll No"
    cell_n_h.paragraphs[0].runs[0].font.name = "Times New Roman"
    cell_n_h.paragraphs[0].runs[0].font.size = Pt(11)
    cell_n_h.paragraphs[0].runs[0].font.bold = True
    cell_r_h.paragraphs[0].runs[0].font.name = "Times New Roman"
    cell_r_h.paragraphs[0].runs[0].font.size = Pt(11)
    cell_r_h.paragraphs[0].runs[0].font.bold = True
    
    # Row 1: Student
    cell_n = cert_tbl.rows[1].cells[0]
    cell_r = cert_tbl.rows[1].cells[1]
    cell_n.text = "BATTIPROLU KARTHIK"
    cell_r.text = "160124771304"
    cell_n.paragraphs[0].runs[0].font.name = "Times New Roman"
    cell_n.paragraphs[0].runs[0].font.size = Pt(11)
    cell_r.paragraphs[0].runs[0].font.name = "Times New Roman"
    cell_r.paragraphs[0].runs[0].font.size = Pt(11)
    
    for r in cert_tbl.rows:
        for c in r.cells:
            set_cell_margins(c, top=40, bottom=40, left=40, right=40)
            
    p_cert_txt2 = doc.add_paragraph()
    p_cert_txt2.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_cert_txt2.paragraph_format.line_spacing = 1.3
    p_cert_txt2.paragraph_format.space_before = Pt(14)
    p_cert_txt2.paragraph_format.space_after = Pt(48)
    r_ctxt2 = p_cert_txt2.add_run(
        "in partial fulfillment for the award of the Degree of Bachelor of Engineering in Artificial Intelligence and Data Science "
        "to the CHAITANYA BHARATHI INSTITUTE OF TECHNOLOGY, HYDERABAD carried out under my mentorship and supervision during the year 2026-27. "
        "The results presented in this report have not been submitted to any other university or Institute for the award of any degree."
    )
    r_ctxt2.font.name = "Times New Roman"
    r_ctxt2.font.size = Pt(11)
    r_ctxt2.font.color.rgb = BLACK
    
    p_sig = doc.add_paragraph()
    p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sig.paragraph_format.line_spacing = 1.2
    r_sig1 = p_sig.add_run("Mrs. V. Vasuki Rohini Devi\n")
    r_sig1.font.name = "Times New Roman"
    r_sig1.font.size = Pt(11.5)
    r_sig1.font.bold = True
    r_sig1.font.color.rgb = BLACK
    r_sig2 = p_sig.add_run("Assistant Professor")
    r_sig2.font.name = "Times New Roman"
    r_sig2.font.size = Pt(11)
    r_sig2.font.bold = True
    r_sig2.font.color.rgb = BLACK
    
    # ----------------------------------------------------
    # SECTION 2: REPORT BODY (With Running Header & Footer)
    # ----------------------------------------------------
    sec2 = doc.add_section(WD_SECTION_START.NEW_PAGE)
    sec2.top_margin = Inches(0.8)
    sec2.bottom_margin = Inches(0.8)
    sec2.left_margin = Inches(1.0)
    sec2.right_margin = Inches(1.0)
    sec2.header.is_linked_to_previous = False
    sec2.footer.is_linked_to_previous = False
    
    # Header format matching reference:
    # Line 1: Spotify Listener Behaviour Analysis...   October 2026
    # Line 2: Applied Predictive Analytics | Dept. of AI & DS, CBIT Page X
    p_h2 = sec2.header.paragraphs[0]
    p_h2.paragraph_format.line_spacing = 1.15
    r_h2_1 = p_h2.add_run("DropClock: Spotify Listener Behaviour Analysis & Release-Window Advisor             October 2026\nApplied Predictive Analytics  |  Dept. of AI & DS, CBIT                                                Page ")
    r_h2_1.font.name = "Times New Roman"
    r_h2_1.font.size = Pt(8.5)
    r_h2_1.font.color.rgb = RGBColor(71, 85, 105)
    
    # Add page number field to header
    fldSimple = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
    p_h2._p.append(fldSimple)

    def add_sec_heading(title, num):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(f"{num}. {title}")
        r.font.name = "Times New Roman"
        r.font.bold = True
        r.font.size = Pt(12)
        r.font.color.rgb = BLACK
        return p

    def add_sub_heading(title, num):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(f"{num} {title}")
        r.font.name = "Times New Roman"
        r.font.bold = True
        r.font.size = Pt(11)
        r.font.color.rgb = BLACK
        return p

    def add_body(text):
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.2
        p.paragraph_format.space_after = Pt(6)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.5)
        r.font.color.rgb = BLACK
        return p

    def add_figure(img_path, caption):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(8)
            p_img.paragraph_format.space_after = Pt(2)
            r = p_img.add_run()
            r.add_picture(img_path, width=Inches(5.5))
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(8)
            r_cap = p_cap.add_run(caption)
            r_cap.font.name = "Times New Roman"
            r_cap.font.size = Pt(9.5)
            r_cap.font.bold = True
            r_cap.font.color.rgb = BLACK

    # --- TABLE OF CONTENTS ---
    p_toch = doc.add_paragraph()
    p_toch.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_toch.paragraph_format.space_before = Pt(10)
    p_toch.paragraph_format.space_after = Pt(8)
    r_toch = p_toch.add_run("TABLE OF CONTENTS")
    r_toch.font.name = "Times New Roman"
    r_toch.font.bold = True
    r_toch.font.size = Pt(12)
    r_toch.font.color.rgb = BLACK
    
    toc_data = [
        ("Abstract", "2"),
        ("1. Introduction", "2"),
        ("   1.1 Project Overview and Need", "2"),
        ("   1.2 Objectives of the Project", "2"),
        ("   1.3 Scope of the Project", "2"),
        ("2. Problem and Domain Analysis", "3"),
        ("   2.1 The Friday Release Habit", "3"),
        ("   2.2 Cost of Suboptimal Timing", "3"),
        ("3. Data Acquisition and Hygiene", "4"),
        ("   3.1 Multi-Source Dataset Integration", "4"),
        ("   3.2 Data Quality and Preprocessing", "4"),
        ("4. Exploratory Data Analysis", "5"),
        ("   4.1 Competition Density & Weekday Distribution", "5"),
        ("   4.2 168-Hour Circadian Listener Intensity", "6"),
        ("   4.3 Cross-Genre Historical Demand Indices", "7"),
        ("5. Predictive Analytics and Modeling", "7"),
        ("   5.1 One-Way ANOVA Hypothesis Testing", "7"),
        ("   5.2 Random Forest Diurnal Activity Smoother", "8"),
        ("   5.3 Supervised Stream Regression & Gini Importance", "8"),
        ("6. DropClock Release-Window Advisor Engine", "9"),
        ("   6.1 Mathematical Formulation of Release Score", "9"),
        ("   6.2 Prime-Time Multi-Hour Selection Rule", "9"),
        ("   6.3 Circular Timezone Translation Engine", "10"),
        ("7. Product Implementation & Built-in Pitch Deck", "10"),
        ("   7.1 Web Dashboard Architecture", "10"),
        ("   7.2 Built-in 14-Slide Presentation Deck", "11"),
        ("8. Model Evaluation and Empirical Results", "11"),
        ("   8.1 Headline Pop Recommendations & Top-5 Windows", "11"),
        ("   8.2 Robustness Sensitivity Sweep", "12"),
        ("   8.3 Catalog Validation via Spearman Correlation", "12"),
        ("9. Limitations and Analytical Boundaries", "13"),
        ("10. Conclusion and Future Roadmap", "13"),
        ("11. References", "13")
    ]
    
    toc_tbl = doc.add_table(rows=len(toc_data), cols=2)
    toc_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    toc_tbl.columns[0].width = Inches(5.2)
    toc_tbl.columns[1].width = Inches(0.8)
    for i, (title, pg) in enumerate(toc_data):
        row = toc_tbl.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.text = title
        c1.text = pg
        c1.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p0, p1 = c0.paragraphs[0], c1.paragraphs[0]
        p0.paragraph_format.line_spacing = 1.15
        p1.paragraph_format.line_spacing = 1.15
        p0.paragraph_format.space_after = Pt(1.5)
        p1.paragraph_format.space_after = Pt(1.5)
        for r in p0.runs + p1.runs:
            r.font.name = "Times New Roman"
            r.font.size = Pt(10)
            r.font.color.rgb = BLACK
        set_cell_margins(c0, top=15, bottom=15, left=30, right=30)
        set_cell_margins(c1, top=15, bottom=15, left=30, right=30)
        
    doc.add_page_break()
    
    # --- ABSTRACT ---
    p_ab = doc.add_paragraph()
    p_ab.paragraph_format.space_before = Pt(8)
    p_ab.paragraph_format.space_after = Pt(4)
    r_ab = p_ab.add_run("ABSTRACT")
    r_ab.font.name = "Times New Roman"
    r_ab.font.bold = True
    r_ab.font.size = Pt(12)
    
    add_body(
        "Commercial music releases are overwhelmingly concentrated on Friday midnight, creating extreme catalog congestion where emerging tracks fail to gain algorithmic traction. "
        "This project develops DropClock, an applied predictive analytics solution to determine the optimal release weekday and hour on Spotify for any musical genre. "
        "To overcome the absence of release-hour timestamps in public track datasets, we integrate four complementary sources: "
        "(1) 952 tracks from Spotify Most Streamed Songs 2023 for competition share and stream distribution; "
        "(2) 499,995 listening events from the Last.fm 1,000-user listening log to extract 168-hour circadian activity, smoothed via Random Forest regression; "
        "(3) 100,000 Top-200 daily chart rows across 73 countries to isolate weekday demand indices across 9 musical styles; and "
        "(4) an indie artist catalog to provide directional validation via Spearman rank correlation (r = 0.134). "
        "One-way ANOVA indicates that raw weekday differences are not statistically significant (F = 0.618, p = 0.7164 >= 0.05), proving that Friday confers no inherent volume boost. "
        "A Random Forest regressor on log-streams achieves R² = 0.549, demonstrating that playlist placement (56.9%) dominates commercial outcomes. "
        "DropClock balances listener presence (50%), day lift (30%), and low competition (20%). For Pop music, Saturday at 19:00 is identified as the optimal drop slot (prime-time score = 0.747), "
        "recommending that artists publish 1–2 hours prior (17:00–18:00) so playlist indexing completes before listener traffic peaks. "
        "The system is deployed as a static web tool with real-time recalculating sliders, circular timezone translation, in-browser CSV parsing, and a 14-slide presentation deck."
    )

    # --- 1. INTRODUCTION ---
    add_sec_heading("Introduction", 1)
    add_sub_heading("Project Overview and Need", "1.1")
    add_body(
        "In the streaming music industry, release timing has historically followed universal industry convention rather than listener data. "
        "Since the establishment of the Global Release Day in 2015, Friday midnight has served as the default release moment. "
        "However, this practice produces severe market saturation. Independent artists releasing on Friday must contend with major label marketing blitzes, "
        "frequently failing to capture algorithmic pickup on Release Radar, Discover Weekly, or Daily Mixes."
    )

    add_sub_heading("Objectives of the Project", "1.2")
    add_body(
        "The project objectives are:\n"
        "• Synthesize multi-source datasets to resolve the missing timestamp limitation.\n"
        "• Model 168 hours of circadian listener behavior from 500,000 Last.fm scrobble events.\n"
        "• Conduct formal hypothesis testing (ANOVA) to assess raw weekday stream differences.\n"
        "• Formulate a multi-criteria scoring algorithm balancing activity, day lift, and low competition.\n"
        "• Implement a responsive web application and executive pitch deck with real-time scoring and timezone wrap-around."
    )

    add_sub_heading("Scope of the Project", "1.3")
    add_body(
        "The scope encompasses 9 major music styles (Pop, Hip-Hop/Rap, Rock, Electronic, R&B, Indie, Latin, K-Pop, Indian), providing prescriptive timing recommendations across global timezones."
    )

    # --- 2. PROBLEM & DOMAIN ANALYSIS ---
    add_sec_heading("Problem and Domain Analysis", 2)
    add_sub_heading("The Friday Release Habit", "2.1")
    add_body(
        "Over 42.0% of analyzed tracks are published on Friday, concentrating competition on a single morning. "
        "For non-superstar acts, playlist editors have limited bandwidth to evaluate catalogs, leading to immediate algorithmic cannibalism."
    )

    add_sub_heading("Cost of Suboptimal Timing", "2.2")
    add_body(
        "Streaming recommendation algorithms rely on velocity. Releasing during listener activity troughs produces a flat initial engagement curve, causing recommendation engines to deprioritize the track."
    )

    # --- 3. DATA ACQUISITION & HYGIENE ---
    add_sec_heading("Data Acquisition and Hygiene", 3)
    add_sub_heading("Multi-Source Dataset Integration", "3.1")
    add_body(
        "DropClock fuses four distinct datasets:\n"
        "1. Spotify Most Streamed Songs 2023 (n = 952): release weekday distribution and stream performance.\n"
        "2. Last.fm 1K User Listening Log (n = 499,995): global 168-hour circadian activity.\n"
        "3. Spotify Historical Daily Charts (n = 100,000, 73 countries): cross-genre weekday demand indices.\n"
        "4. Sample Artist Release Catalog (n = 22): empirical validation check."
    )

    add_sub_heading("Data Quality and Preprocessing", "3.2")
    add_body(
        "Corrupted row 575 in Spotify tracks was dropped. Streams were log-transformed: y = log(streams). "
        "Timestamps in Last.fm were decomposed into sine/cosine Fourier harmonics to preserve 24-hour diurnal continuity."
    )

    # --- 4. EXPLORATORY DATA ANALYSIS ---
    add_sec_heading("Exploratory Data Analysis", 4)
    add_sub_heading("Competition Density & Weekday Distribution", "4.1")
    add_body(
        "Friday accounts for 42.0% of releases (400 tracks), followed by Thursday (11.0%) and Saturday (12.0%). "
        "Raw stream averages remain statistically flat across all 7 days (mean log streams: Mon 19.23, Tue 19.28, Wed 19.41, Thu 19.38, Fri 19.45, Sat 19.47, Sun 19.25)."
    )
    add_figure("verification_screenshots/day_1440.png", "Figure 1: Weekday Release Density (Competition Share), Raw Log-Streams with 95% CI, and Adjusted Weekday Residuals")

    add_sub_heading("168-Hour Circadian Listener Intensity", "4.2")
    add_body(
        "Last.fm scrobble events show listening volume rising monotonically from 07:00 to peak between 18:00 and 21:00 local time. Saturday activity remains elevated late into the night."
    )
    add_figure("verification_screenshots/time_1440.png", "Figure 2: 168-Hour Listener Activity Heatmap and 24-Hour Diurnal Curves")

    add_sub_heading("Cross-Genre Historical Demand Indices", "4.3")
    add_body(
        "Genre-specific demand from 100,000 Top-200 chart rows reveals that Electronic and Hip-Hop surge on weekends, while Pop exhibits steady engagement across the week."
    )
    add_figure("verification_screenshots/genre_1440.png", "Figure 3: 9x7 Diverging Demand Index Heatmap and Genre Top-5 Windows")

    # --- 5. PREDICTIVE ANALYTICS & MODELING ---
    add_sec_heading("Predictive Analytics and Modeling", 5)
    add_sub_heading("One-Way ANOVA Hypothesis Testing", "5.1")
    add_body(
        "A One-Way ANOVA test yields F = 0.618, p = 0.7164. Because p >= 0.05, there is no statistically significant difference in raw cumulative streams solely attributable to release weekday."
    )

    add_sub_heading("Random Forest Modeling & Feature Importance", "5.2")
    add_body(
        "A 100-tree Random Forest regressor achieves MAE = 0.467, RMSE = 0.591, and R² = 0.549. "
        "Gini feature importance confirms that playlist placement (56.9%) and track age (6.55%) dominate streams, while raw release day has negligible standalone influence."
    )
    add_figure("verification_screenshots/models_1440.png", "Figure 4: Random Forest Model Metrics and Gini Feature Importance Ranking")

    # --- 6. ADVISOR ENGINE & FORMULATION ---
    add_sec_heading("DropClock Release-Window Advisor Engine", 6)
    add_sub_heading("Mathematical Formulation of Release Score", "6.1")
    add_body(
        "The composite score is calculated as:\n"
        "Release_Score(d, h) = 0.50 × S_activity(d, h) + 0.30 × S_day_performance(d) + 0.20 × (1 − S_competition(d))\n\n"
        "The winning day is selected by the highest mean across its top 5 hours (prime-time rule), and the best hour is the argmax on that day."
    )

    add_sub_heading("Circular Timezone Translation Engine", "6.2")
    add_body(
        "The timezone engine translates audience peak time to the publisher's local studio clock using circular modulo-10080 minute math, correctly handling 24-hour and 7-day wrap-around."
    )

    # --- 7. PRODUCT & PITCH DECK IMPLEMENTATION ---
    add_sec_heading("Product Implementation & Built-in Pitch Deck", 7)
    add_sub_heading("Web Dashboard Architecture", "7.1")
    add_body(
        "DropClock was implemented as a production-grade single-page application built on Vite, React 18, TypeScript, and Tailwind CSS. Calculations execute client-side, ensuring instant responsiveness and catalog privacy."
    )
    add_figure("verification_screenshots/advisor_1440.png", "Figure 5: Interactive Release Advisor with Real-Time Weight Sliders and Catalog Sanity Check")

    add_sub_heading("Built-in 14-Slide Presentation Deck", "7.2")
    add_body(
        "The /pitch route houses an executive presentation presenter featuring arrow key navigation, speaker notes drawer (N key), thumbnail overview (G key), and PDF export."
    )
    add_figure("verification_screenshots/pitch_1440.png", "Figure 6: Built-in 14-Slide Presentation Deck (/pitch)")

    # --- 8. RESULTS & DISCUSSION ---
    add_sec_heading("Model Evaluation and Empirical Results", 8)
    add_sub_heading("Headline Pop Recommendations", "8.1")
    add_body(
        "For Pop, DropClock identifies Saturday at 19:00 as the optimal drop slot (prime-time score = 0.747, top 3-hour cluster: 19:00, 20:00, 21:00). "
        "Artists are advised to go live 1–2 hours prior (17:00–18:00) so playlist ingestion finishes before listener volume surges."
    )

    add_sub_heading("Robustness Sensitivity Analysis", "8.2")
    add_body(
        "A sweep across 27 weight combinations confirms that Saturday wins in 63.0% of sweeps, Friday in 25.9%, and Wednesday in 11.1%."
    )

    add_sub_heading("Catalog Validation via Spearman Correlation", "8.3")
    add_body(
        "Evaluating historical releases from the indie catalog against model scores yielded a positive Spearman correlation of r = 0.134."
    )

    # --- 9. LIMITATIONS ---
    add_sec_heading("Limitations and Analytical Boundaries", 9)
    add_body(
        "1. Public Spotify data lacks release hours; hourly profiles rely on Last.fm scrobbles.\n"
        "2. Last.fm users skew desktop/enthusiast compared to the global mobile streaming audience.\n"
        "3. Spotify charts reflect Top-200 survivor bias toward established acts.\n"
        "4. Scoring weights (50/30/20) represent an empirical modeling assumption.\n"
        "5. Streams are cumulative counts; track age is controlled for using log1p(age)."
    )

    # --- 10. CONCLUSION ---
    add_sec_heading("Conclusion and Future Roadmap", 10)
    add_body(
        "DropClock demonstrates that Friday's release habit lacks organic streaming support and that Saturday evening offers an optimal uncrowded window for Pop. "
        "Future enhancements include direct distributor telemetry (DistroKid, TuneCore), territory-specific commute adjustments, and controlled A/B release experiments."
    )

    # --- 11. REFERENCES ---
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
        p_rf.paragraph_format.space_after = Pt(2.5)
        r_rf = p_rf.add_run(rf)
        r_rf.font.name = "Times New Roman"
        r_rf.font.size = Pt(9.5)
        r_rf.font.color.rgb = BLACK

    out_docx = "APA_Course_End_Project_Report_Karthik.docx"
    doc.save(out_docx)
    print(f"Generated {out_docx} successfully ({os.path.getsize(out_docx)/1024:.1f} KB)")

if __name__ == "__main__":
    generate_report()
