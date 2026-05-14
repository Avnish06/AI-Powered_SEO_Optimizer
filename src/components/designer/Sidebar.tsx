"use client";

import { useState, useRef } from "react";
import {
  Type, Square, Circle, ImageIcon,
  Upload, Link, Sparkles,
  LayoutTemplate, Minus, Triangle, Star, Pentagon,
  Smile, Shapes, AlignLeft,
} from "lucide-react";
import { TEMPLATES, TEMPLATE_CATEGORIES, CANVAS_PRESETS } from "./templates";

type AddType =
  | "text-heading" | "text-sub" | "text-body"
  | "rect" | "circle" | "triangle" | "line" | "star" | "pentagon"
  | "image-url" | "image-upload" | "template";

interface SidebarProps {
  onAdd: (type: AddType, payload?: Record<string, unknown>) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLoadTemplate: (id: string) => void;
  onCanvasResize?: (w: number, h: number) => void;
}

const TABS = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "text",      label: "Text",      icon: Type },
  { id: "shapes",    label: "Elements",  icon: Shapes },
  { id: "images",    label: "Images",    icon: ImageIcon },
  { id: "ai",        label: "AI",        icon: Sparkles },
];

// Curated brand-safe palettes — all muted, no neon
const COLOR_PALETTES = [
  {
    name: "Slate",
    colors: ["#0f172a", "#1e293b", "#334155", "#64748b", "#cbd5e1", "#f1f5f9"],
  },
  {
    name: "Indigo",
    colors: ["#1e1b4b", "#312e81", "#4338ca", "#6366f1", "#a5b4fc", "#e0e7ff"],
  },
  {
    name: "Amber",
    colors: ["#78350f", "#92400e", "#b45309", "#d97706", "#fcd34d", "#fef3c7"],
  },
  {
    name: "Sage",
    colors: ["#052e16", "#14532d", "#166534", "#4d7c0f", "#a3e635", "#ecfdf5"].map(
      // desaturate the bright lime
      (c, i) => ["#052e16", "#14532d", "#166534", "#3d6b41", "#86a887", "#f0f7f1"][i]
    ),
  },
  {
    name: "Rose",
    colors: ["#4c0519", "#881337", "#9f1239", "#be123c", "#fda4af", "#fff1f2"],
  },
];


const AI_PROMPTS = [
  "Instagram post for shoe sale",
  "Modern minimal logo for tech startup",
  "Dark event poster for music festival",
  "Clean business card for designer",
  "Bold social media quote card",
  "Product launch announcement banner",
];

export default function Sidebar({
  onAdd, activeTab, onTabChange, onLoadTemplate, onCanvasResize,
}: SidebarProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [templateCat, setTemplateCat] = useState("all");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [canvasPreset, setCanvasPreset] = useState("twitter-post");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      onAdd("image-url", { url });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => onAdd("image-url", { url: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const filteredTemplates = templateCat === "all"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === templateCat);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    // Simulate AI processing — match to nearest template
    await new Promise((r) => setTimeout(r, 1400));
    const keywords = aiPrompt.toLowerCase();
    let matched = TEMPLATES[0];
    if (keywords.includes("sale") || keywords.includes("promo")) matched = TEMPLATES.find((t) => t.id === "insta-sale") || matched;
    else if (keywords.includes("quote")) matched = TEMPLATES.find((t) => t.id === "insta-quote") || matched;
    else if (keywords.includes("logo")) matched = TEMPLATES.find((t) => t.id === "logo-wordmark") || matched;
    else if (keywords.includes("card") || keywords.includes("business")) matched = TEMPLATES.find((t) => t.id === "bcard-dark") || matched;
    else if (keywords.includes("event") || keywords.includes("poster")) matched = TEMPLATES.find((t) => t.id === "event-poster") || matched;
    else if (keywords.includes("banner")) matched = TEMPLATES.find((t) => t.id === "hero-banner") || matched;
    onLoadTemplate(matched.id);
    setAiLoading(false);
    setAiPrompt("");
  };

  const [imgAiLoading, setImgAiLoading] = useState(false);

  const handleGenerateAiImage = async () => {
    if (!aiPrompt.trim()) return;
    setImgAiLoading(true);
    try {
      // Pollinations.ai provides Stable Diffusion/Flux images entirely FREE with NO API key required!
      const seed = Math.floor(Math.random() * 999999);
      const imgUrl = `/api/image?prompt=${encodeURIComponent(aiPrompt.trim())}&width=1024&height=1024&seed=${seed}`;
      
      // Preload and verify the image is fetchable before sending to canvas
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Crucial to prevent canvas "tainting" so user can export!
        img.onload = resolve;
        img.onerror = reject;
        img.src = imgUrl;
      });

      // Place on canvas
      onAdd("image-url", { url: imgUrl });
      setAiPrompt("");
    } catch (err) {
      console.error("Failed to generate or load AI image:", err);
    } finally {
      setImgAiLoading(false);
    }
  };

  const handlePresetChange = (presetId: string) => {
    setCanvasPreset(presetId);
    const preset = CANVAS_PRESETS.find((p) => p.id === presetId);
    if (preset && onCanvasResize) onCanvasResize(preset.w, preset.h);
  };

  return (
    <aside className="flex h-full flex-shrink-0 select-none">
      {/* Icon rail — 50px */}
      <div className="w-[50px] h-full bg-[#111827] border-r border-white/[0.05] flex flex-col items-center pt-2 gap-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
            className={`relative flex flex-col items-center gap-1 w-[42px] py-2.5 rounded-xl transition-all duration-150 ${
              activeTab === tab.id
                ? "bg-indigo-600/20 text-indigo-400"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
            }`}
          >
            {activeTab === tab.id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-indigo-500 rounded-r-full" />
            )}
            <tab.icon className="w-[18px] h-[18px]" />
            <span className="text-[10px] font-bold uppercase tracking-wide leading-none">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Panel content — 196px */}
      <div className="w-[196px] h-full bg-[#111827]/90 border-r border-white/[0.05] overflow-y-auto flex flex-col">

        {/* ─── TEMPLATES TAB ─────────────────────────────── */}
        {activeTab === "templates" && (
          <div className="flex-1 flex flex-col">
            <div className="px-3 pt-3 pb-2">
              <Label>Templates</Label>
              {/* Canvas size preset */}
              <div className="mt-2 mb-3">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Canvas Size</p>
                <select
                  value={canvasPreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full bg-[#1e293b] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  {CANVAS_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label} ({p.w}×{p.h})</option>
                  ))}
                </select>
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-1 mb-3">
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setTemplateCat(cat.id)}
                    className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide transition-all ${
                      templateCat === cat.id
                        ? "bg-indigo-600 text-white"
                        : "bg-[#1e293b] text-slate-500 hover:text-slate-300 border border-white/[0.05]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-3 pb-4 space-y-2.5">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onLoadTemplate(template.id)}
                  className="w-full group relative rounded-xl overflow-hidden border border-white/[0.05] hover:border-indigo-500/40 transition-all ring-0 hover:ring-1 hover:ring-indigo-500/30"
                >
                  <div
                    className="w-full aspect-video flex items-center justify-center"
                    style={{ background: template.bg }}
                  >
                    <p
                      className="text-center font-bold text-sm px-3 leading-tight"
                      style={{ fontFamily: template.font, color: template.textColor, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                    >
                      {template.name}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-900/30 transition-all flex items-end p-2">
                    <span className="w-full text-center text-[9px] font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm rounded-md py-1">
                      Apply Template
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── TEXT TAB ──────────────────────────────────── */}
        {activeTab === "text" && (
          <div className="p-3 space-y-2">
            <Label>Text Styles</Label>
            <TextStyleBtn
              onClick={() => onAdd("text-heading")}
              size="2xl"
              weight="font-black"
              label="Heading"
              sublabel="72px · Black"
              color="text-white"
            />
            <TextStyleBtn
              onClick={() => onAdd("text-sub")}
              size="xl"
              weight="font-bold"
              label="Subheading"
              sublabel="36px · Bold"
              color="text-slate-200"
            />
            <TextStyleBtn
              onClick={() => onAdd("text-body")}
              size="base"
              weight="font-normal"
              label="Body text"
              sublabel="18px · Regular"
              color="text-slate-400"
            />

            <div className="pt-2">
              <Label>Color Palettes</Label>
              <div className="space-y-2 mt-2">
                {COLOR_PALETTES.map((palette) => (
                  <div key={palette.name}>
                    <p className="text-[9px] font-semibold text-slate-600 mb-1">{palette.name}</p>
                    <div className="flex gap-1">
                      {palette.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => onAdd("rect", { fill: c, width: 200, height: 120 })}
                          title={c}
                          className="flex-1 h-6 rounded-md border border-white/[0.06] hover:scale-110 hover:z-10 transition-transform"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── SHAPES / ELEMENTS TAB ─────────────────────── */}
        {activeTab === "shapes" && (
          <div className="p-3 space-y-3">
            <Label>Basic Shapes</Label>
            <div className="grid grid-cols-2 gap-2">
              <ShapeBtn onClick={() => onAdd("rect")} label="Rectangle">
                <div className="w-9 h-6 rounded-md bg-indigo-500/80" />
              </ShapeBtn>
              <ShapeBtn onClick={() => onAdd("circle")} label="Circle">
                <div className="w-7 h-7 rounded-full bg-slate-400/80" />
              </ShapeBtn>
              <ShapeBtn onClick={() => onAdd("triangle")} label="Triangle">
                <div className="w-0 h-0" style={{ borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderBottom: "24px solid #94a3b8" }} />
              </ShapeBtn>
              <ShapeBtn onClick={() => onAdd("line")} label="Line">
                <div className="w-9 h-0.5 bg-slate-400 rounded" />
              </ShapeBtn>
            </div>

            <Label>Decorative</Label>
            <div className="grid grid-cols-2 gap-2">
              <ShapeBtn onClick={() => onAdd("star")} label="Star">
                <Star className="w-7 h-7 text-slate-400" fill="#94a3b8" />
              </ShapeBtn>
              <ShapeBtn onClick={() => onAdd("rect", { rx: 100, ry: 100, width: 180, height: 60 })} label="Pill">
                <div className="w-10 h-5 rounded-full bg-slate-400/80" />
              </ShapeBtn>
            </div>

            <Label>Quick Badges</Label>
            <div className="space-y-1.5">
              {[
                { label: "NEW", fill: "#6366f1" },
                { label: "SALE", fill: "#dc2626" },
                { label: "POPULAR", fill: "#0ea5e9" },
                { label: "LIMITED", fill: "#d97706" },
              ].map((badge) => (
                <button
                  key={badge.label}
                  onClick={() => onAdd("rect", {
                    width: 160, height: 48, rx: 8, ry: 8, fill: badge.fill,
                  })}
                  className="flex items-center justify-center w-full h-8 rounded-lg border border-white/[0.05] hover:border-indigo-500/30 bg-[#1e293b] transition-all text-[11px] font-black text-white tracking-widest"
                  style={{ background: badge.fill + "22", borderColor: badge.fill + "44" }}
                >
                  <span style={{ color: badge.fill }}>{badge.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── IMAGES TAB ────────────────────────────────── */}
        {activeTab === "images" && (
          <div className="p-3 space-y-4">
            <Label>Upload Image</Label>

            {/* Drag & Drop */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-indigo-500/40 bg-[#1e293b]/50 hover:bg-[#1e293b] cursor-pointer transition-all group"
            >
              <Upload className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">Upload Image</p>
                <p className="text-[9px] text-slate-600 mt-0.5">PNG, JPG, WEBP · or drag & drop</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>

            {/* URL Input */}
            <div className="space-y-1.5">
              <Label>From URL</Label>
              <div className="flex gap-1">
                <div className="flex-1 relative">
                  <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-600" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && imageUrl) {
                        onAdd("image-url", { url: imageUrl });
                        setImageUrl("");
                      }
                    }}
                    placeholder="https://..."
                    className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-[#1e293b] border border-white/[0.06] text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <button
                  onClick={() => { if (imageUrl) { onAdd("image-url", { url: imageUrl }); setImageUrl(""); } }}
                  className="px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Stock Photos */}
            <div className="space-y-2">
              <Label>Stock Photos</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {STOCK_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    onClick={() => onAdd("image-url", { url: img.url })}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-white/[0.05] hover:border-indigo-500/40 transition-all"
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[8px] font-bold text-white text-center">{img.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── AI TAB ────────────────────────────────────── */}
        {activeTab === "ai" && (
          <div className="p-3 space-y-4">
            <div>
              <Label>AI Design Generator</Label>
              <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                Describe what you want to create and AI will generate a design for you.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Instagram post for shoe sale with dark theme..."
                rows={3}
                className="w-full bg-[#1e293b] border border-white/[0.06] rounded-xl px-3 py-2.5 text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none leading-relaxed"
              />
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={handleGenerateAiImage}
                  disabled={!aiPrompt.trim() || imgAiLoading || aiLoading}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-bold transition-all"
                >
                  {imgAiLoading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Image…
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3.5 h-3.5" />
                      Generate AI Image (No Key)
                    </>
                  )}
                </button>
                <button
                  onClick={handleAiGenerate}
                  disabled={!aiPrompt.trim() || aiLoading || imgAiLoading}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] disabled:opacity-40 disabled:cursor-not-allowed border border-white/[0.05] text-slate-300 text-[11px] font-bold transition-all"
                >
                  {aiLoading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-slate-400 border-t-slate-200 rounded-full animate-spin" />
                      Finding Template…
                    </>
                  ) : (
                    <>
                      <LayoutTemplate className="w-3.5 h-3.5" />
                      Generate Layout Template
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Quick Prompts</p>
              {AI_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setAiPrompt(prompt)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-[#1e293b] hover:bg-[#1e293b]/80 border border-white/[0.04] hover:border-indigo-500/30 text-[10px] text-slate-400 hover:text-white transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-white/[0.05] bg-[#1e293b]/50 p-3 space-y-2">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">AI Suggestions</p>
              <div className="space-y-1.5 text-[10px] text-slate-500">
                <p>💡 Be specific about colors, style, and audience</p>
                <p>💡 Mention platform (Instagram, Facebook, etc.)</p>
                <p>💡 Include brand elements for consistency</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ─── Sub-components ───────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em]">{children}</p>
  );
}

function TextStyleBtn({
  onClick, size, weight, label, sublabel, color,
}: {
  onClick: () => void;
  size: string;
  weight: string;
  label: string;
  sublabel: string;
  color: string;
}) {
  const sizeMap: Record<string, string> = {
    "2xl": "text-2xl",
    "xl": "text-xl",
    "base": "text-base",
  };
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-3 rounded-xl bg-[#1e293b] hover:bg-[#1e293b]/60 border border-white/[0.04] hover:border-indigo-500/30 transition-all group"
    >
      <p className={`${sizeMap[size] || "text-base"} ${weight} ${color} group-hover:text-indigo-300 transition-colors leading-none`}>{label}</p>
      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide font-semibold">{sublabel}</p>
    </button>
  );
}

function ShapeBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2.5 py-4 rounded-xl bg-[#1e293b] hover:bg-[#1e293b]/60 border border-white/[0.04] hover:border-indigo-500/30 transition-all group"
    >
      {children}
      <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-200 transition-colors uppercase tracking-wide">
        {label}
      </span>
    </button>
  );
}

const STOCK_IMAGES = [
  { label: "Abstract",  url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400" },
  { label: "Minimal",   url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400" },
  { label: "Texture",   url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400" },
  { label: "Gradient",  url: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400" },
  { label: "Nature",    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400" },
  { label: "Dark",      url: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=400" },
  { label: "Bokeh",     url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
  { label: "City",      url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400" },
];
