import React, { useRef } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Copy, ArrowUp, ArrowDown, Upload, X, Lock, Unlock, Save, FolderUp, FileJson } from "lucide-react";
import { CATEGORY_META, CATEGORY_ORDER, BUSINESS_TEMPLATES } from "./templates/catalog";
import { isImageField } from "./templates/engine";

const PANEL = "#211B30";
const PANEL_2 = "#2A2340";
const VIOLET = "#8B5EFF";

function TemplateThumb({ accentColor, layout }) {
  if (layout === "corporate") {
    return (
      <div className="flex w-full h-full">
        <div style={{ width: 6, background: accentColor }} />
        <div className="flex-1" style={{ background: "#fff" }}>
          <div style={{ height: "35%", background: `${accentColor}22` }} />
        </div>
      </div>
    );
  }
  if (layout === "bold") {
    return (
      <div className="w-full h-full" style={{ background: accentColor }}>
        <div style={{ height: "55%", background: "rgba(255,255,255,0.15)" }} />
      </div>
    );
  }
  if (layout === "minimal") {
    return (
      <div className="w-full h-full" style={{ background: "#fff", borderBottom: `3px solid ${accentColor}` }}>
        <div style={{ marginTop: 6, marginLeft: 6, width: "40%", height: 4, background: accentColor, opacity: 0.6, borderRadius: 2 }} />
      </div>
    );
  }
  if (layout === "classic") {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: "#fff", border: `2px solid ${accentColor}` }}>
        <div style={{ width: "50%", height: 4, background: accentColor, borderRadius: 2 }} />
      </div>
    );
  }
  return (
    <div className="w-full h-full" style={{ background: "#fff" }}>
      <div style={{ height: "38%", background: accentColor }} />
    </div>
  );
}

function CategorySection({ label, open, onToggle, templates, activeTemplateId, onSelectTemplate }) {
  return (
    <div style={{ borderBottom: "1px solid #2E2646" }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-[#2A2340]" style={{ color: "#B9AFD6" }}>
        {label}
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </button>
      {open && (
        <div className="px-2 pb-2 grid grid-cols-2 gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              className="rounded-md overflow-hidden text-left"
              style={{ border: activeTemplateId === t.id ? `2px solid ${VIOLET}` : "1px solid #3B3258" }}
              title={t.name}
            >
              <div style={{ height: 40 }}>
                <TemplateThumb accentColor={t.accentColor} layout={t.layout} />
              </div>
              <div className="px-1.5 py-1 text-[10px] leading-tight" style={{ color: "#D9D2EE", background: PANEL_2 }}>{t.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TemplateLibrarySection({ categoriesOpen, toggleCategory, activeTemplateId, customTemplates, onSelectTemplate, onStartBlank }) {
  const byCategory = (cat) => BUSINESS_TEMPLATES.filter((t) => t.category === cat);
  return (
    <div>
      <div className="px-3 pt-2 pb-1">
        <button onClick={onStartBlank} className="w-full text-xs rounded py-1.5" style={{ color: "#D9D2EE", border: "1px dashed #4A3F6E" }}>
          + Start blank document
        </button>
      </div>
      {CATEGORY_ORDER.map((cat) => (
        <CategorySection
          key={cat}
          label={CATEGORY_META[cat].label}
          open={!!categoriesOpen[cat]}
          onToggle={() => toggleCategory(cat)}
          templates={byCategory(cat)}
          activeTemplateId={activeTemplateId}
          onSelectTemplate={onSelectTemplate}
        />
      ))}
      {customTemplates && customTemplates.length > 0 && (
        <CategorySection
          label="Custom"
          open={!!categoriesOpen.custom}
          onToggle={() => toggleCategory("custom")}
          templates={customTemplates}
          activeTemplateId={activeTemplateId}
          onSelectTemplate={onSelectTemplate}
        />
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  if (field.type === "textarea") {
    return (
      <textarea
        rows={2}
        value={value || ""}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.label}
        className="w-full text-xs rounded px-2 py-1.5 mb-2 resize-none"
        style={{ background: PANEL_2, color: "#EDE8FB", border: "1px solid #4A3F6E" }}
      />
    );
  }
  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      value={value || ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      placeholder={field.type === "date" ? "DD/MM/YYYY" : field.label}
      className="w-full text-xs rounded px-2 py-1.5 mb-2"
      style={{ background: PANEL_2, color: "#EDE8FB", border: "1px solid #4A3F6E" }}
    />
  );
}

function ImageFieldInput({ field, value, onUpload }) {
  const inputRef = useRef(null);
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2">
        {value ? (
          <img src={value} alt={field.label} className="rounded" style={{ width: 32, height: 32, objectFit: "cover", border: "1px solid #4A3F6E" }} />
        ) : (
          <div className="rounded flex items-center justify-center" style={{ width: 32, height: 32, border: "1px dashed #4A3F6E", color: "#75688F" }}>
            <Upload size={13} />
          </div>
        )}
        <button onClick={() => inputRef.current?.click()} className="flex-1 text-xs rounded py-1.5" style={{ color: "#D9D2EE", border: "1px solid #4A3F6E" }}>
          {value ? "Replace" : "Upload"}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && onUpload(field.key, e.target.files[0])} />
    </div>
  );
}

function PanelLabel({ children }) {
  return <label className="block text-xs mb-1" style={{ color: "#8C81AD" }}>{children}</label>;
}

export function DocumentFormPanel({
  template,
  schema,
  values,
  onChangeValue,
  images,
  onUploadImage,
  items,
  onAddItem,
  onDeleteItem,
  onDuplicateItem,
  onMoveItem,
  onChangeItem,
  totals,
  showGstBreakdown,
  editMode,
  onToggleEditMode,
  onSaveCustomTemplate,
  onSaveJson,
  onLoadJson,
  onClose,
}) {
  const loadInputRef = useRef(null);
  if (!template) return null;

  return (
    <div className="no-print w-80 overflow-y-auto shrink-0 p-3" style={{ background: PANEL, borderLeft: "1px solid #382E52" }}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold" style={{ color: "#EDE8FB" }}>{template.name}</h3>
        <button onClick={onClose} style={{ color: "#D9D2EE" }} title="Close template"><X size={14} /></button>
      </div>
      <p className="text-[11px] mb-3" style={{ color: "#8C81AD" }}>Fill in the fields below — the document updates live. The layout stays locked.</p>

      <button
        onClick={onToggleEditMode}
        className="w-full flex items-center justify-center gap-1.5 text-xs rounded py-1.5 mb-3"
        style={{ color: editMode ? "#111" : "#D9D2EE", background: editMode ? "#FFB255" : "transparent", border: "1px solid #4A3F6E" }}
      >
        {editMode ? <Unlock size={13} /> : <Lock size={13} />}
        {editMode ? "Edit Template: ON" : "Edit Template: OFF"}
      </button>

      {editMode ? (
        <div className="mb-3 rounded p-2" style={{ background: PANEL_2, border: "1px solid #4A3F6E" }}>
          <p className="text-[11px] mb-2" style={{ color: "#B9AFD6" }}>
            Template is unlocked — use the toolbar above to edit layout, colors, fonts, logos and spacing directly on the page.
          </p>
          <button onClick={onSaveCustomTemplate} className="w-full flex items-center justify-center gap-1.5 text-xs rounded py-1.5" style={{ background: VIOLET, color: "white" }}>
            <Save size={13} /> Save as new custom template
          </button>
        </div>
      ) : (
        <>
          {schema.groups.map((g) => (
            <div key={g.group} className="mb-3">
              <PanelLabel>{g.group}</PanelLabel>
              {g.fields.map((f) =>
                isImageField(f.key) ? (
                  <ImageFieldInput key={f.key} field={f} value={images[f.key]} onUpload={onUploadImage} />
                ) : (
                  <FieldInput key={f.key} field={f} value={values[f.key]} onChange={onChangeValue} />
                )
              )}
            </div>
          ))}

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <PanelLabel>Items</PanelLabel>
              <button onClick={onAddItem} className="flex items-center gap-1 text-[11px] rounded px-2 py-1" style={{ color: "#D9D2EE", border: "1px solid #4A3F6E" }}>
                <Plus size={11} /> Add item
              </button>
            </div>
            <div className="space-y-2">
              {items.map((it, i) => (
                <div key={it.id} className="rounded p-2" style={{ background: PANEL_2, border: "1px solid #4A3F6E" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]" style={{ color: "#8C81AD" }}>Item {i + 1}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onMoveItem(it.id, -1)} disabled={i === 0} style={{ color: "#8C81AD", opacity: i === 0 ? 0.35 : 1 }} title="Move up"><ArrowUp size={12} /></button>
                      <button onClick={() => onMoveItem(it.id, 1)} disabled={i === items.length - 1} style={{ color: "#8C81AD", opacity: i === items.length - 1 ? 0.35 : 1 }} title="Move down"><ArrowDown size={12} /></button>
                      <button onClick={() => onDuplicateItem(it.id)} style={{ color: "#8C81AD" }} title="Duplicate row"><Copy size={12} /></button>
                      <button onClick={() => onDeleteItem(it.id)} style={{ color: "#FF8A8A" }} title="Delete row"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <input value={it.name} onChange={(e) => onChangeItem(it.id, "name", e.target.value)} placeholder="Item name" className="w-full text-xs rounded px-2 py-1 mb-1" style={{ background: "#211B30", color: "#EDE8FB", border: "1px solid #4A3F6E" }} />
                  <input value={it.description} onChange={(e) => onChangeItem(it.id, "description", e.target.value)} placeholder="Description (optional)" className="w-full text-xs rounded px-2 py-1 mb-1" style={{ background: "#211B30", color: "#EDE8FB", border: "1px solid #4A3F6E" }} />
                  <div className="grid gap-1" style={{ gridTemplateColumns: showGstBreakdown ? "1fr 1fr 1fr" : "1fr 1fr" }}>
                    <input type="number" value={it.qty} onChange={(e) => onChangeItem(it.id, "qty", e.target.value)} placeholder="Qty" className="text-xs rounded px-2 py-1" style={{ background: "#211B30", color: "#EDE8FB", border: "1px solid #4A3F6E" }} />
                    <input type="number" value={it.rate} onChange={(e) => onChangeItem(it.id, "rate", e.target.value)} placeholder="Unit price" className="text-xs rounded px-2 py-1" style={{ background: "#211B30", color: "#EDE8FB", border: "1px solid #4A3F6E" }} />
                    {showGstBreakdown && (
                      <input type="number" value={it.gst} onChange={(e) => onChangeItem(it.id, "gst", e.target.value)} placeholder="GST %" className="text-xs rounded px-2 py-1" style={{ background: "#211B30", color: "#EDE8FB", border: "1px solid #4A3F6E" }} />
                    )}
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="text-[11px]" style={{ color: "#75688F" }}>No items yet — add one above.</p>}
            </div>
          </div>

          <div className="mb-3 rounded p-2" style={{ background: PANEL_2, border: "1px solid #4A3F6E" }}>
            <PanelLabel>Totals (automatic)</PanelLabel>
            <div className="text-xs space-y-1" style={{ color: "#D9D2EE" }}>
              <div className="flex justify-between"><span>Subtotal</span><span>{totals.subtotal.toFixed(2)}</span></div>
              {showGstBreakdown ? (
                <>
                  <div className="flex justify-between"><span>CGST</span><span>{totals.cgst.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>SGST</span><span>{totals.sgst.toFixed(2)}</span></div>
                </>
              ) : (
                <div className="flex justify-between"><span>Tax</span><span>{totals.tax.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between font-semibold" style={{ color: "#EDE8FB" }}><span>Grand Total</span><span>{totals.grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-2 mt-2">
        <button onClick={onSaveJson} className="flex items-center justify-center gap-1 text-xs rounded py-1.5" style={{ color: "#D9D2EE", border: "1px solid #4A3F6E" }}>
          <FileJson size={13} /> Save JSON
        </button>
        <button onClick={() => loadInputRef.current?.click()} className="flex items-center justify-center gap-1 text-xs rounded py-1.5" style={{ color: "#D9D2EE", border: "1px solid #4A3F6E" }}>
          <FolderUp size={13} /> Reload JSON
        </button>
        <input ref={loadInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files[0] && onLoadJson(e.target.files[0])} />
      </div>
      <p className="text-[10px] mt-2" style={{ color: "#75688F" }}>Use the Export button in the header to save as PDF, Word, or print — the filled values are exported, not the placeholder names.</p>
    </div>
  );
}
