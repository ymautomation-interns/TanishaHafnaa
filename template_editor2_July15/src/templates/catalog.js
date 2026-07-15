// ---------------------------------------------------------------------------
// Catalog of business document templates for the Template Library sidebar.
// Every template is generated from a shared layout builder so the 20
// templates stay visually consistent while looking distinct per category.
// Each template's HTML contains {{Placeholder}} tokens only -- there is no
// contenteditable="true" anywhere in these templates, so the layout, logos,
// borders, tables and headings can never be typed into directly.
// ---------------------------------------------------------------------------

function metaLinesHtml(cfg) {
  const { numberLabel, numberKey, dateLabel, dateKey, secondDateLabel, secondDateKey } = cfg;
  return `
    <div style="font-size:11px;margin-top:6px;">${numberLabel}: {{${numberKey}}}</div>
    <div style="font-size:11px;">${dateLabel}: {{${dateKey}}}</div>
    ${secondDateKey ? `<div style="font-size:11px;">${secondDateLabel}: {{${secondDateKey}}}</div>` : ""}
  `;
}

function headerBlock(cfg) {
  const { accentColor, docTitle, layout, numberLabel, numberKey, dateLabel, dateKey, secondDateLabel, secondDateKey } = cfg;

  if (layout === "minimal") {
    return `<div style="margin:-72px -72px 24px -72px;padding:36px 56px 20px;border-bottom:3px solid ${accentColor};display:flex;justify-content:space-between;">
      <div style="display:flex;gap:12px;align-items:center;">{{CompanyLogo}}<div><div style="font-size:19px;font-weight:700;color:#222;">{{CompanyName}}</div><div style="font-size:11px;color:#888;">{{CompanyAddress}}</div><div style="font-size:11px;color:#888;">{{CompanyPhone}} &middot; {{CompanyEmail}} &middot; GSTIN {{CompanyGST}}</div></div></div>
      <div style="text-align:right;color:${accentColor};"><div style="font-size:22px;font-weight:800;letter-spacing:1px;">${docTitle}</div><div style="color:#555;">${metaLinesHtml(cfg)}</div></div>
    </div>`;
  }
  if (layout === "corporate") {
    return `<div style="display:flex;margin:-72px -72px 24px -72px;">
      <div style="width:10px;background:${accentColor};"></div>
      <div style="flex:1;padding:32px 46px;display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="display:flex;gap:12px;align-items:center;">{{CompanyLogo}}<div><div style="font-size:19px;font-weight:700;color:#1c1c1c;">{{CompanyName}}</div><div style="font-size:11px;color:#777;">{{CompanyAddress}}</div><div style="font-size:11px;color:#777;">{{CompanyPhone}} &middot; {{CompanyEmail}}</div></div></div>
        <div style="text-align:right;"><div style="font-size:22px;font-weight:800;color:${accentColor};">${docTitle}</div><div style="font-size:11px;color:#555;">${metaLinesHtml(cfg)}</div></div>
      </div>
    </div>`;
  }
  if (layout === "bold") {
    return `<div style="margin:-72px -72px 24px -72px;padding:40px 56px;background:${accentColor};color:#fff;position:relative;overflow:hidden;">
      <div style="position:absolute;right:-30px;top:-30px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.12);"></div>
      <div style="display:flex;justify-content:space-between;position:relative;">
        <div style="display:flex;gap:12px;align-items:center;">{{CompanyLogo}}<div><div style="font-size:20px;font-weight:700;">{{CompanyName}}</div><div style="font-size:11px;opacity:0.85;">{{CompanyAddress}}</div><div style="font-size:11px;opacity:0.85;">{{CompanyPhone}} &middot; {{CompanyEmail}}</div></div></div>
        <div style="text-align:right;"><div style="font-size:30px;font-weight:800;letter-spacing:1px;">${docTitle}</div><div style="font-size:11px;opacity:0.9;">${metaLinesHtml(cfg)}</div></div>
      </div>
    </div>`;
  }
  if (layout === "classic") {
    return `<div style="margin:-72px -72px 24px -72px;padding:34px 56px;text-align:center;border-bottom:2px solid ${accentColor};">
      <div style="display:flex;justify-content:center;">{{CompanyLogo}}</div>
      <div style="font-size:20px;font-weight:700;color:#222;margin-top:6px;font-family:Georgia,serif;">{{CompanyName}}</div>
      <div style="font-size:11px;color:#777;">{{CompanyAddress}} &middot; {{CompanyPhone}} &middot; {{CompanyEmail}}</div>
      <div style="font-size:22px;font-weight:800;letter-spacing:3px;color:${accentColor};margin-top:16px;">${docTitle}</div>
      <div style="font-size:11px;color:#555;margin-top:4px;">${numberLabel}: {{${numberKey}}} &nbsp;&middot;&nbsp; ${dateLabel}: {{${dateKey}}}${secondDateKey ? ` &nbsp;&middot;&nbsp; ${secondDateLabel}: {{${secondDateKey}}}` : ""}</div>
    </div>`;
  }
  // modern (default)
  return `<div style="margin:-72px -72px 24px -72px;background:${accentColor};padding:32px 56px;color:#fff;display:flex;justify-content:space-between;align-items:flex-start;">
    <div style="display:flex;gap:14px;align-items:center;">{{CompanyLogo}}<div><div style="font-size:20px;font-weight:700;">{{CompanyName}}</div><div style="font-size:11px;opacity:0.85;max-width:260px;">{{CompanyAddress}}</div><div style="font-size:11px;opacity:0.85;">{{CompanyPhone}} &middot; {{CompanyEmail}}</div></div></div>
    <div style="text-align:right;"><div style="font-size:24px;font-weight:800;letter-spacing:1px;">${docTitle}</div><div style="font-size:11px;opacity:0.9;">${metaLinesHtml(cfg)}</div></div>
  </div>`;
}

function bodyBlock(cfg) {
  const { accentColor, partyLabel, showGstBreakdown } = cfg;
  return `
  <div style="padding:0 56px 48px;">
    <div style="font-size:11px;color:#777;margin-bottom:10px;">GSTIN: {{CompanyGST}}</div>
    <div style="background:${accentColor}12;border-left:3px solid ${accentColor};border-radius:4px;padding:12px 16px;margin-bottom:18px;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${accentColor};font-weight:700;margin-bottom:4px;">${partyLabel}</div>
      <div style="font-size:13px;font-weight:700;color:#222;">{{CustomerName}}</div>
      <div style="font-size:11px;color:#666;margin-top:2px;">{{CustomerAddress}}</div>
      <div style="font-size:11px;color:#666;">{{CustomerPhone}} &middot; {{CustomerEmail}} &middot; GSTIN: {{CustomerGST}}</div>
    </div>
    {{ITEMS_TABLE}}
    <div style="display:flex;justify-content:flex-end;margin-top:16px;">
      <div style="width:240px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#666;padding:3px 0;"><span>Subtotal</span><span>{{Subtotal}}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#666;padding:3px 0;"><span>Discount</span><span>{{Discount}}</span></div>
        ${
          showGstBreakdown
            ? `<span style="display:none;">{{TaxRate}}</span><div style="display:flex;justify-content:space-between;font-size:12px;color:#666;padding:3px 0;"><span>CGST</span><span>{{CGST}}</span></div><div style="display:flex;justify-content:space-between;font-size:12px;color:#666;padding:3px 0;"><span>SGST</span><span>{{SGST}}</span></div>`
            : `<div style="display:flex;justify-content:space-between;font-size:12px;color:#666;padding:3px 0;"><span>Tax ({{TaxRate}}%)</span><span>{{Tax}}</span></div>`
        }
        <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;background:${accentColor};color:#fff;padding:8px 10px;border-radius:6px;margin-top:6px;"><span>Total</span><span>{{GrandTotal}}</span></div>
      </div>
    </div>
    <div style="margin-top:22px;font-size:11px;color:#666;white-space:pre-line;min-height:14px;">{{Notes}}</div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:34px;">
      <div>{{Stamp}}</div>
      <div style="text-align:center;">
        {{AuthorizedSignature}}
        <div style="font-size:10px;color:#888;border-top:1px solid #ccc;margin-top:4px;padding-top:4px;">Authorized Signature</div>
      </div>
    </div>
  </div>`;
}

export function buildTemplateHtml(cfg) {
  return `<div contenteditable="false">${headerBlock(cfg)}${bodyBlock(cfg)}</div>`;
}

export const CATEGORY_META = {
  invoice: { label: "Invoice", docTitle: "INVOICE", numberLabel: "Invoice Number", numberKey: "InvoiceNumber", dateLabel: "Invoice Date", dateKey: "InvoiceDate", secondDateLabel: "Due Date", secondDateKey: "DueDate", partyLabel: "Bill To" },
  dc: { label: "Delivery Challan", docTitle: "DELIVERY CHALLAN", numberLabel: "DC Number", numberKey: "DCNumber", dateLabel: "DC Date", dateKey: "DCDate", secondDateLabel: "Delivery Date", secondDateKey: "DeliveryDate", partyLabel: "Deliver To" },
  po: { label: "Purchase Order", docTitle: "PURCHASE ORDER", numberLabel: "PO Number", numberKey: "PONumber", dateLabel: "PO Date", dateKey: "PODate", secondDateLabel: "Delivery Expected", secondDateKey: "DeliveryExpected", partyLabel: "Vendor" },
  estimate: { label: "Estimate / Quotation", docTitle: "ESTIMATE", numberLabel: "Estimate Number", numberKey: "EstimateNumber", dateLabel: "Estimate Date", dateKey: "EstimateDate", secondDateLabel: "Valid Until", secondDateKey: "ValidUntil", partyLabel: "Prepared For" },
};

export const CATEGORY_ORDER = ["invoice", "dc", "po", "estimate"];

const PARTY_WORD = { invoice: "Customer", dc: "Consignee", po: "Vendor", estimate: "Client" };
function partyOverrides(category) {
  const w = PARTY_WORD[category];
  return {
    CustomerName: `${w} Name`,
    CustomerAddress: `${w} Address`,
    CustomerPhone: `${w} Phone`,
    CustomerEmail: `${w} Email`,
    CustomerGST: `${w} GST Number`,
  };
}

// [id, category, display name, layout, accent color, show CGST/SGST split]
const RAW = [
  ["modern-invoice", "invoice", "Modern Invoice", "modern", "#0F766E", false],
  ["minimal-invoice", "invoice", "Minimal Invoice", "minimal", "#374151", false],
  ["blue-corporate-invoice", "invoice", "Blue Corporate Invoice", "corporate", "#1D4ED8", false],
  ["gst-invoice", "invoice", "GST Invoice", "bold", "#7C3AED", true],
  ["premium-invoice", "invoice", "Premium Invoice", "classic", "#B08900", false],

  ["standard-dc", "dc", "Standard DC", "minimal", "#475569", false],
  ["logistics-dc", "dc", "Logistics DC", "modern", "#EA580C", false],
  ["warehouse-dc", "dc", "Warehouse DC", "corporate", "#0F172A", false],
  ["manufacturing-dc", "dc", "Manufacturing DC", "bold", "#B91C1C", false],
  ["transport-dc", "dc", "Transport DC", "classic", "#15803D", false],

  ["corporate-po", "po", "Corporate PO", "corporate", "#1E3A8A", false],
  ["manufacturing-po", "po", "Manufacturing PO", "modern", "#92400E", false],
  ["retail-po", "po", "Retail PO", "bold", "#DB2777", false],
  ["service-po", "po", "Service PO", "minimal", "#0891B2", false],
  ["minimal-po", "po", "Minimal PO", "minimal", "#111827", false],

  ["business-estimate", "estimate", "Business Estimate", "modern", "#4338CA", false],
  ["contractor-estimate", "estimate", "Contractor Estimate", "corporate", "#C2410C", false],
  ["construction-estimate", "estimate", "Construction Estimate", "bold", "#CA8A04", false],
  ["service-estimate", "estimate", "Service Estimate", "minimal", "#0D9488", false],
  ["professional-quote", "estimate", "Professional Quote", "classic", "#6D28D9", false],
];

export const BUSINESS_TEMPLATES = RAW.map(([id, category, name, layout, accentColor, showGstBreakdown]) => {
  const meta = CATEGORY_META[category];
  const cfg = { ...meta, accentColor, layout, showGstBreakdown };
  return {
    id,
    category,
    name,
    layout,
    accentColor,
    showGstBreakdown,
    numberKey: meta.numberKey,
    dateKey: meta.dateKey,
    secondDateKey: meta.secondDateKey,
    fieldLabelOverrides: partyOverrides(category),
    html: buildTemplateHtml(cfg),
  };
});

export function findTemplate(id, customTemplates) {
  return (customTemplates || []).find((t) => t.id === id) || BUSINESS_TEMPLATES.find((t) => t.id === id) || null;
}
