// ---------------------------------------------------------------------------
// Data-driven engine for the business Template Library (Invoice / DC / PO /
// Estimate). Templates are stored as HTML strings containing {{Placeholder}}
// tokens. This module detects those tokens, maps them to form-field
// metadata, and re-renders the filled HTML whenever form values change.
// The template markup itself is never made contentEditable, so the user can
// only change what appears through the generated form.
// ---------------------------------------------------------------------------

export const ITEMS_TOKEN = "ITEMS_TABLE";

// Known placeholder -> form field metadata. Anything not listed here still
// works: the key is prettified into a label and rendered as a plain text
// input (see fieldMetaFor).
export const FIELD_META = {
  CompanyName: { label: "Company Name", type: "text", group: "Your Company" },
  CompanyAddress: { label: "Company Address", type: "textarea", group: "Your Company" },
  CompanyPhone: { label: "Company Phone", type: "text", group: "Your Company" },
  CompanyEmail: { label: "Company Email", type: "text", group: "Your Company" },
  CompanyGST: { label: "Company GST Number", type: "text", group: "Your Company" },
  CompanyLogo: { label: "Company Logo", type: "image", group: "Your Company" },

  InvoiceNumber: { label: "Invoice Number", type: "text", group: "Document", default: "INV-1001" },
  InvoiceDate: { label: "Invoice Date", type: "date", group: "Document" },
  DueDate: { label: "Due Date", type: "date", group: "Document" },
  DCNumber: { label: "DC Number", type: "text", group: "Document", default: "DC-1001" },
  DCDate: { label: "DC Date", type: "date", group: "Document" },
  DeliveryDate: { label: "Delivery Date", type: "date", group: "Document" },
  PONumber: { label: "PO Number", type: "text", group: "Document", default: "PO-1001" },
  PODate: { label: "PO Date", type: "date", group: "Document" },
  DeliveryExpected: { label: "Delivery Expected By", type: "date", group: "Document" },
  EstimateNumber: { label: "Estimate Number", type: "text", group: "Document", default: "EST-1001" },
  EstimateDate: { label: "Estimate Date", type: "date", group: "Document" },
  ValidUntil: { label: "Valid Until", type: "date", group: "Document" },

  CustomerName: { label: "Customer Name", type: "text", group: "Party" },
  CustomerAddress: { label: "Customer Address", type: "textarea", group: "Party" },
  CustomerPhone: { label: "Customer Phone", type: "text", group: "Party" },
  CustomerEmail: { label: "Customer Email", type: "text", group: "Party" },
  CustomerGST: { label: "Customer GST Number", type: "text", group: "Party" },

  Subtotal: { label: "Subtotal", type: "calculated", group: "Totals" },
  Discount: { label: "Discount", type: "number", group: "Totals", default: "0" },
  TaxRate: { label: "Tax / GST %", type: "number", group: "Totals", default: "18" },
  Tax: { label: "Tax Amount", type: "calculated", group: "Totals" },
  CGST: { label: "CGST", type: "calculated", group: "Totals" },
  SGST: { label: "SGST", type: "calculated", group: "Totals" },
  GrandTotal: { label: "Grand Total", type: "calculated", group: "Totals" },

  Notes: { label: "Notes / Terms", type: "textarea", group: "Other" },
  AuthorizedSignature: { label: "Authorized Signature", type: "image", group: "Other" },
  Stamp: { label: "Company Stamp", type: "image", group: "Other" },
};

const IMAGE_KEYS = new Set(["CompanyLogo", "AuthorizedSignature", "Stamp"]);
const CALCULATED_KEYS = new Set(["Subtotal", "Tax", "CGST", "SGST", "GrandTotal"]);
const GROUP_ORDER = ["Your Company", "Document", "Party", "Totals", "Other"];

function prettify(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
}

export function fieldMetaFor(key, template) {
  const base = FIELD_META[key] || { label: prettify(key), type: "text", group: "Other" };
  const override = template?.fieldLabelOverrides?.[key];
  return override ? { ...base, label: override } : base;
}

export function isImageField(key) {
  return IMAGE_KEYS.has(key);
}
export function isCalculatedField(key) {
  return CALCULATED_KEYS.has(key);
}

// Detects every unique {{Token}} in a template's HTML, in document order.
export function extractPlaceholders(html) {
  const re = /\{\{(\w+)\}\}/g;
  const seen = new Set();
  const out = [];
  let m;
  while ((m = re.exec(html || ""))) {
    if (m[1] === ITEMS_TOKEN) continue;
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      out.push(m[1]);
    }
  }
  return out;
}

// Groups a template's placeholder keys by their FIELD_META group, in a
// stable, human-friendly order. Calculated fields are returned separately
// since they're displayed read-only rather than as inputs.
export function buildFormSchema(template) {
  const keys = extractPlaceholders(template.html);
  const groups = {};
  const calculated = [];
  keys.forEach((key) => {
    if (isCalculatedField(key)) {
      calculated.push({ key, ...fieldMetaFor(key, template) });
      return;
    }
    const meta = fieldMetaFor(key, template);
    if (!groups[meta.group]) groups[meta.group] = [];
    groups[meta.group].push({ key, ...meta });
  });
  const orderedGroups = GROUP_ORDER.filter((g) => groups[g]).map((g) => ({ group: g, fields: groups[g] }));
  Object.keys(groups).forEach((g) => {
    if (!GROUP_ORDER.includes(g)) orderedGroups.push({ group: g, fields: groups[g] });
  });
  return { groups: orderedGroups, calculated };
}

export function defaultValuesFor(template) {
  const values = {};
  extractPlaceholders(template.html).forEach((key) => {
    if (isCalculatedField(key) || isImageField(key)) return;
    const meta = fieldMetaFor(key, template);
    if (meta.default !== undefined) values[key] = meta.default;
  });
  const today = new Date();
  const fmt = (d) => d.toLocaleDateString("en-GB");
  if (template.dateKey) values[template.dateKey] = fmt(today);
  if (template.secondDateKey) {
    const later = new Date(today);
    later.setDate(later.getDate() + 15);
    values[template.secondDateKey] = fmt(later);
  }
  return values;
}

export function emptyItemRow(showGst) {
  return {
    id: `row-${Math.random().toString(36).slice(2, 9)}`,
    name: "",
    description: "",
    qty: 1,
    rate: 0,
    gst: showGst ? 18 : 0,
  };
}

export function computeTotals(items, discount, taxRate, showGstBreakdown) {
  const subtotal = (items || []).reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);
  const afterDiscount = Math.max(0, subtotal - (Number(discount) || 0));
  const tax = afterDiscount * ((Number(taxRate) || 0) / 100);
  const grandTotal = afterDiscount + tax;
  return {
    subtotal,
    tax,
    grandTotal,
    cgst: showGstBreakdown ? tax / 2 : 0,
    sgst: showGstBreakdown ? tax / 2 : 0,
  };
}

function money(n) {
  const v = Number(n) || 0;
  return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderItemsTable(items, accentColor, showGst) {
  const rows = (items || [])
    .map((it, i) => {
      const amount = (Number(it.qty) || 0) * (Number(it.rate) || 0);
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;color:#888;">${i + 1}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;">${
          it.name ? escapeHtml(it.name) : '<span style="color:#bbb;">Item name</span>'
        }${it.description ? `<div style="font-size:11px;color:#888;">${escapeHtml(it.description)}</div>` : ""}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;">${it.qty ?? 0}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;">${money(it.rate)}</td>
        ${showGst ? `<td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;">${it.gst ?? 0}%</td>` : ""}
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;font-weight:600;">${money(amount)}</td>
      </tr>`;
    })
    .join("");
  const colCount = showGst ? 6 : 5;
  return `<table style="width:100%;border-collapse:collapse;margin-top:6px;">
    <thead><tr style="background:${accentColor}14;">
      <th style="padding:8px;text-align:left;font-size:11px;color:${accentColor};border-bottom:2px solid ${accentColor};width:26px;">#</th>
      <th style="padding:8px;text-align:left;font-size:11px;color:${accentColor};border-bottom:2px solid ${accentColor};">Item</th>
      <th style="padding:8px;text-align:right;font-size:11px;color:${accentColor};border-bottom:2px solid ${accentColor};width:56px;">Qty</th>
      <th style="padding:8px;text-align:right;font-size:11px;color:${accentColor};border-bottom:2px solid ${accentColor};width:90px;">Rate</th>
      ${showGst ? `<th style="padding:8px;text-align:right;font-size:11px;color:${accentColor};border-bottom:2px solid ${accentColor};width:56px;">GST</th>` : ""}
      <th style="padding:8px;text-align:right;font-size:11px;color:${accentColor};border-bottom:2px solid ${accentColor};width:100px;">Amount</th>
    </tr></thead>
    <tbody>${rows || `<tr><td colspan="${colCount}" style="padding:16px;text-align:center;color:#bbb;font-size:12px;">No items added yet</td></tr>`}</tbody>
  </table>`;
}

function imageTag(dataUrl, label, w, h, radius) {
  if (dataUrl) return `<img src="${dataUrl}" style="width:${w}px;height:${h}px;object-fit:contain;border-radius:${radius};" />`;
  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${w}px;height:${h}px;border:1.5px dashed #c9c2de;border-radius:${radius};color:#a89bd0;font-size:9px;text-align:center;padding:2px;line-height:1.2;">${label}</span>`;
}

// Replaces every {{Token}} (and the {{ITEMS_TABLE}} marker) in a template's
// HTML with live values. This is the ONLY place placeholder text is turned
// into real content, so exported/printed documents never contain the
// {{FieldName}} syntax -- only filled values or (if left blank) a light
// grey label, never raw tokens.
export function renderTemplateHtml(template, values, items, images) {
  const showGst = !!template.showGstBreakdown;
  const totals = computeTotals(items, values.Discount, values.TaxRate, showGst);
  let html = template.html;

  html = html.replace(/\{\{ITEMS_TABLE\}\}/g, renderItemsTable(items, template.accentColor, showGst));

  html = html.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (isImageField(key)) {
      const dims = key === "CompanyLogo" ? [56, 56, "8px"] : key === "Stamp" ? [66, 66, "50%"] : [130, 46, "6px"];
      const label = key === "CompanyLogo" ? "Logo" : key === "Stamp" ? "Stamp" : "Signature";
      return imageTag((images || {})[key], label, dims[0], dims[1], dims[2]);
    }
    if (key === "Subtotal") return money(totals.subtotal);
    if (key === "Tax") return money(totals.tax);
    if (key === "CGST") return money(totals.cgst);
    if (key === "SGST") return money(totals.sgst);
    if (key === "GrandTotal") return money(totals.grandTotal);

    const val = values ? values[key] : undefined;
    if (val !== undefined && val !== null && val !== "") {
      return escapeHtml(val).replace(/\n/g, "<br>");
    }
    const meta = fieldMetaFor(key, template);
    return `<span style="color:#bbb;">${meta.label}</span>`;
  });

  return html;
}
