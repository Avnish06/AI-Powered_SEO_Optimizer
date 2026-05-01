"use client";

import { TEMPLATES } from "./templates";
import { Sparkles } from "lucide-react";

interface TemplatePanelProps {
  onLoad: (templateId: string) => void;
}

export default function TemplatePanel({ onLoad }: TemplatePanelProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
          Templates
        </p>
      </div>
      <div className="space-y-3">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onLoad(template.id)}
            className="w-full group relative rounded-2xl overflow-hidden border border-white/[0.04] hover:border-indigo-500/30 transition-all"
          >
            <div
              className="w-full aspect-[16/9] flex items-center justify-center"
              style={{ background: template.bg }}
            >
              <p
                className="text-center font-black text-white text-sm px-3 leading-tight"
                style={{ fontFamily: template.font, color: template.textColor }}
              >
                {template.name}
              </p>
            </div>
            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-all flex items-end p-2">
              <span className="w-full text-center text-[9px] font-black text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-lg py-1.5">
                Use Template
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
