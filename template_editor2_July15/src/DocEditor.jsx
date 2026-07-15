import React, { useState, useRef, useEffect } from "react";
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  AlignJustify, List, ListOrdered, CheckSquare, Undo2, Redo2, Image as ImageIcon,
  Table as TableIcon, Link2, Minus, ZoomIn, ZoomOut, FileText, Upload, Download,
  Printer, ChevronDown, ChevronRight, Plus, Trash2, FilePlus2, X, Paintbrush,
  Highlighter, Eraser, Circle, Square as SquareIcon, ArrowRight, FolderOpen,
  Smile, CalendarClock, Sparkles, PenTool
} from "lucide-react";
import { TemplateLibrarySection, DocumentFormPanel } from "./BusinessDocPanel";
import { BUSINESS_TEMPLATES, findTemplate } from "./templates/catalog";
import { buildFormSchema, defaultValuesFor, emptyItemRow, computeTotals, renderTemplateHtml } from "./templates/engine";

const A4_W_MM = 210, A4_H_MM = 297;
const PX_PER_MM = 3.7795;
const PAGE_W = Math.round(A4_W_MM * PX_PER_MM);
const PAGE_H = Math.round(A4_H_MM * PX_PER_MM);

const INK = "#18141F";
const PANEL = "#211B30";
const PANEL_2 = "#2A2340";
const VIOLET = "#8B5EFF";
const AMBER = "#FFB255";
const CANVAS_BG = "linear-gradient(160deg,#EDE8F9 0%,#DED4F3 55%,#D6C9EE 100%)";

const FONTS = ["Arial", "Georgia", "Times New Roman", "Courier New", "Verdana", "Tahoma", "Trebuchet MS"];
const SIZES = ["10", "11", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48"];
const EMOJIS = ["😀","😂","😍","👍","🎉","🔥","✅","⭐","📌","📅","✉️","📊","🚀","❤️","💡","📎"];

// ---------- Designed templates (Canva-style, real layout + color) ----------
const TEMPLATES = {
  blank: { label: "Blank Document", swatch: ["#FFFFFF","#EEE","#EEE"], html: `<p><br></p>` },

  resume: {
    label: "Resume",
    swatch: ["#221B33","#8B5EFF","#F5F3FB"],
    html: `
    <div contenteditable="false" style="display:flex;gap:0;margin:-72px -72px 0 -72px;">
      <div style="width:34%;background:${PANEL};color:#EDE8FB;padding:40px 24px;min-height:${PAGE_H - 20}px;box-sizing:border-box;">
        ${photoSlotHTML({ w: 88, h: 88, radius: "50%", bg: VIOLET, extraStyle: "margin-bottom:18px;", label: "Add photo" })}
        <div contenteditable="true" style="font-size:22px;font-weight:700;line-height:1.25;">Jordan<br>Avery</div>
        <div contenteditable="true" style="font-size:12px;color:${AMBER};letter-spacing:1px;text-transform:uppercase;margin-top:4px;">Product Designer</div>
        <div style="height:1px;background:#4A3F66;margin:20px 0;"></div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${AMBER};margin-bottom:8px;">Contact</div>
        <div contenteditable="true" style="font-size:12px;line-height:1.9;color:#D9D2EE;">jordan.avery@email.com<br>+1 (555) 010-2837<br>Austin, TX</div>
        <div style="height:1px;background:#4A3F66;margin:20px 0;"></div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${AMBER};margin-bottom:10px;">Skills</div>
        <div contenteditable="true" style="display:flex;flex-wrap:wrap;gap:6px;">
          <span style="background:#3A3055;padding:4px 10px;border-radius:99px;font-size:11px;">Figma</span>
          <span style="background:#3A3055;padding:4px 10px;border-radius:99px;font-size:11px;">Prototyping</span>
          <span style="background:#3A3055;padding:4px 10px;border-radius:99px;font-size:11px;">Design Systems</span>
          <span style="background:#3A3055;padding:4px 10px;border-radius:99px;font-size:11px;">Research</span>
        </div>
        <div style="height:1px;background:#4A3F66;margin:20px 0;"></div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${AMBER};margin-bottom:8px;">Education</div>
        <div contenteditable="true" style="font-size:12px;line-height:1.7;color:#D9D2EE;"><strong style="color:#fff;">B.A. Design</strong><br>Rivertown University<br>2014 – 2018</div>
      </div>
      <div style="width:66%;padding:40px 36px;box-sizing:border-box;">
        <div contenteditable="true" style="font-size:13px;text-transform:uppercase;letter-spacing:2px;color:${VIOLET};font-weight:700;margin-bottom:6px;">Experience</div>
        <div style="height:3px;width:36px;background:${AMBER};margin-bottom:16px;"></div>
        <div contenteditable="true" style="margin-bottom:18px;">
          <div style="display:flex;justify-content:space-between;"><strong style="font-size:14px;">Senior Product Designer — Northwind Co.</strong><span style="font-size:12px;color:#888;">2022 – Present</span></div>
          <ul style="margin:6px 0 0 18px;font-size:13px;line-height:1.6;color:#333;">
            <li>Led redesign of the core onboarding flow, lifting activation by 18%.</li>
            <li>Built and scaled the company's design system across 6 product teams.</li>
          </ul>
        </div>
        <div contenteditable="true" style="margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;"><strong style="font-size:14px;">Product Designer — Fieldstone</strong><span style="font-size:12px;color:#888;">2019 – 2022</span></div>
          <ul style="margin:6px 0 0 18px;font-size:13px;line-height:1.6;color:#333;">
            <li>Shipped the mobile redesign end-to-end, from research to launch.</li>
          </ul>
        </div>
        <div contenteditable="true" style="font-size:13px;text-transform:uppercase;letter-spacing:2px;color:${VIOLET};font-weight:700;margin-bottom:6px;">Selected Projects</div>
        <div style="height:3px;width:36px;background:${AMBER};margin-bottom:16px;"></div>
        <p contenteditable="true" style="font-size:13px;line-height:1.7;color:#333;">A short line about a project worth highlighting, with the outcome or metric that matters most.</p>
      </div>
    </div>`
  },

  invoice: {
    label: "Invoice",
    swatch: ["#0F766E","#F2FFFC","#FFB255"],
    html: `
    <div contenteditable="false" style="margin:-72px -72px 0 -72px;">
      <div style="background:#0F766E;padding:34px 56px;color:white;display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          ${photoSlotHTML({ w: 38, h: 38, radius: "9px", bg: AMBER, extraStyle: "margin-bottom:10px;", label: "Logo" })}
          <div contenteditable="true" style="font-size:22px;font-weight:700;">Studio Northwind</div>
          <div contenteditable="true" style="font-size:12px;color:#CFEFEA;margin-top:2px;">123 Market Street, Austin TX</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:26px;font-weight:800;letter-spacing:1px;">INVOICE</div>
          <div contenteditable="true" style="font-size:12px;color:#CFEFEA;margin-top:4px;">#INV-00123 &nbsp;·&nbsp; Due Jul 30, 2026</div>
        </div>
      </div>
      <div style="padding:32px 56px 56px 56px;">
        <div contenteditable="true" style="font-size:12px;color:#666;margin-bottom:20px;">Billed to: <strong style="color:#111;">Acme Corporation</strong>, hello@acme.com</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#ECFBF8;">
            <th style="padding:10px;text-align:left;font-size:12px;color:#0F766E;border-bottom:2px solid #0F766E;">Item</th>
            <th style="padding:10px;text-align:right;font-size:12px;color:#0F766E;border-bottom:2px solid #0F766E;">Qty</th>
            <th style="padding:10px;text-align:right;font-size:12px;color:#0F766E;border-bottom:2px solid #0F766E;">Price</th>
            <th style="padding:10px;text-align:right;font-size:12px;color:#0F766E;border-bottom:2px solid #0F766E;">Total</th>
          </tr>
          <tr contenteditable="true"><td style="padding:10px;font-size:13px;border-bottom:1px solid #eee;">Brand design sprint</td><td style="padding:10px;text-align:right;font-size:13px;border-bottom:1px solid #eee;">1</td><td style="padding:10px;text-align:right;font-size:13px;border-bottom:1px solid #eee;">$3,200</td><td style="padding:10px;text-align:right;font-size:13px;border-bottom:1px solid #eee;">$3,200</td></tr>
          <tr contenteditable="true"><td style="padding:10px;font-size:13px;border-bottom:1px solid #eee;">Design system handoff</td><td style="padding:10px;text-align:right;font-size:13px;border-bottom:1px solid #eee;">10</td><td style="padding:10px;text-align:right;font-size:13px;border-bottom:1px solid #eee;">$120</td><td style="padding:10px;text-align:right;font-size:13px;border-bottom:1px solid #eee;">$1,200</td></tr>
        </table>
        <div style="display:flex;justify-content:flex-end;margin-top:18px;">
          <div style="width:220px;">
            <div style="display:flex;justify-content:space-between;font-size:13px;color:#666;padding:4px 0;"><span>Subtotal</span><span>$4,400</span></div>
            <div style="display:flex;justify-content:space-between;font-size:13px;color:#666;padding:4px 0;"><span>Tax</span><span>$0</span></div>
            <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;background:#0F766E;color:white;padding:8px 10px;border-radius:6px;margin-top:6px;"><span>Total</span><span>$4,400</span></div>
          </div>
        </div>
      </div>
    </div>`
  },

  letter: {
    label: "Letter",
    swatch: ["#F6EFE4","#B45309","#3F3A34"],
    html: `
    <div contenteditable="false" style="margin:-72px -72px 24px -72px;padding:40px 56px;background:#F6EFE4;border-bottom:4px solid #B45309;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div contenteditable="true" style="font-size:20px;font-weight:700;color:#3F3A34;letter-spacing:0.5px;">Jordan Avery</div>
        <div contenteditable="true" style="font-size:11px;color:#8A7B63;text-align:right;">123 Willow Ave, Austin TX<br>jordan@email.com &nbsp;·&nbsp; (555) 010-2837</div>
      </div>
    </div>
    <p contenteditable="true" style="color:#666;font-size:13px;">July 15, 2026</p>
    <p contenteditable="true" style="margin-top:18px;">Dear [Recipient],</p>
    <p contenteditable="true">I'm writing to share a few thoughts on [subject]. Use this space to introduce the purpose of your letter clearly and warmly.</p>
    <p contenteditable="true">Add a second paragraph with detail or a specific ask, and close with next steps.</p>
    <p contenteditable="true" style="margin-top:24px;">Warm regards,<br><strong>Jordan Avery</strong></p>`
  },

  meeting: {
    label: "Meeting Notes",
    swatch: ["#1D4ED8","#EFF4FF","#FFB255"],
    html: `
    <div contenteditable="false" style="margin:-72px -72px 20px -72px;padding:30px 56px;background:#1D4ED8;color:white;">
      <div contenteditable="true" style="font-size:24px;font-weight:800;">Weekly Sync</div>
      <div contenteditable="true" style="font-size:12px;color:#CBDAFF;margin-top:6px;">Jul 15, 2026 &nbsp;·&nbsp; 10:00–10:30 AM &nbsp;·&nbsp; Attendees: Sam, Priya, Alex</div>
    </div>
    <div contenteditable="true" style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#1D4ED8;font-weight:700;margin-bottom:8px;">Agenda</div>
    <ol contenteditable="true" style="margin:0 0 20px 20px;font-size:13px;line-height:1.8;">
      <li>Review last week's action items</li>
      <li>Launch readiness for v2.4</li>
      <li>Open discussion</li>
    </ol>
    <div contenteditable="true" style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#1D4ED8;font-weight:700;margin-bottom:8px;">Notes</div>
    <p contenteditable="true" style="font-size:13px;line-height:1.7;color:#333;">Capture the key discussion points here as the meeting happens.</p>
    <div contenteditable="true" style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#1D4ED8;font-weight:700;margin:18px 0 8px;">Action Items</div>
    <div contenteditable="true" style="font-size:13px;line-height:2;">
      ☐ &nbsp;<strong>Sam</strong> — draft the release notes<br>
      ☐ &nbsp;<strong>Priya</strong> — confirm QA sign-off<br>
      ☐ &nbsp;<strong>Alex</strong> — schedule the demo
    </div>`
  },

  report: {
    label: "Report",
    swatch: ["#111827","#8B5EFF","#F4F2FA"],
    html: `
    <div contenteditable="false" style="margin:-72px -72px 28px -72px;padding:64px 56px 40px;background:${INK};color:white;min-height:200px;position:relative;overflow:hidden;">
      <div style="position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:${VIOLET};opacity:0.35;"></div>
      <div style="position:absolute;right:60px;bottom:-60px;width:120px;height:120px;border-radius:50%;background:${AMBER};opacity:0.25;"></div>
      <div contenteditable="true" style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${AMBER};position:relative;">Quarterly Report</div>
      <div contenteditable="true" style="font-size:32px;font-weight:800;margin-top:8px;position:relative;">Growth &amp; Product Review</div>
      <div contenteditable="true" style="font-size:12px;color:#C9C2E0;margin-top:10px;position:relative;">Prepared by Jordan Avery &nbsp;·&nbsp; July 2026</div>
    </div>
    <div contenteditable="true" style="font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:${VIOLET};font-weight:700;margin-bottom:6px;">Summary</div>
    <p contenteditable="true" style="font-size:13px;line-height:1.7;color:#333;margin-bottom:18px;">A concise overview of the quarter's outcomes, written for someone skimming.</p>
    <div contenteditable="true" style="font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:${VIOLET};font-weight:700;margin-bottom:6px;">Findings</div>
    <ul contenteditable="true" style="margin:0 0 18px 20px;font-size:13px;line-height:1.7;color:#333;"><li>Key finding one, stated plainly.</li><li>Key finding two, with a number attached.</li></ul>
    <div contenteditable="true" style="font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:${VIOLET};font-weight:700;margin-bottom:6px;">Recommendations</div>
    <ul contenteditable="true" style="margin:0 0 0 20px;font-size:13px;line-height:1.7;color:#333;"><li>What to do next, and who owns it.</li></ul>`
  },

  certificate: {
    label: "Certificate",
    swatch: ["#FFFDF7","#B08900","#2B2110"],
    html: `
    <div contenteditable="false" style="margin:-72px -72px 0 -72px;padding:26px;height:${PAGE_H - 20}px;box-sizing:border-box;background:#FFFDF7;border:14px solid #B08900;position:relative;">
      <div style="position:absolute;inset:24px;border:1px solid #D8C27A;"></div>
      <div style="text-align:center;padding-top:70px;">
        <div contenteditable="true" style="font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#B08900;">Certificate of Achievement</div>
        <div contenteditable="true" style="font-size:34px;font-family:Georgia,serif;color:#2B2110;margin-top:18px;">This certificate is proudly presented to</div>
        <div contenteditable="true" style="font-size:30px;font-weight:700;font-family:Georgia,serif;color:#B08900;margin-top:16px;border-bottom:1px solid #D8C27A;display:inline-block;padding:0 40px 8px;">Full Name Here</div>
        <p contenteditable="true" style="font-size:13px;color:#665;max-width:420px;margin:24px auto 0;line-height:1.6;">for outstanding dedication and excellence, awarded on July 15, 2026.</p>
        <div style="display:flex;justify-content:center;gap:80px;margin-top:56px;">
          <div style="text-align:center;"><div style="width:140px;border-top:1px solid #333;margin-bottom:6px;"></div><div style="font-size:11px;color:#665;">Signature</div></div>
          <div style="text-align:center;"><div style="width:140px;border-top:1px solid #333;margin-bottom:6px;"></div><div style="font-size:11px;color:#665;">Date</div></div>
        </div>
      </div>
    </div>`
  },

  newsletter: {
    label: "Newsletter",
    swatch: ["#DB2777","#FFF0F7","#111827"],
    html: `
    <div contenteditable="false" style="margin:-72px -72px 20px -72px;padding:28px 56px;background:#DB2777;color:white;">
      <div contenteditable="true" style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#FBCFE8;">The Monthly Edit — Issue 04</div>
      <div contenteditable="true" style="font-size:28px;font-weight:800;margin-top:6px;">What's New This Month</div>
    </div>
    <div style="display:flex;gap:24px;">
      <div style="flex:1;">
        <div contenteditable="true" style="font-size:13px;font-weight:700;color:#DB2777;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Feature Story</div>
        ${photoSlotHTML({ w: 220, h: 110, radius: "8px", bg: "#FFF0F7", display: "block", extraStyle: "width:100%;margin-bottom:10px;", label: "Add feature photo" })}
        <p contenteditable="true" style="font-size:12.5px;line-height:1.6;color:#333;">A short teaser paragraph about the lead story, written to pull the reader in.</p>
      </div>
      <div style="flex:1;">
        <div contenteditable="true" style="font-size:13px;font-weight:700;color:#DB2777;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Quick Updates</div>
        <ul contenteditable="true" style="margin:0 0 0 18px;font-size:12.5px;line-height:1.9;color:#333;">
          <li>Update one, one line.</li>
          <li>Update two, one line.</li>
          <li>Update three, one line.</li>
        </ul>
      </div>
    </div>
    <div style="height:1px;background:#eee;margin:20px 0;"></div>
    <p contenteditable="true" style="font-size:11px;color:#999;text-align:center;">You're receiving this because you subscribed. Unsubscribe anytime.</p>`
  }
};

let uid = 1;
const nextId = () => `pg-${uid++}`;

// ---------- helpers for resizable/draggable inline objects ----------
const DRAG_HANDLE = `<span class="drag-handle" title="Drag to move" style="position:absolute;left:-6px;top:-6px;width:16px;height:16px;background:#3F3560;border:2px solid white;border-radius:4px;cursor:move;box-shadow:0 1px 3px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;line-height:1;font-size:9px;color:#D9D2EE;">⠿</span>`;
const RESIZE_HANDLE = `<span class="resize-handle" title="Drag to resize" style="position:absolute;right:-6px;bottom:-6px;width:14px;height:14px;background:${VIOLET};border:2px solid white;border-radius:4px;cursor:nwse-resize;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></span>`;

function imageWrapHTML(dataUrl, w, h) {
  return `<span class="ins-wrap" data-kind="image" contenteditable="false" style="display:inline-block;position:relative;left:0px;top:0px;width:${w}px;height:${h}px;max-width:100%;vertical-align:middle;margin:4px;">
    <img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:0px;pointer-events:none;" />
    ${DRAG_HANDLE}
    ${RESIZE_HANDLE}
  </span>`;
}
function shapeWrapHTML(type) {
  let inner = "", w = 140, h = 90;
  if (type === "rect") inner = `<rect x="1" y="1" width="98%" height="98%" fill="#EEF2FF" stroke="${VIOLET}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
  if (type === "circle") { w = 100; h = 100; inner = `<circle cx="50%" cy="50%" r="47%" fill="#EEF2FF" stroke="${VIOLET}" stroke-width="2" vector-effect="non-scaling-stroke"/>`; }
  if (type === "arrow") { w = 150; h = 50; inner = `<line x1="4" y1="50%" x2="85%" y2="50%" stroke="${VIOLET}" stroke-width="3"/><polygon points="85,10 100,25 85,40" fill="${VIOLET}"/>`; }
  return `<span class="ins-wrap" data-kind="shape" contenteditable="false" style="display:inline-block;position:relative;left:0px;top:0px;width:${w}px;height:${h}px;vertical-align:middle;margin:4px;">
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="display:block;pointer-events:none;">${inner}</svg>
    ${DRAG_HANDLE}
    ${RESIZE_HANDLE}
  </span>`;
}
function tableWrapHTML(rows, cols) {
  let inner = `<table style="width:100%;height:100%;border-collapse:collapse;" border="1">`;
  for (let r = 0; r < rows; r++) {
    inner += "<tr>";
    for (let c = 0; c < cols; c++) {
      inner += `<td style="padding:8px;border:1px solid #ccc;min-width:24px;${r === 0 ? `background:${VIOLET}22;` : ""}" contenteditable="true">&nbsp;</td>`;
    }
    inner += "</tr>";
  }
  inner += "</table>";
  return `<div class="ins-wrap" data-kind="table" contenteditable="false" style="display:inline-block;position:relative;left:0px;top:0px;width:100%;max-width:520px;margin:8px 0;vertical-align:middle;">
    ${inner}
    ${DRAG_HANDLE}
    ${RESIZE_HANDLE}
  </div>`;
}

// A clickable "upload here" slot used inside templates (avatar, logo, feature photo, etc).
// Renders as a placeholder until the user clicks it and picks a file, at which point it turns
// into a normal resizable/restylable ins-wrap image (same mechanism as manually inserted images).
function photoSlotHTML({ w, h, radius = "0px", bg = PANEL_2, display = "inline-block", extraStyle = "", label = "Upload" }) {
  return `<span class="ins-wrap ph-slot" data-kind="image" data-placeholder="true" data-radius="${radius}" contenteditable="false" style="display:${display};position:relative;left:0px;top:0px;width:${w}px;height:${h}px;max-width:100%;border-radius:${radius};overflow:hidden;background:${bg};vertical-align:middle;cursor:pointer;${extraStyle}">
    <span class="ph-slot-label" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#EDE8FB;font-family:Arial,sans-serif;font-size:11px;pointer-events:none;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="M21 15l-5-5L5 19"/></svg>
      <span>${label}</span>
    </span>
  </span>`;
}

export default function DocEditor() {
  const [pages, setPages] = useState([nextId()]);
  const [activePage, setActivePage] = useState(pages[0]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [fileName, setFileName] = useState("Untitled document");
  const [savedAt, setSavedAt] = useState(null);
  const [sections, setSections] = useState({ templates: true, uploads: false, tables: false, shapes: false, pages: true });
  const [selectedEl, setSelectedEl] = useState(null);
  const [selectedKind, setSelectedKind] = useState(null);
  const [, forceTick] = useState(0);
  const [uploads, setUploads] = useState([]);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const pageRefs = useRef({});
  const fileInputRef = useRef(null);
  const insertImgInputRef = useRef(null);
  const resizeState = useRef(null);
  const dragState = useRef(null);
  const wrapFileInputRef = useRef(null);
  const wrapFileTargetRef = useRef(null);

  // ---------- Business Template Library (Invoice / DC / PO / Estimate) ----------
  const [bizTemplateId, setBizTemplateId] = useState(null);
  const [bizValues, setBizValues] = useState({});
  const [bizItems, setBizItems] = useState([]);
  const [bizImages, setBizImages] = useState({});
  const [editTemplateMode, setEditTemplateMode] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState({ invoice: true, dc: false, po: false, estimate: false, custom: false });

  const bizTemplate = bizTemplateId ? findTemplate(bizTemplateId, customTemplates) : null;
  const bizSchema = bizTemplate ? buildFormSchema(bizTemplate) : { groups: [], calculated: [] };
  const bizTotals = bizTemplate
    ? computeTotals(bizItems, bizValues.Discount, bizValues.TaxRate, bizTemplate.showGstBreakdown)
    : { subtotal: 0, tax: 0, cgst: 0, sgst: 0, grandTotal: 0 };

  const toggleCategory = (cat) => setCategoriesOpen((s) => ({ ...s, [cat]: !s[cat] }));

  const selectBusinessTemplate = (id) => {
    const tpl = findTemplate(id, customTemplates);
    if (!tpl) return;
    setBizTemplateId(id);
    setBizValues(defaultValuesFor(tpl));
    setBizItems([emptyItemRow(tpl.showGstBreakdown)]);
    setBizImages({});
    setEditTemplateMode(false);
    clearSelection();
    setShowTemplates(false);
  };

  const closeBusinessTemplate = () => {
    setBizTemplateId(null);
    setEditTemplateMode(false);
    const el = pageRefs.current[activePage];
    if (el) el.innerHTML = TEMPLATES.blank.html;
  };

  const updateBizValue = (key, value) => setBizValues((v) => ({ ...v, [key]: value }));

  const uploadBizImage = (key, file) => {
    const reader = new FileReader();
    reader.onload = (e) => setBizImages((im) => ({ ...im, [key]: e.target.result }));
    reader.readAsDataURL(file);
  };

  const addBizItem = () => setBizItems((items) => [...items, emptyItemRow(bizTemplate?.showGstBreakdown)]);
  const deleteBizItem = (id) => setBizItems((items) => (items.length > 1 ? items.filter((it) => it.id !== id) : items));
  const duplicateBizItem = (id) =>
    setBizItems((items) => {
      const idx = items.findIndex((it) => it.id === id);
      if (idx === -1) return items;
      const copy = { ...items[idx], id: `row-${Math.random().toString(36).slice(2, 9)}` };
      return [...items.slice(0, idx + 1), copy, ...items.slice(idx + 1)];
    });
  const moveBizItem = (id, dir) =>
    setBizItems((items) => {
      const idx = items.findIndex((it) => it.id === id);
      const newIdx = idx + dir;
      if (idx === -1 || newIdx < 0 || newIdx >= items.length) return items;
      const next = [...items];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  const changeBizItem = (id, field, value) =>
    setBizItems((items) => items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const toggleEditTemplateMode = () => {
    const el = pageRefs.current[activePage];
    if (!editTemplateMode) {
      // Unlock: current filled HTML becomes freely editable via the normal toolbar.
      if (el && bizTemplate) {
        const filled = renderTemplateHtml(bizTemplate, bizValues, bizItems, bizImages);
        el.innerHTML = filled.replace('contenteditable="false"', 'contenteditable="true"');
      }
      setEditTemplateMode(true);
    } else {
      // Lock again: discard manual edits and re-render from the live form state.
      setEditTemplateMode(false);
    }
  };

  const saveCustomTemplate = () => {
    const el = pageRefs.current[activePage];
    if (!el || !bizTemplate) return;
    let html = el.innerHTML;
    if (!/contenteditable="false"/.test(html)) {
      html = html.replace('contenteditable="true"', 'contenteditable="false"');
    }
    const newTpl = {
      ...bizTemplate,
      id: `custom-${Date.now()}`,
      name: `${bizTemplate.name} (Custom)`,
      html,
    };
    setCustomTemplates((list) => [...list, newTpl]);
    setCategoriesOpen((s) => ({ ...s, custom: true }));
    setEditTemplateMode(false);
  };

  const saveBizJson = () => {
    if (!bizTemplate) return;
    const data = { templateId: bizTemplateId, values: bizValues, items: bizItems, images: bizImages, savedAt: new Date().toISOString() };
    downloadBlob(JSON.stringify(data, null, 2), "application/json", "json");
  };

  const loadBizJson = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const tpl = findTemplate(data.templateId, customTemplates);
        if (!tpl) return;
        setBizTemplateId(data.templateId);
        setBizValues(data.values || {});
        setBizItems(data.items && data.items.length ? data.items : [emptyItemRow(tpl.showGstBreakdown)]);
        setBizImages(data.images || {});
        setEditTemplateMode(false);
      } catch (err) {
        // ignore invalid file
      }
    };
    reader.readAsText(file);
  };

  // Re-render the locked template into the page whenever form state changes.
  useEffect(() => {
    if (!bizTemplateId || editTemplateMode) return;
    const el = pageRefs.current[activePage];
    if (!el || !bizTemplate) return;
    el.innerHTML = renderTemplateHtml(bizTemplate, bizValues, bizItems, bizImages);
  }, [bizTemplateId, bizValues, bizItems, bizImages, editTemplateMode, activePage, bizTemplate]);

  useEffect(() => {
    const t = setInterval(() => setSavedAt(new Date()), 8000);
    return () => clearInterval(t);
  }, []);

  // global resize/drag handling for images, shapes, and tables
  useEffect(() => {
    const onMove = (e) => {
      const rs = resizeState.current;
      if (rs) {
        const dx = e.clientX - rs.startX;
        const dy = e.clientY - rs.startY;
        const newW = Math.max(24, rs.startW + dx);
        const newH = Math.max(24, rs.startH + dy);
        rs.wrapper.style.width = newW + "px";
        if (rs.wrapper.dataset.kind !== "table") rs.wrapper.style.height = newH + "px";
        return;
      }
      const ds = dragState.current;
      if (ds) {
        const dx = e.clientX - ds.startX;
        const dy = e.clientY - ds.startY;
        ds.wrapper.style.left = ds.startLeft + dx + "px";
        ds.wrapper.style.top = ds.startTop + dy + "px";
      }
    };
    const onUp = () => { resizeState.current = null; dragState.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const clearSelection = () => {
    if (selectedEl) selectedEl.style.outline = "none";
    setSelectedEl(null);
    setSelectedKind(null);
  };

  const selectWrapper = (wrapper) => {
    if (selectedEl && selectedEl !== wrapper) selectedEl.style.outline = "none";
    wrapper.style.outline = `2px solid ${VIOLET}`;
    wrapper.style.outlineOffset = "2px";
    setSelectedEl(wrapper);
    setSelectedKind(wrapper.dataset.kind);
  };

  const focusPage = (id) => { setActivePage(id); pageRefs.current[id]?.focus(); };

  // Templates nest their own contenteditable="true" regions (e.g. the Skills or Contact block)
  // inside a contenteditable="false" wrapper. Each of those is its own editing host, so blindly
  // focusing the outer page container would knock the caret out of wherever the user actually
  // clicked. Only fall back to focusing the page root when nothing inside it is already focused.
  const ensurePageFocus = (el) => {
    if (!el) return;
    const active = document.activeElement;
    if (active && active.isContentEditable && el.contains(active)) return;
    el.focus();
  };

  const exec = (cmd, value = null) => {
    const el = pageRefs.current[activePage];
    ensurePageFocus(el);
    document.execCommand(cmd, false, value);
  };

  const applyTemplate = (key) => {
    const tpl = TEMPLATES[key];
    const el = pageRefs.current[activePage];
    if (el) el.innerHTML = tpl.html;
    setShowTemplates(false);
  };

  const addPage = () => {
    const id = nextId();
    setPages((p) => [...p, id]);
    setTimeout(() => focusPage(id), 50);
  };

  const deletePage = (id) => {
    if (pages.length === 1) return;
    setPages((p) => p.filter((x) => x !== id));
    delete pageRefs.current[id];
  };

  const handleImageFile = (file, insertInline) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setUploads((u) => [...u, { id: nextId(), src: dataUrl, name: file.name }]);
      if (insertInline) insertImageToPage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const insertImageToPage = (dataUrl) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 260;
      const w = Math.min(maxW, img.naturalWidth || maxW);
      const h = w * ((img.naturalHeight || w) / (img.naturalWidth || w));
      const el = pageRefs.current[activePage];
      ensurePageFocus(el);
      document.execCommand("insertHTML", false, imageWrapHTML(dataUrl, Math.round(w), Math.round(h)));
    };
    img.src = dataUrl;
  };

  const insertTable = (rows, cols) => {
    const el = pageRefs.current[activePage];
    ensurePageFocus(el);
    document.execCommand("insertHTML", false, tableWrapHTML(rows, cols) + "<p><br></p>");
    setShowTableMenu(false);
  };

  const insertShape = (type) => {
    const el = pageRefs.current[activePage];
    ensurePageFocus(el);
    document.execCommand("insertHTML", false, shapeWrapHTML(type) + "&nbsp;");
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  };

  const insertDateTime = () => {
    const el = pageRefs.current[activePage];
    ensurePageFocus(el);
    document.execCommand("insertText", false, new Date().toLocaleString());
  };

  const onPageMouseDown = (e) => {
    if (e.target.classList.contains("resize-handle")) {
      e.preventDefault();
      const wrapper = e.target.parentElement;
      resizeState.current = { wrapper, startX: e.clientX, startY: e.clientY, startW: wrapper.offsetWidth, startH: wrapper.offsetHeight };
      selectWrapper(wrapper);
      return;
    }
    if (e.target.classList.contains("drag-handle")) {
      e.preventDefault();
      const wrapper = e.target.parentElement;
      const startLeft = parseFloat(wrapper.style.left) || 0;
      const startTop = parseFloat(wrapper.style.top) || 0;
      dragState.current = { wrapper, startX: e.clientX, startY: e.clientY, startLeft, startTop };
      selectWrapper(wrapper);
    }
  };

  const onPageClick = (e) => {
    const wrap = e.target.closest(".ins-wrap");
    if (wrap) {
      if (wrap.dataset.placeholder === "true") {
        wrapFileTargetRef.current = wrap;
        wrapFileInputRef.current?.click();
        return;
      }
      selectWrapper(wrap);
    } else {
      clearSelection();
    }
  };

  // Fills a placeholder photo-slot with the chosen file (turning it into a normal resizable
  // image), or swaps the picture on an already-placed image if one is currently selected.
  const handleWrapImageFile = (file) => {
    const wrap = wrapFileTargetRef.current;
    if (!wrap || !file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setUploads((u) => [...u, { id: nextId(), src: dataUrl, name: file.name }]);
      const existingImg = wrap.querySelector("img");
      if (existingImg) {
        existingImg.src = dataUrl;
      } else {
        const radius = wrap.dataset.radius || "0px";
        wrap.style.borderRadius = "0px";
        wrap.style.overflow = "visible";
        wrap.style.background = "transparent";
        wrap.style.cursor = "default";
        wrap.dataset.placeholder = "false";
        wrap.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:${radius};pointer-events:none;" />${DRAG_HANDLE}${RESIZE_HANDLE}`;
      }
      selectWrapper(wrap);
      wrapFileTargetRef.current = null;
    };
    reader.readAsDataURL(file);
  };

  const replaceSelectedImage = () => {
    if (!selectedEl) return;
    wrapFileTargetRef.current = selectedEl;
    wrapFileInputRef.current?.click();
  };

  const updateSelectedStyle = (prop, value) => {
    if (!selectedEl) return;
    if (selectedKind === "image") {
      const img = selectedEl.querySelector("img");
      if (["borderRadius", "border", "boxShadow", "opacity"].includes(prop)) img.style[prop] = value;
      else selectedEl.style[prop] = value;
    } else {
      selectedEl.style[prop] = value;
    }
    forceTick((n) => n + 1);
  };

  const updateShapeColor = (which, color) => {
    if (!selectedEl) return;
    const shape = selectedEl.querySelector("rect,circle,line,polygon");
    if (!shape) return;
    if (which === "fill") shape.setAttribute("fill", color);
    if (which === "stroke") shape.setAttribute("stroke", color);
    forceTick((n) => n + 1);
  };

  const deleteSelected = () => {
    if (selectedEl) selectedEl.remove();
    clearSelection();
  };

  const downloadBlob = (content, type, ext) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAllHtml = () => pages.map((id) => pageRefs.current[id]?.innerHTML || "").join('<div style="page-break-after:always;"></div>');
  const exportHtml = () => downloadBlob(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${fileName}</title></head><body>${getAllHtml()}</body></html>`, "text/html", "html");
  const exportTxt = () => downloadBlob(pages.map((id) => pageRefs.current[id]?.innerText || "").join("\n\n--- page break ---\n\n"), "text/plain", "txt");
  const exportWord = () => downloadBlob(`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset="utf-8"><title>${fileName}</title></head><body>${getAllHtml()}</body></html>`, "application/msword", "doc");
  const doPrint = () => window.print();
  const toggleSection = (k) => setSections((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="w-full h-full flex flex-col" style={{ fontFamily: "Arial, sans-serif", minHeight: "700px", background: INK }}>
      <style>{`
        [contenteditable]:focus { outline: none; }
        .page-editable h1 { font-size: 28px; font-weight: 700; margin: 14px 0 8px; }
        .page-editable h2 { font-size: 22px; font-weight: 700; margin: 12px 0 6px; }
        .page-editable h3 { font-size: 18px; font-weight: 700; margin: 10px 0 6px; }
        .page-editable p { margin: 6px 0; line-height: 1.55; }
        .page-editable blockquote { border-left: 3px solid ${VIOLET}; margin: 8px 0; padding: 4px 12px; color: #555; font-style: italic; }
        .page-editable pre { background: ${INK}; color: #E5E7EB; padding: 10px; border-radius: 6px; font-family: 'Courier New', monospace; overflow-x: auto; }
        .page-editable ul, .page-editable ol { margin: 6px 0 6px 22px; }
        .page-editable a { color: ${VIOLET}; text-decoration: underline; }
        input[type=range]::-webkit-slider-thumb { accent-color: ${VIOLET}; }
        input[type=range] { accent-color: ${VIOLET}; }
        ::selection { background: ${VIOLET}55; }
        .ph-slot:hover { opacity: 0.85; }
        .drag-handle:hover { background: ${VIOLET} !important; }
        @media print {
          .no-print { display: none !important; }
          .print-page { box-shadow: none !important; margin: 0 !important; page-break-after: always; }
          body { background: white !important; }
        }
      `}</style>

      {/* Header */}
      <div className="no-print flex items-center gap-3 px-4 py-2.5 shrink-0" style={{ background: PANEL, borderBottom: "1px solid #382E52" }}>
        <div className="flex items-center gap-2 font-semibold" style={{ color: VIOLET }}>
          <Sparkles size={18} />
          <span className="text-sm tracking-wide" style={{ color: "#EDE8FB" }}>Pagecraft</span>
        </div>
        <div className="w-px h-5" style={{ background: "#3F3560" }} />
        <input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="text-sm font-medium bg-transparent outline-none border-b border-transparent focus:border-[#5C4E82] px-1 py-0.5 w-48"
          style={{ color: "#EDE8FB" }}
        />
        <span className="text-xs" style={{ color: "#8C81AD" }}>{savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "All changes saved"}</span>
        <div className="flex-1" />
        <HeaderIcon onClick={() => exec("undo")} title="Undo (Ctrl+Z)"><Undo2 size={16} /></HeaderIcon>
        <HeaderIcon onClick={() => exec("redo")} title="Redo (Ctrl+Y)"><Redo2 size={16} /></HeaderIcon>
        <button onClick={() => setShowTemplates(true)} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md" style={{ color: "#EDE8FB", border: "1px solid #4A3F6E" }}>
          <FolderOpen size={14} /> Templates
        </button>
        <div className="relative group">
          <button className="flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-md font-medium" style={{ background: VIOLET, color: "white" }}>
            <Download size={14} /> Export
          </button>
          <div className="hidden group-hover:block absolute right-0 top-full mt-1 rounded-md shadow-2xl z-30 w-52 py-1" style={{ background: PANEL_2, border: "1px solid #4A3F6E" }}>
            {[["Export as HTML", exportHtml], ["Export as TXT", exportTxt], ["Export as Word (.doc)", exportWord], ["Print / Save as PDF", doPrint]].map(([label, fn]) => (
              <button key={label} onClick={fn} className="w-full text-left px-3 py-1.5 text-sm hover:bg-[#382E52]" style={{ color: "#EDE8FB" }}>{label}</button>
            ))}
          </div>
        </div>
        <HeaderIcon onClick={doPrint} title="Print"><Printer size={16} /></HeaderIcon>
      </div>

      {/* Toolbar */}
      <div className="no-print flex flex-wrap items-center gap-1 px-3 py-1.5 shrink-0" style={{ background: PANEL_2, borderBottom: "1px solid #382E52" }}>
        <select onChange={(e) => exec("formatBlock", e.target.value)} defaultValue="" className="text-xs rounded px-1.5 py-1 mr-1" style={selStyle} title="Paragraph style">
          <option value="" disabled>Style</option>
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
          <option value="blockquote">Blockquote</option>
          <option value="pre">Code block</option>
        </select>
        <select onChange={(e) => exec("fontName", e.target.value)} defaultValue="Arial" className="text-xs rounded px-1.5 py-1 mr-1 w-32" style={selStyle} title="Font">
          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select onChange={(e) => exec("fontSize", e.target.value)} defaultValue="" className="text-xs rounded px-1.5 py-1 mr-2 w-16" style={selStyle} title="Font size">
          <option value="" disabled>Size</option>
          {SIZES.map((s, i) => <option key={s} value={i < 7 ? i + 1 : 7}>{s}</option>)}
        </select>

        <Divider />
        <Btn onClick={() => exec("bold")} title="Bold"><Bold size={15} /></Btn>
        <Btn onClick={() => exec("italic")} title="Italic"><Italic size={15} /></Btn>
        <Btn onClick={() => exec("underline")} title="Underline"><Underline size={15} /></Btn>
        <Btn onClick={() => exec("strikeThrough")} title="Strikethrough"><Strikethrough size={15} /></Btn>

        <Divider />
        <label className="p-1.5 rounded hover:bg-[#382E52] cursor-pointer flex items-center relative" style={{ color: "#D9D2EE" }} title="Text color">
          <Paintbrush size={15} />
          <input type="color" className="w-0 h-0 opacity-0 absolute" onChange={(e) => exec("foreColor", e.target.value)} />
        </label>
        <label className="p-1.5 rounded hover:bg-[#382E52] cursor-pointer flex items-center relative" style={{ color: "#D9D2EE" }} title="Highlight color">
          <Highlighter size={15} />
          <input type="color" className="w-0 h-0 opacity-0 absolute" onChange={(e) => exec("hiliteColor", e.target.value)} />
        </label>
        <Btn onClick={() => exec("removeFormat")} title="Clear formatting"><Eraser size={15} /></Btn>

        <Divider />
        <Btn onClick={() => exec("justifyLeft")} title="Align left"><AlignLeft size={15} /></Btn>
        <Btn onClick={() => exec("justifyCenter")} title="Align center"><AlignCenter size={15} /></Btn>
        <Btn onClick={() => exec("justifyRight")} title="Align right"><AlignRight size={15} /></Btn>
        <Btn onClick={() => exec("justifyFull")} title="Justify"><AlignJustify size={15} /></Btn>

        <Divider />
        <Btn onClick={() => exec("insertUnorderedList")} title="Bullet list"><List size={15} /></Btn>
        <Btn onClick={() => exec("insertOrderedList")} title="Numbered list"><ListOrdered size={15} /></Btn>
        <Btn onClick={() => document.execCommand("insertHTML", false, `<div>☐ &nbsp;</div>`)} title="Checklist"><CheckSquare size={15} /></Btn>
        <Btn onClick={() => exec("indent")} title="Indent">→</Btn>
        <Btn onClick={() => exec("outdent")} title="Outdent">←</Btn>

        <Divider />
        <Btn onClick={() => insertImgInputRef.current?.click()} title="Insert image"><ImageIcon size={15} /></Btn>
        <input ref={insertImgInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={(e) => e.target.files[0] && handleImageFile(e.target.files[0], true)} />
        <input ref={wrapFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { e.target.files[0] && handleWrapImageFile(e.target.files[0]); e.target.value = ""; }} />
        <div className="relative">
          <Btn onClick={() => setShowTableMenu((v) => !v)} title="Insert table"><TableIcon size={15} /></Btn>
          {showTableMenu && (
            <div className="absolute top-full left-0 mt-1 rounded-md shadow-2xl z-30 p-2" style={{ background: PANEL_2, border: "1px solid #4A3F6E", width: 200 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {[[2,2],[3,3],[4,3],[3,2],[5,4],[2,4]].map(([r,c]) => (
                  <button key={`${r}${c}`} onMouseDown={(e) => e.preventDefault()} onClick={() => insertTable(r,c)} className="text-xs rounded hover:bg-[#382E52]" style={{ color: "#EDE8FB", border: "1px solid #4A3F6E", padding: "4px 2px", whiteSpace: "nowrap" }}>{r}×{c}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Btn onClick={insertLink} title="Insert link"><Link2 size={15} /></Btn>
        <Btn onClick={() => exec("insertHorizontalRule")} title="Horizontal line"><Minus size={15} /></Btn>
        <Btn onClick={() => insertShape("rect")} title="Rectangle"><SquareIcon size={15} /></Btn>
        <Btn onClick={() => insertShape("circle")} title="Circle"><Circle size={15} /></Btn>
        <Btn onClick={() => insertShape("arrow")} title="Arrow"><ArrowRight size={15} /></Btn>

        <div className="relative">
          <Btn onClick={() => setShowInsertMenu((v) => !v)} title="More"><Plus size={15} /></Btn>
          {showInsertMenu && (
            <div className="absolute top-full left-0 mt-1 rounded-md shadow-2xl z-30 w-48 py-1" style={{ background: PANEL_2, border: "1px solid #4A3F6E" }}>
              <button onClick={() => { insertDateTime(); setShowInsertMenu(false); }} className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-[#382E52]" style={{ color: "#EDE8FB" }}><CalendarClock size={14}/> Date &amp; time</button>
              <button onClick={() => { addPage(); setShowInsertMenu(false); }} className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-[#382E52]" style={{ color: "#EDE8FB" }}><FilePlus2 size={14}/> Page break (new page)</button>
              <button onClick={() => { document.execCommand("insertHTML", false, `<span style="display:inline-block;width:120px;border-bottom:1px solid #999;height:14px;vertical-align:bottom;"></span>`); setShowInsertMenu(false); }} className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-[#382E52]" style={{ color: "#EDE8FB" }}><PenTool size={14}/> Signature line</button>
              <button onClick={() => setShowEmoji((v) => !v)} className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-sm hover:bg-[#382E52]" style={{ color: "#EDE8FB" }}><Smile size={14}/> Emoji</button>
              {showEmoji && (
                <div className="grid grid-cols-6 gap-1 px-2 py-1">
                  {EMOJIS.map((em) => <button key={em} className="text-lg hover:bg-[#382E52] rounded" onClick={() => document.execCommand("insertText", false, em)}>{em}</button>)}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1" />
        <Btn onClick={() => setZoom((z) => Math.max(25, z - 25))} title="Zoom out"><ZoomOut size={15} /></Btn>
        <select value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="text-xs rounded px-1 py-1" style={selStyle}>
          {[25,50,75,100,125,150,200].map((z) => <option key={z} value={z}>{z}%</option>)}
        </select>
        <Btn onClick={() => setZoom((z) => Math.min(200, z + 25))} title="Zoom in"><ZoomIn size={15} /></Btn>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <div className="no-print w-56 overflow-y-auto shrink-0" style={{ background: PANEL, borderRight: "1px solid #382E52" }}>
          <SidebarSection label="📄 Templates" open={sections.templates} onToggle={() => toggleSection("templates")}>
            <TemplateLibrarySection
              categoriesOpen={categoriesOpen}
              toggleCategory={toggleCategory}
              activeTemplateId={bizTemplateId}
              customTemplates={customTemplates}
              onSelectTemplate={selectBusinessTemplate}
              onStartBlank={closeBusinessTemplate}
            />
          </SidebarSection>

          <SidebarSection label="🖼 Uploads" open={sections.uploads} onToggle={() => toggleSection("uploads")}>
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-1 text-xs px-2 py-1.5 rounded mb-2" style={{ color: "#D9D2EE", border: "1px dashed #4A3F6E" }}>
              <Upload size={13} /> Upload image
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleImageFile(e.target.files[0], false)} />
            <div className="grid grid-cols-2 gap-1.5">
              {uploads.map((u) => (
                <img key={u.id} src={u.src} onMouseDown={(e) => e.preventDefault()} onClick={() => insertImageToPage(u.src)} className="w-full h-14 object-cover rounded cursor-pointer" style={{ border: "1px solid #4A3F6E" }} title="Click to insert" />
              ))}
              {uploads.length === 0 && <p className="text-[11px] col-span-2" style={{ color: "#75688F" }}>No uploads yet.</p>}
            </div>
          </SidebarSection>

          <SidebarSection label="📊 Tables" open={sections.tables} onToggle={() => toggleSection("tables")}>
            <div className="grid grid-cols-3 gap-1">
              {[[2,2],[3,3],[4,4]].map(([r,c]) => (
                <button key={`${r}${c}`} onMouseDown={(e) => e.preventDefault()} onClick={() => insertTable(r,c)} className="text-xs rounded px-1 py-1 hover:bg-[#382E52]" style={{ color: "#D9D2EE", border: "1px solid #4A3F6E" }}>{r}×{c}</button>
              ))}
            </div>
          </SidebarSection>

          <SidebarSection label="📐 Shapes" open={sections.shapes} onToggle={() => toggleSection("shapes")}>
            <div className="flex gap-2">
              <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertShape("rect")} className="p-2 rounded hover:bg-[#382E52]" style={{ border: "1px solid #4A3F6E", color: "#D9D2EE" }}><SquareIcon size={16}/></button>
              <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertShape("circle")} className="p-2 rounded hover:bg-[#382E52]" style={{ border: "1px solid #4A3F6E", color: "#D9D2EE" }}><Circle size={16}/></button>
              <button onMouseDown={(e) => e.preventDefault()} onClick={() => insertShape("arrow")} className="p-2 rounded hover:bg-[#382E52]" style={{ border: "1px solid #4A3F6E", color: "#D9D2EE" }}><ArrowRight size={16}/></button>
            </div>
            <p className="text-[10px] mt-2" style={{ color: "#75688F" }}>Drag the violet corner handle to resize.</p>
          </SidebarSection>

          <SidebarSection label="📑 Pages" open={sections.pages} onToggle={() => toggleSection("pages")}>
            {pages.map((id, i) => (
              <div key={id} onClick={() => focusPage(id)} className="flex items-center justify-between text-xs px-2 py-1.5 rounded cursor-pointer" style={{ background: activePage === id ? "#382E52" : "transparent", color: activePage === id ? VIOLET : "#D9D2EE" }}>
                <span>Page {i + 1}</span>
                {pages.length > 1 && <button onClick={(e) => { e.stopPropagation(); deletePage(id); }} style={{ color: "#75688F" }}><Trash2 size={12} /></button>}
              </div>
            ))}
            <button onClick={addPage} className="w-full flex items-center gap-1 text-xs px-2 py-1.5 mt-1 rounded" style={{ color: "#D9D2EE", border: "1px dashed #4A3F6E" }}>
              <Plus size={12} /> Add page
            </button>
          </SidebarSection>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto" style={{ background: CANVAS_BG }}>
          <div className="flex flex-col items-center py-10 gap-8" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            {pages.map((id, i) => (
              <div key={id} className="relative">
                <div className="print-page bg-white rounded-sm" style={{ width: PAGE_W, minHeight: PAGE_H, padding: "72px", boxShadow: "0 8px 30px rgba(30,20,60,0.28), 0 2px 8px rgba(30,20,60,0.15)" }}>
                  <div
                    ref={(el) => (pageRefs.current[id] = el)}
                    className="page-editable outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={() => setActivePage(id)}
                    onClick={onPageClick}
                    onMouseDown={onPageMouseDown}
                    onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault(); exec(e.shiftKey ? "outdent" : "indent"); } }}
                    style={{ minHeight: PAGE_H - 144, fontSize: 15, color: "#1F2430" }}
                    dangerouslySetInnerHTML={{ __html: i === 0 ? TEMPLATES.blank.html : "<p><br></p>" }}
                  />
                </div>
                <span className="no-print absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs" style={{ color: "#6B5E8A" }}>Page {i + 1} of {pages.length}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        {bizTemplateId ? (
          <DocumentFormPanel
            template={bizTemplate}
            schema={bizSchema}
            values={bizValues}
            onChangeValue={updateBizValue}
            images={bizImages}
            onUploadImage={uploadBizImage}
            items={bizItems}
            onAddItem={addBizItem}
            onDeleteItem={deleteBizItem}
            onDuplicateItem={duplicateBizItem}
            onMoveItem={moveBizItem}
            onChangeItem={changeBizItem}
            totals={bizTotals}
            showGstBreakdown={bizTemplate?.showGstBreakdown}
            editMode={editTemplateMode}
            onToggleEditMode={toggleEditTemplateMode}
            onSaveCustomTemplate={saveCustomTemplate}
            onSaveJson={saveBizJson}
            onLoadJson={loadBizJson}
            onClose={closeBusinessTemplate}
          />
        ) : selectedEl && (
          <div className="no-print w-60 p-3 overflow-y-auto shrink-0" style={{ background: PANEL, borderLeft: "1px solid #382E52" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: "#EDE8FB" }}>{selectedKind === "image" ? "Image" : selectedKind === "table" ? "Table" : "Shape"}</h3>
              <button onClick={clearSelection} style={{ color: "#D9D2EE" }}><X size={14} /></button>
            </div>

            <p className="text-[11px] mb-3" style={{ color: "#8C81AD" }}>Drag the violet handle to resize, or the grip (⠿) at the top-left to move it around the page.</p>

            {selectedKind === "image" && (
              <>
                <button onClick={replaceSelectedImage} className="w-full flex items-center justify-center gap-1 text-xs rounded py-1.5 mb-3" style={{ ...selStyle }}>
                  <Upload size={13} /> Replace photo
                </button>
                <PanelLabel>Shape</PanelLabel>
                <div className="flex gap-1 mb-3">
                  <button className="flex-1 text-xs rounded py-1" style={selStyle} onClick={() => updateSelectedStyle("borderRadius", "0px")}>Square</button>
                  <button className="flex-1 text-xs rounded py-1" style={selStyle} onClick={() => updateSelectedStyle("borderRadius", "16px")}>Rounded</button>
                  <button className="flex-1 text-xs rounded py-1" style={selStyle} onClick={() => updateSelectedStyle("borderRadius", "50%")}>Circle</button>
                </div>
                <PanelLabel>Opacity</PanelLabel>
                <input type="range" min="10" max="100" defaultValue="100" className="w-full mb-3" onChange={(e) => updateSelectedStyle("opacity", e.target.value / 100)} />
                <PanelLabel>Rounded corners (fine-tune)</PanelLabel>
                <input type="range" min="0" max="150" defaultValue="0" className="w-full mb-3" onChange={(e) => updateSelectedStyle("borderRadius", `${e.target.value}px`)} />
                <PanelLabel>Border</PanelLabel>
                <select className="w-full text-xs rounded px-1.5 py-1 mb-3" style={selStyle} onChange={(e) => updateSelectedStyle("border", e.target.value)}>
                  <option value="none">None</option>
                  <option value="1px solid #ccc">Thin gray</option>
                  <option value={`3px solid ${VIOLET}`}>Accent</option>
                </select>
                <PanelLabel>Shadow</PanelLabel>
                <select className="w-full text-xs rounded px-1.5 py-1 mb-3" style={selStyle} onChange={(e) => updateSelectedStyle("boxShadow", e.target.value)}>
                  <option value="none">None</option>
                  <option value="0 4px 14px rgba(0,0,0,0.3)">Soft shadow</option>
                </select>
              </>
            )}

            {selectedKind === "shape" && (
              <>
                <PanelLabel>Fill color</PanelLabel>
                <input type="color" defaultValue="#EEF2FF" className="w-full h-8 rounded mb-3 cursor-pointer" onChange={(e) => updateShapeColor("fill", e.target.value)} />
                <PanelLabel>Outline color</PanelLabel>
                <input type="color" defaultValue="#8B5EFF" className="w-full h-8 rounded mb-3 cursor-pointer" onChange={(e) => updateShapeColor("stroke", e.target.value)} />
              </>
            )}

            <PanelLabel>Alignment</PanelLabel>
            <div className="flex gap-1 mb-3">
              <button className="flex-1 text-xs rounded py-1" style={{ ...selStyle }} onClick={() => { updateSelectedStyle("display", "block"); updateSelectedStyle("marginLeft", "0"); updateSelectedStyle("marginRight", "auto"); }}>Left</button>
              <button className="flex-1 text-xs rounded py-1" style={{ ...selStyle }} onClick={() => { updateSelectedStyle("display", "block"); updateSelectedStyle("marginLeft", "auto"); updateSelectedStyle("marginRight", "auto"); }}>Center</button>
              <button className="flex-1 text-xs rounded py-1" style={{ ...selStyle }} onClick={() => { updateSelectedStyle("display", "block"); updateSelectedStyle("marginLeft", "auto"); updateSelectedStyle("marginRight", "0"); }}>Right</button>
            </div>

            <button onClick={deleteSelected} className="w-full flex items-center justify-center gap-1 text-xs rounded py-1.5" style={{ color: "#FF8A8A", border: "1px solid #6B3A3A" }}>
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Template gallery modal */}
      {showTemplates && (
        <div className="no-print fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(10,7,20,0.6)" }} onClick={() => setShowTemplates(false)}>
          <div className="rounded-xl w-[620px] max-h-[82vh] overflow-y-auto p-5" style={{ background: "#F7F5FC", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: INK }}>Choose a template</h2>
                <p className="text-xs" style={{ color: "#7A6E96" }}>Pick a starting design — everything stays fully editable.</p>
              </div>
              <button onClick={() => setShowTemplates(false)} style={{ color: "#7A6E96" }}><X size={18} /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(TEMPLATES).map(([k, t]) => (
                <button key={k} onClick={() => applyTemplate(k)} className="group rounded-lg overflow-hidden text-left" style={{ border: "1px solid #E0D9F0" }}>
                  <div className="h-24 flex" style={{ background: t.swatch[2] }}>
                    <div style={{ width: "34%", background: t.swatch[0] }} />
                    <div className="flex-1 flex items-center justify-center" style={{ background: t.swatch[1] }}>
                      <div style={{ width: 30, height: 4, background: t.swatch[0], opacity: 0.6, borderRadius: 2 }} />
                    </div>
                  </div>
                  <div className="px-2.5 py-2 text-xs font-medium group-hover:text-[#8B5EFF]" style={{ color: INK }}>{t.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const selStyle = { background: PANEL, color: "#EDE8FB", border: "1px solid #4A3F6E" };

function HeaderIcon({ onClick, title, children }) {
  return <button onClick={onClick} title={title} className="p-1.5 rounded hover:bg-[#382E52]" style={{ color: "#D9D2EE" }}>{children}</button>;
}
function Btn({ onClick, title, children }) {
  return (
    <button onMouseDown={(e) => e.preventDefault()} onClick={onClick} title={title} className="p-1.5 rounded hover:bg-[#382E52]" style={{ color: "#D9D2EE" }}>
      {children}
    </button>
  );
}
function Divider() {
  return <div className="w-px h-5 mx-1" style={{ background: "#4A3F6E" }} />;
}
function PanelLabel({ children }) {
  return <label className="block text-xs mb-1" style={{ color: "#8C81AD" }}>{children}</label>;
}
function SidebarSection({ label, open, onToggle, children }) {
  return (
    <div style={{ borderBottom: "1px solid #2E2646" }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-[#2A2340]" style={{ color: "#B9AFD6" }}>
        {label}
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </button>
      {open && <div className="px-2 pb-2">{children}</div>}
    </div>
  );
}
