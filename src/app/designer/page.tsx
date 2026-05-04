"use client";

import { useRef, useState, useCallback } from "react";
import { FabricObject } from "fabric";
import dynamic from "next/dynamic";
import type { CanvasHandle } from "@/components/designer/CanvasEditor";
import Sidebar from "@/components/designer/Sidebar";
import PropertiesPanel from "@/components/designer/PropertiesPanel";
import DesignerNavbar from "@/components/designer/Navbar";

type WorkspaceBg = "dark" | "light" | "white" | "grid";

// Skip SSR for Fabric.js
const CanvasEditor = dynamic(
  () => import("@/components/designer/CanvasEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-[#0f172a]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
            </div>
            <div className="absolute -inset-2 rounded-3xl border border-indigo-500/20 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">Initialising Canvas</p>
            <div className="flex gap-1 mt-2 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

export default function DesignerPage() {
  const editorRef    = useRef<CanvasHandle>(null);
  const [selected,   setSelected]   = useState<FabricObject | null>(null);
  const [layers,     setLayers]     = useState<FabricObject[]>([]);
  const [canUndo,    setCanUndo]    = useState(false);
  const [canRedo,    setCanRedo]    = useState(false);
  const [zoom,       setZoom]       = useState(0.65);
  const [activeTab,  setActiveTab]  = useState("templates");
  const [projectName, setProjectName] = useState("Untitled Design");
  const [workspaceBg, setWorkspaceBg] = useState<WorkspaceBg>("dark");

  const handleSelectionChange = useCallback((obj: FabricObject | null) => {
    setSelected(obj);
  }, []);

  const handleHistoryChange = useCallback((undo: boolean, redo: boolean) => {
    setCanUndo(undo);
    setCanRedo(redo);
  }, []);

  const handleLayersChange = useCallback((ls: FabricObject[]) => {
    setLayers(ls);
  }, []);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', 'Space Grotesk', system-ui, sans-serif" }}
    >
      {/* Navbar */}
      <DesignerNavbar
        onExport={(fmt) => editorRef.current?.exportCanvas(fmt as "png" | "jpeg")}
        onUndo={() => editorRef.current?.undo()}
        onRedo={() => editorRef.current?.redo()}
        onClear={() => editorRef.current?.clearCanvas()}
        onZoom={(delta) => editorRef.current?.setZoom(delta)}
        onZoomReset={() => editorRef.current?.resetZoom()}
        onAIAssist={() => setActiveTab("ai")}
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        workspaceBg={workspaceBg}
        onWorkspaceBgChange={setWorkspaceBg}
        onSetCanvasBg={(color) => editorRef.current?.setCanvasBackground(color)}
      />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          onAdd={(type, payload) => editorRef.current?.addObject(type, payload)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLoadTemplate={(id) => editorRef.current?.loadTemplate(id)}
          onCanvasResize={(w, h) => editorRef.current?.resizeCanvas(w, h)}
        />

        {/* Canvas — passes workspaceBg for environment rendering */}
        <CanvasEditor
          ref={editorRef}
          onSelectionChange={handleSelectionChange}
          onHistoryChange={handleHistoryChange}
          onLayersChange={handleLayersChange}
          onZoomChange={setZoom}
          workspaceBg={workspaceBg}
        />

        {/* Right Properties Panel */}
        <PropertiesPanel
          selected={selected}
          layers={layers}
          onDelete={() => editorRef.current?.deleteSelected()}
          onBringForward={() => editorRef.current?.bringForward()}
          onSendBackward={() => editorRef.current?.sendBackward()}
          onUpdate={(p, v) => editorRef.current?.updateSelected(p, v)}
          onSelectLayer={(obj) => editorRef.current?.selectObject(obj)}
        />
      </div>
    </div>
  );
}
