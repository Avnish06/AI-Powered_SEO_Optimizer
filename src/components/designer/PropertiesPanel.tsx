"use client";

import { FabricObject, IText, FabricImage } from "fabric";
import {
  Trash2, BringToFront, SendToBack, MousePointer,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Underline, MoveHorizontal, MoveVertical, Maximize,
} from "lucide-react";
import { useState } from "react";

// ── Professional, muted palette — no neon ──────────────────────
// Row 1: Pure neutrals
// Row 2: Warm neutrals / slates
// Row 3: Indigo / violet family
// Row 4: Muted warm accents
const PRESET_COLORS = [
  // Row 1: Pure neutrals — light to dark
  "#ffffff", "#f1f5f9", "#e2e8f0", "#94a3b8",
  "#475569", "#1e293b", "#0f172a", "#000000",
  // Row 2: Indigo / violet family — muted
  "#e0e7ff", "#a5b4fc", "#818cf8", "#6366f1",
  "#4f46e5", "#4338ca", "#312e81", "#1e1b4b",
  // Row 3: Steel blue / slate blue — NO bright cyan
  "#dbeafe", "#93c5fd", "#60a5fa", "#2563eb",
  "#1d4ed8", "#1e3a8a", "#172554", "#0c1445",
  // Row 4: Warm/earth — amber & rose (all muted)
  "#fef3c7", "#fde68a", "#d97706", "#92400e",
  "#fce7f3", "#f9a8d4", "#be185d", "#831843",
];

interface PropertiesPanelProps {
  selected: FabricObject | null;
  layers: FabricObject[];
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onUpdate: (prop: string, value: unknown) => void;
  onSelectLayer: (obj: FabricObject) => void;
}

const FONT_FAMILIES = [
  "Inter",
  "Space Grotesk",
  "Outfit",
  "Georgia",
  "Playfair Display",
  "Roboto",
  "Montserrat",
  "Courier New",
  "DM Serif Display",
];

type PanelTab = "properties" | "layers";

export default function PropertiesPanel({
  selected, layers,
  onDelete, onBringForward, onSendBackward,
  onUpdate, onSelectLayer,
}: PropertiesPanelProps) {
  const [tab, setTab] = useState<PanelTab>(selected ? "properties" : "layers");
  const [strokeVisible, setStrokeVisible] = useState(false);
  const [shadowVisible, setShadowVisible] = useState(false);

  const isText  = selected instanceof IText;
  const isImage = selected instanceof FabricImage;
  const isShape = selected && !isText && !isImage;

  const fill      = (selected?.get("fill") as string) || "#6366f1";
  const stroke    = (selected?.get("stroke") as string) || "";
  const strokeW   = (selected?.get("strokeWidth") as number) || 0;
  const opacity   = Math.round((selected?.get("opacity") ?? 1) * 100);
  const posLeft   = Math.round((selected?.get("left") as number) || 0);
  const posTop    = Math.round((selected?.get("top") as number) || 0);
  const width     = Math.round(((selected as any)?.get("width") as number) || 0);
  const height    = Math.round(((selected as any)?.get("height") as number) || 0);
  const angle     = Math.round((selected?.get("angle") as number) || 0);
  const fontSize  = isText ? (selected as IText).get("fontSize") || 24 : null;
  const fontFam   = isText ? (selected as IText).get("fontFamily") || "Inter" : null;
  const fontW     = isText ? (selected as IText).get("fontWeight") : null;
  const fontSt    = isText ? (selected as IText).get("fontStyle") : null;
  const fontDec   = isText ? (selected as IText).get("underline") : null;
  const textAlign = isText ? (selected as IText).get("textAlign") || "left" : null;
  const lineH     = isText ? ((selected as IText).get("lineHeight") as number) || 1.2 : null;
  const rx        = isShape ? ((selected as any).get("rx") ?? 0) : null;

  // Auto-switch to properties when something selected
  const activeTab = selected ? tab : "layers";

  return (
    <aside className="w-[216px] h-full bg-[#0f172a] border-l border-white/[0.05] flex flex-col flex-shrink-0">
      {/* Tab bar */}
      <div className="flex border-b border-white/[0.05] flex-shrink-0">
        <TabBtn active={activeTab === "properties" && !!selected} onClick={() => setTab("properties")} disabled={!selected}>
          Properties
        </TabBtn>
        <TabBtn active={activeTab === "layers"} onClick={() => setTab("layers")}>
          Layers ({layers.length})
        </TabBtn>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── LAYERS PANEL ── */}
        {(activeTab === "layers" || !selected) && (
          <div className="p-3 space-y-1">
            {layers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 opacity-20">
                <MousePointer className="w-8 h-8 text-slate-400 mb-3" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide text-center leading-relaxed">
                  Add objects<br />to the canvas
                </p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {[...layers].reverse().map((obj, i) => (
                  <LayerItem
                    key={i}
                    obj={obj}
                    isSelected={obj === selected}
                    onClick={() => { onSelectLayer(obj); setTab("properties"); }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROPERTIES PANEL ── */}
        {activeTab === "properties" && selected && (
          <div className="p-3 space-y-4">

            {/* Object type badge */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {isText ? "Text" : isImage ? "Image" : "Shape"}
                </span>
              </div>
              <button
                onClick={onDelete}
                title="Delete"
                className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <Divider />

            {/* ── TEXT CONTROLS ── */}
            {isText && (
              <>
                <Section title="Font Family">
                  <select
                    value={fontFam || "Inter"}
                    onChange={(e) => onUpdate("fontFamily", e.target.value)}
                    className="w-full bg-[#1e293b] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  >
                    {FONT_FAMILIES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </Section>

                <Section title="Size">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={6} max={400}
                      value={fontSize ?? 24}
                      onChange={(e) => onUpdate("fontSize", parseInt(e.target.value))}
                      className="w-16 bg-[#1e293b] border border-white/[0.06] rounded-lg px-2 py-1.5 text-[11px] font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-colors text-center"
                    />
                    <div className="flex flex-wrap gap-1">
                      {[16, 24, 32, 48, 64, 96].map((s) => (
                        <button
                          key={s}
                          onClick={() => onUpdate("fontSize", s)}
                          className={`px-1.5 py-0.5 rounded-md text-[9px] font-black transition-all ${
                            fontSize === s
                              ? "bg-indigo-600 text-white"
                              : "bg-[#1e293b] text-slate-500 hover:text-white border border-white/[0.04]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </Section>

                <Section title="Style">
                  <div className="flex gap-1">
                    <StyleBtn active={fontW === "bold" || fontW === "900"} onClick={() => onUpdate("fontWeight", (fontW === "bold" || fontW === "900") ? "400" : "bold")} title="Bold">
                      <Bold className="w-3 h-3" />
                    </StyleBtn>
                    <StyleBtn active={fontSt === "italic"} onClick={() => onUpdate("fontStyle", fontSt === "italic" ? "normal" : "italic")} title="Italic">
                      <Italic className="w-3 h-3" />
                    </StyleBtn>
                    <StyleBtn active={!!fontDec} onClick={() => onUpdate("underline", !fontDec)} title="Underline">
                      <Underline className="w-3 h-3" />
                    </StyleBtn>
                    <div className="w-px bg-white/[0.08] mx-0.5" />
                    {(["left", "center", "right"] as const).map((align) => (
                      <StyleBtn key={align} active={textAlign === align} onClick={() => onUpdate("textAlign", align)} title={`Align ${align}`}>
                        {align === "left" && <AlignLeft className="w-3 h-3" />}
                        {align === "center" && <AlignCenter className="w-3 h-3" />}
                        {align === "right" && <AlignRight className="w-3 h-3" />}
                      </StyleBtn>
                    ))}
                  </div>
                </Section>

                <Section title={`Line Height (${lineH?.toFixed(1)})`}>
                  <SliderInput
                    min={0.8} max={3} step={0.1}
                    value={lineH || 1.2}
                    onChange={(v) => onUpdate("lineHeight", v)}
                    color="#6366f1"
                    pct={((lineH || 1.2) - 0.8) / (3 - 0.8) * 100}
                  />
                </Section>

                <Section title="Text Color">
                  <ColorControl fill={fill} onUpdate={(v) => onUpdate("fill", v)} />
                </Section>
                <Divider />
              </>
            )}

            {/* ── SHAPE CONTROLS ── */}
            {isShape && (
              <>
                <Section title="Fill Color">
                  <ColorControl fill={fill} onUpdate={(v) => onUpdate("fill", v)} />
                </Section>

                {rx !== null && (
                  <Section title={`Corner Radius (${Math.round(rx as number)}px)`}>
                    <SliderInput
                      min={0} max={120} step={1}
                      value={rx as number}
                      onChange={(v) => { onUpdate("rx", v); onUpdate("ry", v); }}
                      color="#6366f1"
                      pct={(rx as number) / 120 * 100}
                    />
                  </Section>
                )}
                <Divider />
              </>
            )}

            {/* ── STROKE ── */}
            <div>
              <button
                onClick={() => setStrokeVisible((v) => !v)}
                className="w-full flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors"
              >
                Stroke
                <span className="text-[9px] text-indigo-400">{strokeVisible ? "▲" : "▼"}</span>
              </button>
              {strokeVisible && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg border border-white/[0.1] cursor-pointer relative overflow-hidden flex-shrink-0"
                      style={{ background: stroke || "#6366f1" }}
                    >
                      <input
                        type="color"
                        value={stroke || "#6366f1"}
                        onChange={(e) => onUpdate("stroke", e.target.value)}
                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                      />
                    </div>
                    <input
                      type="text"
                      value={stroke || ""}
                      onChange={(e) => onUpdate("stroke", e.target.value)}
                      placeholder="#000000"
                      className="flex-1 bg-[#1e293b] border border-white/[0.06] rounded-lg px-2 py-1 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-indigo-500/50"
                    />
                    <input
                      type="number"
                      min={0} max={40}
                      value={strokeW}
                      onChange={(e) => onUpdate("strokeWidth", parseInt(e.target.value))}
                      className="w-12 bg-[#1e293b] border border-white/[0.06] rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none text-center"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── OPACITY ── */}
            <Section title={`Opacity (${opacity}%)`}>
              <SliderInput
                min={0} max={100} step={1}
                value={opacity}
                onChange={(v) => onUpdate("opacity", v / 100)}
                color="#8b5cf6"
                pct={opacity}
              />
            </Section>

            <Divider />

            {/* ── POSITION ── */}
            <Section title="Position & Size">
              <div className="grid grid-cols-2 gap-2">
                <NumberInput label="X" value={posLeft} onChange={(v) => onUpdate("left", v)} icon={<MoveHorizontal className="w-3 h-3" />} />
                <NumberInput label="Y" value={posTop} onChange={(v) => onUpdate("top", v)} icon={<MoveVertical className="w-3 h-3" />} />
                <NumberInput label="W" value={width} onChange={(v) => (selected as any).set?.("width", v)} icon={<Maximize className="w-3 h-3" />} />
                <NumberInput label="H" value={height} onChange={(v) => (selected as any).set?.("height", v)} icon={<Maximize className="w-3 h-3" />} />
                <div className="col-span-2">
                  <NumberInput label="Rotate" value={angle} onChange={(v) => onUpdate("angle", v)} icon={<span className="text-[9px] text-slate-500">°</span>} />
                </div>
              </div>
            </Section>

            <Divider />

            {/* ── LAYER ORDER ── */}
            <Section title="Layer Order">
              <div className="grid grid-cols-2 gap-1.5">
                <LayerBtn onClick={onBringForward} label="Bring Fwd" icon={<BringToFront className="w-3.5 h-3.5" />} />
                <LayerBtn onClick={onSendBackward} label="Send Bwd" icon={<SendToBack className="w-3.5 h-3.5" />} />
              </div>
            </Section>

            {/* ── DELETE ── */}
            <button
              onClick={onDelete}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white text-[11px] font-bold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ─── Sub-components ──────────────────────────── */

function TabBtn({
  children, active, onClick, disabled,
}: { children: React.ReactNode; active: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wide border-b-2 transition-all ${
        active
          ? "border-indigo-500 text-indigo-400"
          : "border-transparent text-slate-600 hover:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
      }`}
    >
      {children}
    </button>
  );
}

function LayerItem({
  obj, isSelected, onClick,
}: { obj: FabricObject; isSelected: boolean; onClick: () => void }) {
  const type = (obj as any).type as string;
  const label = type === "i-text"
    ? `"${((obj as IText).text || "").slice(0, 16)}${(obj as IText).text?.length > 16 ? "…" : ""}"`
    : type;
  const color = (obj.get("fill") as string) || "#6366f1";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-left ${
        isSelected
          ? "bg-indigo-600/20 border border-indigo-500/30"
          : "hover:bg-white/[0.04] border border-transparent"
      }`}
    >
      <div
        className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center"
        style={{ background: typeof color === "string" && color.startsWith("#") ? color : "#6366f1" }}
      >
        <span className="text-[7px] text-white font-black opacity-80">
          {type === "i-text" ? "T" : type?.[0]?.toUpperCase()}
        </span>
      </div>
      <span className={`text-[12px] font-semibold capitalize truncate ${isSelected ? "text-white" : "text-slate-400"}`}>
        {label}
      </span>
    </button>
  );
}

function ColorControl({ fill, onUpdate }: { fill: string; onUpdate: (v: string) => void }) {
  // Group into rows of 8 for clear visual bands
  const rows = [
    PRESET_COLORS.slice(0, 8),   // Neutrals
    PRESET_COLORS.slice(8, 16),  // Indigo / violet
    PRESET_COLORS.slice(16, 24), // Muted blues
    PRESET_COLORS.slice(24, 32), // Warm / earth
  ];

  return (
    <div className="space-y-1.5">
      {rows.map((row, ri) => (
        <div key={ri} className="flex gap-1">
          {row.map((c) => (
            <button
              key={c}
              onClick={() => onUpdate(c)}
              title={c}
              className={`flex-1 h-5 rounded-[4px] transition-all hover:scale-110 active:scale-95 ${
                fill === c ? "ring-2 ring-white/60 ring-offset-1 ring-offset-[#0f172a]" : ""
              }`}
              style={{
                background: c,
                outline: ["#ffffff","#f1f5f9","#e2e8f0","#eef2ff","#e0f2fe","#fef3c7","#fee2e2","#c7d2fe"].includes(c)
                  ? "1px solid rgba(0,0,0,0.08)" : undefined,
              }}
            />
          ))}
        </div>
      ))}
      {/* Custom hex / color picker */}
      <div className="flex items-center gap-2 bg-[#1e293b] border border-white/[0.06] rounded-lg px-2.5 py-1.5 mt-1">
        <div className="relative w-5 h-5 rounded-md overflow-hidden flex-shrink-0 border border-white/[0.1]">
          <input
            type="color"
            value={fill?.startsWith("#") ? fill : "#6366f1"}
            onChange={(e) => onUpdate(e.target.value)}
            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={fill}
          onChange={(e) => onUpdate(e.target.value)}
          className="flex-1 bg-transparent text-[10px] font-mono text-slate-300 focus:outline-none uppercase"
          placeholder="#6366f1"
        />
        <span className="text-[9px] text-slate-600 font-semibold">Custom</span>
      </div>
    </div>
  );
}

function SliderInput({
  min, max, step, value, onChange, color, pct,
}: { min: number; max: number; step: number; value: number; onChange: (v: number) => void; color: string; pct: number }) {
  return (
    <input
      type="range"
      min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, ${color} ${pct}%, #1e293b ${pct}%)`,
        accentColor: color,
      }}
    />
  );
}

function NumberInput({
  label, value, onChange, icon,
}: { label: string; value: number; onChange: (v: number) => void; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 bg-[#1e293b] border border-white/[0.06] rounded-lg px-2 py-1.5">
      <span className="text-slate-600 flex-shrink-0">{icon}</span>
      <span className="text-[9px] font-bold text-slate-600 w-3">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 bg-transparent text-[12px] font-mono text-slate-300 focus:outline-none min-w-0 w-full"
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/[0.04]" />;
}

function StyleBtn({ active, onClick, title, children }: { active: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-all ${
        active ? "bg-indigo-600 text-white" : "bg-[#1e293b] text-slate-500 hover:text-white border border-white/[0.04]"
      }`}
    >
      {children}
    </button>
  );
}

function LayerBtn({ onClick, label, icon }: { onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#1e293b] border border-white/[0.04] hover:border-white/[0.1] text-[11px] font-semibold text-slate-400 hover:text-white transition-all"
    >
      {icon}
      {label}
    </button>
  );
}
