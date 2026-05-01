"use client";

import {
  useEffect, useRef, forwardRef, useImperativeHandle, useCallback,
} from "react";
import {
  Canvas, Rect, Circle, Triangle, Line, IText,
  FabricImage, FabricObject, Polygon,
} from "fabric";
import { TEMPLATES } from "./templates";

export interface CanvasHandle {
  addObject: (type: string, payload?: Record<string, unknown>) => void;
  deleteSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  updateSelected: (prop: string, value: unknown) => void;
  exportCanvas: (format: "png" | "jpeg") => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  loadTemplate: (id: string) => void;
  setZoom: (delta: number) => void;
  resetZoom: () => void;
  getLayers: () => FabricObject[];
  selectObject: (obj: FabricObject) => void;
  resizeCanvas: (w: number, h: number) => void;
  setCanvasBackground: (color: string) => void;
}

interface CanvasEditorProps {
  onSelectionChange: (obj: FabricObject | null) => void;
  onHistoryChange: (canUndo: boolean, canRedo: boolean) => void;
  onLayersChange: (layers: FabricObject[]) => void;
  onZoomChange: (zoom: number) => void;
  workspaceBg?: "dark" | "light" | "white" | "grid";
}

const HISTORY_LIMIT = 60;
const DEFAULT_W = 1200;
const DEFAULT_H = 675;

// Build a star polygon
function makeStar(cx: number, cy: number, outerR: number, innerR: number, points = 5) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    pts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  return new Polygon(pts, {
    left: cx, top: cy, originX: "center", originY: "center",
    fill: "#f59e0b",
  });
}

const CanvasEditor = forwardRef<CanvasHandle, CanvasEditorProps>(
  ({ onSelectionChange, onHistoryChange, onLayersChange, onZoomChange, workspaceBg = "dark" }, ref) => {
    const containerRef  = useRef<HTMLDivElement>(null);
    const canvasElRef   = useRef<HTMLCanvasElement>(null);
    const fabricRef     = useRef<Canvas | null>(null);
    const historyRef    = useRef<string[]>([]);
    const historyIdxRef = useRef<number>(-1);
    const pauseHistRef  = useRef(false);
    const zoomRef       = useRef(0.65);
    const canvasDimRef  = useRef({ w: DEFAULT_W, h: DEFAULT_H });
    const clipRef       = useRef<string | null>(null);

    // ─── Helpers ────────────────────────────────────────────────
    const notifyLayers = useCallback((canvas: Canvas) => {
      onLayersChange([...canvas.getObjects()]);
    }, [onLayersChange]);

    const notifyHistory = useCallback(() => {
      onHistoryChange(
        historyIdxRef.current > 0,
        historyIdxRef.current < historyRef.current.length - 1,
      );
    }, [onHistoryChange]);

    const saveHistory = useCallback(() => {
      if (pauseHistRef.current || !fabricRef.current) return;
      const json = JSON.stringify(fabricRef.current.toJSON());
      historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
      historyRef.current.push(json);
      if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift();
      historyIdxRef.current = historyRef.current.length - 1;
      notifyHistory();
      notifyLayers(fabricRef.current);
    }, [notifyHistory, notifyLayers]);

    const restoreHistory = useCallback((json: string) => {
      if (!fabricRef.current) return;
      pauseHistRef.current = true;
      fabricRef.current.loadFromJSON(JSON.parse(json)).then(() => {
        fabricRef.current!.renderAll();
        pauseHistRef.current = false;
        notifyHistory();
        notifyLayers(fabricRef.current!);
        onSelectionChange(null);
      });
    }, [notifyHistory, notifyLayers, onSelectionChange]);

    const rescale = useCallback(() => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const { w, h } = canvasDimRef.current;
      const scale = Math.min(width / w, height / h) * 0.88 * zoomRef.current;
      const wrapper = canvasElRef.current?.parentElement as HTMLElement | null;
      if (wrapper) {
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.transformOrigin = "center center";
      }
    }, []);

    // ─── Init ───────────────────────────────────────────────────
    useEffect(() => {
      if (!canvasElRef.current || fabricRef.current) return;

      const canvas = new Canvas(canvasElRef.current, {
        width: DEFAULT_W,
        height: DEFAULT_H,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        selection: true,
      });
      fabricRef.current = canvas;
      canvasDimRef.current = { w: DEFAULT_W, h: DEFAULT_H };

      // Initial history
      const init = JSON.stringify(canvas.toJSON());
      historyRef.current = [init];
      historyIdxRef.current = 0;
      notifyHistory();

      // Selection events
      canvas.on("selection:created",  () => onSelectionChange(canvas.getActiveObject() || null));
      canvas.on("selection:updated",  () => onSelectionChange(canvas.getActiveObject() || null));
      canvas.on("selection:cleared",  () => onSelectionChange(null));

      // History triggers
      canvas.on("object:added",    saveHistory);
      canvas.on("object:removed",  saveHistory);
      canvas.on("object:modified", saveHistory);

      // Keyboard shortcuts
      const onKey = (e: KeyboardEvent) => {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        const c = fabricRef.current;
        if (!c) return;

        if (e.key === "Delete" || e.key === "Backspace") {
          const active = c.getActiveObject();
          if (active) {
            c.remove(active);
            c.discardActiveObject();
            c.renderAll();
            onSelectionChange(null);
          }
        }

        if (e.ctrlKey || e.metaKey) {
          if (e.key === "z") { e.preventDefault(); performUndo(); }
          if (e.key === "y") { e.preventDefault(); performRedo(); }
          if (e.key === "c") {
            const active = c.getActiveObject();
            if (active) {
              active.clone().then((cloned: FabricObject) => {
                clipRef.current = JSON.stringify(cloned.toJSON());
              });
            }
          }
          if (e.key === "v") {
            if (!clipRef.current) return;
            const parsed = JSON.parse(clipRef.current);
            if (parsed.type === "i-text") {
              const t = new IText(parsed.text || "", {
                ...parsed, left: (parsed.left || 100) + 20, top: (parsed.top || 100) + 20,
              });
              c.add(t); c.setActiveObject(t); c.renderAll();
            } else if (parsed.type === "rect") {
              const r = new Rect({ ...parsed, left: (parsed.left || 100) + 20, top: (parsed.top || 100) + 20 });
              c.add(r); c.setActiveObject(r); c.renderAll();
            } else if (parsed.type === "circle") {
              const r = new Circle({ ...parsed, left: (parsed.left || 100) + 20, top: (parsed.top || 100) + 20 });
              c.add(r); c.setActiveObject(r); c.renderAll();
            }
          }
          // Duplicate: Ctrl+D
          if (e.key === "d") {
            e.preventDefault();
            const active = c.getActiveObject();
            if (active) {
              active.clone().then((cloned: FabricObject) => {
                (cloned as any).set({ left: (active.left || 0) + 20, top: (active.top || 0) + 20 });
                c.add(cloned);
                c.setActiveObject(cloned);
                c.renderAll();
              });
            }
          }
        }

        // Arrow keys for nudging
        const nudgeAmt = e.shiftKey ? 10 : 1;
        const active = c.getActiveObject();
        if (active) {
          if (e.key === "ArrowLeft")  { active.set("left", (active.left || 0) - nudgeAmt); c.renderAll(); }
          if (e.key === "ArrowRight") { active.set("left", (active.left || 0) + nudgeAmt); c.renderAll(); }
          if (e.key === "ArrowUp")    { active.set("top",  (active.top  || 0) - nudgeAmt); c.renderAll(); }
          if (e.key === "ArrowDown")  { active.set("top",  (active.top  || 0) + nudgeAmt); c.renderAll(); }
        }
      };
      window.addEventListener("keydown", onKey);

      return () => {
        window.removeEventListener("keydown", onKey);
        canvas.dispose();
        fabricRef.current = null;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Observe container resize ────────────────────────────────
    useEffect(() => {
      rescale();
      const ro = new ResizeObserver(rescale);
      if (containerRef.current) ro.observe(containerRef.current);
      return () => ro.disconnect();
    }, [rescale]);

    // ─── Undo / Redo internal ────────────────────────────────────
    const performUndo = () => {
      if (historyIdxRef.current <= 0) return;
      historyIdxRef.current--;
      restoreHistory(historyRef.current[historyIdxRef.current]);
    };
    const performRedo = () => {
      if (historyIdxRef.current >= historyRef.current.length - 1) return;
      historyIdxRef.current++;
      restoreHistory(historyRef.current[historyIdxRef.current]);
    };

    // ─── Exposed API ─────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      getLayers: () => fabricRef.current ? [...fabricRef.current.getObjects()] : [],

      selectObject: (obj) => {
        const c = fabricRef.current;
        if (!c) return;
        c.setActiveObject(obj);
        c.renderAll();
        onSelectionChange(obj);
      },

      addObject(type, payload = {}) {
        const c = fabricRef.current;
        if (!c) return;
        const { w, h } = canvasDimRef.current;
        const cx = w / 2;
        const cy = h / 2;
        const center = { left: cx, top: cy, originX: "center" as const, originY: "center" as const };

        let obj: FabricObject | null = null;

        if (type === "text-heading") {
          obj = new IText("Heading", { ...center, fontFamily: "Space Grotesk", fontSize: 72, fontWeight: "900", fill: "#1e293b" });
        } else if (type === "text-sub") {
          obj = new IText("Subheading", { ...center, fontFamily: "Space Grotesk", fontSize: 36, fontWeight: "700", fill: "#334155" });
        } else if (type === "text-body") {
          obj = new IText("Body text — click to edit.", { ...center, fontFamily: "Inter", fontSize: 20, fontWeight: "400", fill: "#64748b" });
        } else if (type === "rect") {
          obj = new Rect({ ...center, width: 220, height: 140, rx: 12, ry: 12, fill: "#6366f1", ...(payload as any) });
        } else if (type === "circle") {
          obj = new Circle({ ...center, radius: 80, fill: "#475569", ...(payload as any) });
        } else if (type === "triangle") {
          obj = new Triangle({ ...center, width: 160, height: 140, fill: "#64748b", ...(payload as any) });
        } else if (type === "line") {
          obj = new Line([0, 0, 300, 0], {
            left: cx - 150, top: cy,
            stroke: "#64748b", strokeWidth: 3,
            selectable: true,
          });
        } else if (type === "star") {
          obj = makeStar(cx, cy, 100, 50);
        } else if (type === "image-url") {
          const url = payload.url as string;
          if (!url) return;
          FabricImage.fromURL(url, { crossOrigin: "anonymous" })
            .then((img) => {
              img.scaleToWidth(Math.min(400, w * 0.4));
              img.set({ left: cx, top: cy, originX: "center", originY: "center" });
              c.add(img);
              c.setActiveObject(img);
              c.renderAll();
              onSelectionChange(img);
            })
            .catch(() => console.warn("Failed to load image:", url));
          return;
        }

        if (obj) {
          c.add(obj);
          c.setActiveObject(obj);
          c.renderAll();
          onSelectionChange(obj);
        }
      },

      deleteSelected() {
        const c = fabricRef.current;
        if (!c) return;
        const active = c.getActiveObject();
        if (!active) return;
        c.remove(active);
        c.discardActiveObject();
        c.renderAll();
        onSelectionChange(null);
      },

      bringForward() {
        const c = fabricRef.current;
        const a = c?.getActiveObject();
        if (!c || !a) return;
        c.bringObjectForward(a);
        c.renderAll();
      },

      sendBackward() {
        const c = fabricRef.current;
        const a = c?.getActiveObject();
        if (!c || !a) return;
        c.sendObjectBackwards(a);
        c.renderAll();
      },

      updateSelected(prop, value) {
        const c = fabricRef.current;
        const a = c?.getActiveObject();
        if (!c || !a) return;
        (a as any).set(prop, value);
        c.renderAll();
        onSelectionChange(a);
      },

      exportCanvas(format) {
        const c = fabricRef.current;
        if (!c) return;
        const dataUrl = c.toDataURL({ format, multiplier: 2 });
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `design-${Date.now()}.${format === "jpeg" ? "jpg" : "png"}`;
        a.click();
      },

      undo: performUndo,
      redo: performRedo,

      clearCanvas() {
        const c = fabricRef.current;
        if (!c) return;
        c.clear();
        c.backgroundColor = "#ffffff";
        c.renderAll();
        onSelectionChange(null);
        saveHistory();
      },

      loadTemplate(id) {
        const c = fabricRef.current;
        if (!c) return;
        const tpl = TEMPLATES.find((t) => t.id === id);
        if (!tpl) return;
        pauseHistRef.current = true;
        c.loadFromJSON(tpl.data).then(() => {
          c.renderAll();
          pauseHistRef.current = false;
          saveHistory();
          onSelectionChange(null);
        });
      },

      setZoom(delta) {
        zoomRef.current = Math.max(0.15, Math.min(4, zoomRef.current + delta));
        onZoomChange(zoomRef.current);
        rescale();
      },

      resetZoom() {
        zoomRef.current = 0.65;
        onZoomChange(zoomRef.current);
        rescale();
      },

      resizeCanvas(w, h) {
        const c = fabricRef.current;
        if (!c) return;
        // Fabric.js v7 uses setDimensions
        c.setDimensions({ width: w, height: h });
        canvasDimRef.current = { w, h };
        c.renderAll();
        rescale();
      },

      setCanvasBackground(color: string) {
        const c = fabricRef.current;
        if (!c) return;
        c.backgroundColor = color;
        c.renderAll();
        saveHistory();
      },
    }));

    // Flat, non-glowing workspace backgrounds
    const wsStyles: Record<string, React.CSSProperties> = {
      dark:  { background: "#1b2133" },
      light: { background: "#e8ecf2" },
      white: { background: "#eff1f4" },
      grid:  { background: "#181f2e" },
    };


    return (
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden relative select-none"
        style={wsStyles[workspaceBg] || wsStyles.dark}
      >
        {/* Canvas — pure flat background, clean shadow only */}
        <div
          className="rounded-md overflow-hidden"
          style={{
            width: canvasDimRef.current.w,
            height: canvasDimRef.current.h,
            boxShadow: workspaceBg === "light" || workspaceBg === "white"
              ? "0 2px 16px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.10)"
              : "0 4px 20px rgba(0,0,0,0.40), 0 1px 4px rgba(0,0,0,0.20)",
          }}
        >
          <canvas ref={canvasElRef} />
        </div>

        {/* Size label */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-3 py-1 rounded-full border tracking-widest"
          style={workspaceBg === "light" || workspaceBg === "white"
            ? { color: "#64748b", background: "rgba(255,255,255,0.9)", borderColor: "rgba(0,0,0,0.08)" }
            : { color: "#64748b", background: "rgba(0,0,0,0.40)", borderColor: "rgba(255,255,255,0.08)" }
          }
        >
          {canvasDimRef.current.w} × {canvasDimRef.current.h}
        </div>
      </div>
    );
  }
);

CanvasEditor.displayName = "CanvasEditor";
export default CanvasEditor;

