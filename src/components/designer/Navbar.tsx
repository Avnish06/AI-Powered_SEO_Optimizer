"use client";

import {
  Download, Undo2, Redo2, Trash2, Sparkles,
  ZoomIn, ZoomOut, Share2, ChevronDown, Save,
  Wand2, Grid3X3,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

type WorkspaceBg = "dark" | "light" | "white" | "grid";

interface NavbarProps {
  onExport: (format: "png" | "jpeg") => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onZoom: (delta: number) => void;
  onZoomReset: () => void;
  onAIAssist?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  projectName?: string;
  onProjectNameChange?: (name: string) => void;
  workspaceBg: WorkspaceBg;
  onWorkspaceBgChange: (bg: WorkspaceBg) => void;
  onSetCanvasBg: (color: string) => void;
}

const WORKSPACE_OPTIONS: { id: WorkspaceBg; label: string; dot: string; tip: string }[] = [
  { id: "dark",  label: "Dark",  dot: "#0f172a", tip: "Dark workspace" },
  { id: "light", label: "Light", dot: "#dde3ee", tip: "Light workspace" },
  { id: "white", label: "Flat",  dot: "#f0f2f5", tip: "Flat white workspace" },
  { id: "grid",  label: "Grid",  dot: "#111827", tip: "Grid workspace" },
];

const CANVAS_BG_PRESETS = [
  { label: "White",     color: "#ffffff" },
  { label: "Off-white", color: "#fafaf9" },
  { label: "Light",     color: "#f1f5f9" },
  { label: "Slate",     color: "#1e293b" },
  { label: "Dark",      color: "#0f172a" },
  { label: "Black",     color: "#000000" },
];

export default function DesignerNavbar({
  onExport, onUndo, onRedo, onClear, onZoom, onZoomReset, onAIAssist,
  canUndo, canRedo, zoom,
  projectName = "Untitled Design",
  onProjectNameChange,
  workspaceBg,
  onWorkspaceBgChange,
  onSetCanvasBg,
}: NavbarProps) {
  const [exportOpen, setExportOpen]     = useState(false);
  const [bgOpen, setBgOpen]             = useState(false);
  const [editingName, setEditingName]   = useState(false);
  const [nameVal, setNameVal]           = useState(projectName);
  const [saved, setSaved]               = useState(false);
  const dropRef    = useRef<HTMLDivElement>(null);
  const bgDropRef  = useRef<HTMLDivElement>(null);
  const nameRef    = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))  setExportOpen(false);
      if (bgDropRef.current && !bgDropRef.current.contains(e.target as Node)) setBgOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNameBlur = () => {
    setEditingName(false);
    if (nameVal.trim()) onProjectNameChange?.(nameVal.trim());
    else setNameVal(projectName);
  };

  const handleShare = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
  };

  return (
    <header className="h-[48px] bg-[#131b2a] border-b border-white/[0.06] flex items-center justify-between px-4 z-50 flex-shrink-0 gap-3">

      {/* ── Brand + Project Name ── */}
      <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
        {/* Logo mark */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-[9px] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Wand2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13px] font-black text-white tracking-tight hidden sm:block">
            DesignAI
          </span>
        </div>

        <div className="w-px h-5 bg-white/[0.07] flex-shrink-0" />

        {/* Project name editable */}
        <div className="min-w-0">
          {editingName ? (
            <input
              ref={nameRef}
              value={nameVal}
              onChange={(e) => setNameVal(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={(e) => { if (e.key === "Enter") nameRef.current?.blur(); }}
              className="text-[12px] font-semibold text-white bg-transparent border-b border-indigo-500 focus:outline-none max-w-[160px]"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="text-[12px] font-semibold text-slate-400 hover:text-white transition-colors truncate max-w-[160px] text-left"
              title="Rename project"
            >
              {nameVal}
            </button>
          )}
        </div>

        {/* Save indicator */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
            saved
              ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
              : "text-slate-600 hover:text-slate-300 border border-transparent"
          }`}
        >
          <Save className="w-3 h-3" />
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* ── Center Controls ── */}
      <div className="flex items-center gap-1.5">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-[#1a2234] border border-white/[0.06] rounded-lg p-0.5">
          <NavBtn onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <Undo2 className="w-3.5 h-3.5" />
          </NavBtn>
          <NavBtn onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            <Redo2 className="w-3.5 h-3.5" />
          </NavBtn>
        </div>

        <div className="w-px h-5 bg-white/[0.06]" />

        {/* Zoom */}
        <div className="flex items-center gap-0.5 bg-[#1a2234] border border-white/[0.06] rounded-lg p-0.5">
          <NavBtn onClick={() => onZoom(-0.1)} title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </NavBtn>
          <button
            onClick={onZoomReset}
            title="Reset zoom"
            className="px-2 text-[11px] font-black text-slate-400 hover:text-white tabular-nums w-10 text-center transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>
          <NavBtn onClick={() => onZoom(0.1)} title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </NavBtn>
        </div>

        <div className="w-px h-5 bg-white/[0.06]" />

        {/* ── Workspace Background Switcher ── */}
        <div className="relative" ref={bgDropRef}>
          <button
            onClick={() => setBgOpen((o) => !o)}
            title="Workspace theme"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
              bgOpen
                ? "bg-white/[0.08] border-white/[0.12] text-slate-200"
                : "bg-transparent border-white/[0.06] text-slate-500 hover:text-slate-200 hover:border-white/[0.10]"
            }`}
          >
            {/* Current bg dot */}
            <span
              className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0"
              style={{ background: WORKSPACE_OPTIONS.find((o) => o.id === workspaceBg)?.dot }}
            />
            <span className="hidden md:block">Workspace</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${bgOpen ? "rotate-180" : ""}`} />
          </button>

          {bgOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-[260px] bg-[#131c2e] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/60 p-3 z-[200]">

              {/* Workspace environment */}
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Workspace</p>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {WORKSPACE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { onWorkspaceBgChange(opt.id); }}
                    title={opt.tip}
                    className={`flex flex-col items-center gap-1.5 py-2 rounded-lg border transition-all ${
                      workspaceBg === opt.id
                        ? "border-indigo-500/60 bg-indigo-600/15"
                        : "border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-md border border-white/[0.12] flex-shrink-0"
                      style={{ background: opt.dot }}
                    >
                      {opt.id === "grid" && (
                        <Grid3X3 className="w-4 h-4 text-slate-600 m-1.5" />
                      )}
                    </span>
                    <span className={`text-[8px] font-bold ${workspaceBg === opt.id ? "text-indigo-400" : "text-slate-600"}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Canvas background */}
              <div className="h-px bg-white/[0.05] mb-3" />
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Canvas Background</p>
              <div className="flex gap-1.5 flex-wrap">
                {CANVAS_BG_PRESETS.map((bg) => (
                  <button
                    key={bg.color}
                    onClick={() => { onSetCanvasBg(bg.color); setBgOpen(false); }}
                    title={bg.label}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <span
                      className="w-9 h-6 rounded-md border border-white/[0.12] group-hover:ring-2 group-hover:ring-indigo-500/50 transition-all"
                      style={{ background: bg.color }}
                    />
                    <span className="text-[8px] text-slate-600 group-hover:text-slate-400 transition-colors">{bg.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Actions ── */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* AI Assist */}
        <button
          onClick={onAIAssist}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/25 bg-indigo-500/8 hover:bg-indigo-500/15 text-indigo-400 hover:text-indigo-300 text-[11px] font-bold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:block">AI Assist</span>
        </button>

        {/* Clear */}
        <button
          onClick={onClear}
          title="Clear canvas"
          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/15 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          title="Copy link"
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/[0.05] border border-transparent transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Export Dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setExportOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold tracking-wide transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30"
          >
            <Download className="w-3.5 h-3.5" />
            Export
            <ChevronDown className={`w-3 h-3 transition-transform ${exportOpen ? "rotate-180" : ""}`} />
          </button>

          {exportOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#131c2e] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50 p-1.5 z-[200]">
              <p className="px-3 pt-1 pb-1.5 text-[9px] font-black text-slate-600 uppercase tracking-widest">Format</p>
              {(["png", "jpeg"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => { onExport(fmt); setExportOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all text-left"
                >
                  <span className="px-1.5 py-0.5 rounded-md bg-[#0b1120] text-[9px] font-black text-indigo-400 uppercase">{fmt}</span>
                  Export as {fmt.toUpperCase()}
                </button>
              ))}
              <div className="h-px bg-white/[0.05] my-1" />
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] text-slate-600 text-left cursor-not-allowed">
                <span className="px-1.5 py-0.5 rounded-md bg-[#0b1120] text-[9px] font-black text-slate-600 uppercase">pdf</span>
                Export as PDF
                <span className="ml-auto text-[8px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">Soon</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavBtn({
  children, onClick, disabled, title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
    >
      {children}
    </button>
  );
}
