// Templates for the designer — JSON-based canvas layouts

export interface Template {
  id: string;
  name: string;
  category: "social" | "poster" | "logo" | "business-card" | "banner" | "presentation";
  bg: string;
  font: string;
  textColor: string;
  data: object; // Fabric.js JSON
}

export const TEMPLATE_CATEGORIES = [
  { id: "all",           label: "All" },
  { id: "social",        label: "Social" },
  { id: "poster",        label: "Poster" },
  { id: "logo",          label: "Logo" },
  { id: "business-card", label: "Card" },
  { id: "banner",        label: "Banner" },
  { id: "presentation",  label: "Slides" },
];

export const CANVAS_PRESETS = [
  { id: "instagram-post",   label: "Instagram Post",   w: 1080, h: 1080 },
  { id: "instagram-story",  label: "Instagram Story",  w: 1080, h: 1920 },
  { id: "twitter-post",     label: "Twitter Post",     w: 1200, h: 675 },
  { id: "facebook-cover",   label: "Facebook Cover",   w: 1640, h: 856 },
  { id: "linkedin-banner",  label: "LinkedIn Banner",  w: 1584, h: 396 },
  { id: "presentation",     label: "Presentation",     w: 1920, h: 1080 },
  { id: "business-card",    label: "Business Card",    w: 1050, h: 600 },
  { id: "poster-a4",        label: "A4 Poster",        w: 794,  h: 1123 },
  { id: "custom",           label: "Custom Size",      w: 1200, h: 675 },
];

export const TEMPLATES: Template[] = [
  // ─── SOCIAL ──────────────────────────────────────────────────
  {
    id: "insta-sale",
    name: "Sale Post",
    category: "social",
    bg: "linear-gradient(135deg, #1e293b 0%, #312e81 100%)",
    font: "Space Grotesk",
    textColor: "#ffffff",
    data: {
      version: "5.3.0",
      background: "#1e293b",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 1080, height: 1080,
          fill: "#1e293b", selectable: false, evented: false,
        },
        {
          type: "rect", left: 540, top: 540,
          width: 900, height: 900, rx: 48, ry: 48,
          fill: "rgba(99,102,241,0.10)",
          originX: "center", originY: "center",
        },
        {
          type: "rect", left: 540, top: 380,
          width: 240, height: 64, rx: 32, ry: 32,
          fill: "#6366f1",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 540, top: 380,
          text: "FLASH SALE",
          fontSize: 24, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center", charSpacing: 120,
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 540, top: 510,
          text: "UP TO\n60% OFF",
          fontSize: 110, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center", lineHeight: 1.1,
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 540, top: 700,
          text: "Limited time. Shop now.",
          fontSize: 28, fontWeight: "400",
          fontFamily: "Inter", fill: "#94a3b8",
          textAlign: "center",
          originX: "center", originY: "center",
        },
        {
          type: "rect", left: 540, top: 820,
          width: 300, height: 72, rx: 36, ry: 36,
          fill: "#ffffff",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 540, top: 820,
          text: "Shop Now →",
          fontSize: 22, fontWeight: "700",
          fontFamily: "Space Grotesk", fill: "#1e293b",
          textAlign: "center",
          originX: "center", originY: "center",
        },
      ],
    },
  },
  {
    id: "insta-quote",
    name: "Quote Card",
    category: "social",
    bg: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
    font: "Georgia",
    textColor: "#1e293b",
    data: {
      version: "5.3.0",
      background: "#f8fafc",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 1080, height: 1080,
          fill: "#f8fafc", selectable: false, evented: false,
        },
        {
          type: "rect", left: 540, top: 540,
          width: 920, height: 920, rx: 48, ry: 48,
          fill: "#ffffff",
          shadow: { color: "rgba(0,0,0,0.08)", blur: 60, offsetX: 0, offsetY: 12 },
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 540, top: 420,
          text: "\"The best design\nis the one that\nfeels invisible.\"",
          fontSize: 64, fontWeight: "400",
          fontFamily: "Georgia", fill: "#1e293b",
          textAlign: "center", lineHeight: 1.35, fontStyle: "italic",
          originX: "center", originY: "center",
        },
        {
          type: "rect", left: 540, top: 670,
          width: 80, height: 3,
          fill: "#6366f1",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 540, top: 720,
          text: "— Your Brand",
          fontSize: 26, fontWeight: "700",
          fontFamily: "Space Grotesk", fill: "#6366f1",
          textAlign: "center",
          originX: "center", originY: "center",
        },
      ],
    },
  },
  {
    id: "insta-promo",
    name: "Product Promo",
    category: "social",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    font: "Space Grotesk",
    textColor: "#ffffff",
    data: {
      version: "5.3.0",
      background: "#0f172a",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 1080, height: 1080,
          fill: "#0f172a", selectable: false, evented: false,
        },
        {
          type: "circle", left: 540, top: 300,
          radius: 220,
          fill: "rgba(99,102,241,0.12)",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 540, top: 300,
          text: "NEW\nARRIVAL",
          fontSize: 88, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center", lineHeight: 1.0, charSpacing: 20,
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 540, top: 600,
          text: "Discover the collection",
          fontSize: 32, fontWeight: "400",
          fontFamily: "Inter", fill: "#94a3b8",
          textAlign: "center",
          originX: "center", originY: "center",
        },
        {
          type: "rect", left: 540, top: 750,
          width: 340, height: 80, rx: 12, ry: 12,
          fill: "#6366f1",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 540, top: 750,
          text: "Explore Now",
          fontSize: 26, fontWeight: "700",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center",
          originX: "center", originY: "center",
        },
      ],
    },
  },

  // ─── POSTER ──────────────────────────────────────────────────
  {
    id: "event-poster",
    name: "Event Poster",
    category: "poster",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    font: "Space Grotesk",
    textColor: "#ffffff",
    data: {
      version: "5.3.0",
      background: "#0f172a",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 794, height: 1123,
          fill: "#0f172a", selectable: false, evented: false,
        },
        {
          type: "rect", left: 397, top: 200,
          width: 700, height: 2, fill: "#6366f1",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 397, top: 120,
          text: "DESIGN SUMMIT 2025",
          fontSize: 18, fontWeight: "700",
          fontFamily: "Space Grotesk", fill: "#6366f1",
          textAlign: "center", charSpacing: 160,
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 397, top: 400,
          text: "Creative\nFutures",
          fontSize: 100, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center", lineHeight: 1.0,
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 397, top: 640,
          text: "The premier design conference\nfor modern creatives",
          fontSize: 26, fontWeight: "400",
          fontFamily: "Inter", fill: "#94a3b8",
          textAlign: "center", lineHeight: 1.6,
          originX: "center", originY: "center",
        },
        {
          type: "rect", left: 397, top: 800,
          width: 700, height: 1, fill: "rgba(255,255,255,0.1)",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 397, top: 880,
          text: "June 21–23 · New York City",
          fontSize: 28, fontWeight: "600",
          fontFamily: "Space Grotesk", fill: "#e2e8f0",
          textAlign: "center",
          originX: "center", originY: "center",
        },
        {
          type: "rect", left: 397, top: 1000,
          width: 280, height: 64, rx: 32, ry: 32,
          fill: "#6366f1",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 397, top: 1000,
          text: "Register Now",
          fontSize: 20, fontWeight: "700",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center",
          originX: "center", originY: "center",
        },
      ],
    },
  },
  {
    id: "minimal-poster",
    name: "Minimal Poster",
    category: "poster",
    bg: "#f8fafc",
    font: "Space Grotesk",
    textColor: "#1e293b",
    data: {
      version: "5.3.0",
      background: "#f8fafc",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 794, height: 1123,
          fill: "#f8fafc", selectable: false, evented: false,
        },
        {
          type: "rect", left: 0, top: 0,
          width: 794, height: 380,
          fill: "#1e293b", selectable: false,
        },
        {
          type: "i-text", left: 397, top: 190,
          text: "MINIMAL\nCONCEPT",
          fontSize: 82, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center", lineHeight: 1.0,
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 397, top: 560,
          text: "Where simplicity\nmeets purpose.",
          fontSize: 52, fontWeight: "300",
          fontFamily: "Space Grotesk", fill: "#1e293b",
          textAlign: "center", lineHeight: 1.3,
          originX: "center", originY: "center",
        },
        {
          type: "rect", left: 80, top: 780,
          width: 634, height: 1, fill: "#cbd5e1",
        },
        {
          type: "i-text", left: 397, top: 860,
          text: "studio.design · 2025",
          fontSize: 20, fontWeight: "500",
          fontFamily: "Inter", fill: "#94a3b8",
          textAlign: "center",
          originX: "center", originY: "center",
        },
      ],
    },
  },

  // ─── LOGO ────────────────────────────────────────────────────
  {
    id: "logo-badge",
    name: "Badge Logo",
    category: "logo",
    bg: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    font: "Space Grotesk",
    textColor: "#ffffff",
    data: {
      version: "5.3.0",
      background: "#1e293b",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 1200, height: 675,
          fill: "#1e293b", selectable: false, evented: false,
        },
        {
          type: "circle", left: 600, top: 337,
          radius: 180,
          fill: "#6366f1",
          originX: "center", originY: "center",
        },
        {
          type: "circle", left: 600, top: 337,
          radius: 160,
          fill: "transparent",
          stroke: "rgba(255,255,255,0.2)", strokeWidth: 2,
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 600, top: 310,
          text: "AB",
          fontSize: 96, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 600, top: 400,
          text: "STUDIO",
          fontSize: 20, fontWeight: "700",
          fontFamily: "Space Grotesk", fill: "rgba(255,255,255,0.6)",
          textAlign: "center", charSpacing: 200,
          originX: "center", originY: "center",
        },
      ],
    },
  },
  {
    id: "logo-wordmark",
    name: "Wordmark Logo",
    category: "logo",
    bg: "#ffffff",
    font: "Space Grotesk",
    textColor: "#1e293b",
    data: {
      version: "5.3.0",
      background: "#ffffff",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 1200, height: 675,
          fill: "#ffffff", selectable: false, evented: false,
        },
        {
          type: "rect", left: 520, top: 337,
          width: 64, height: 64, rx: 16, ry: 16,
          fill: "#6366f1",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 520, top: 337,
          text: "◆",
          fontSize: 28, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 630, top: 337,
          text: "BrandName",
          fontSize: 52, fontWeight: "800",
          fontFamily: "Space Grotesk", fill: "#1e293b",
          textAlign: "left",
          originX: "left", originY: "center",
        },
        {
          type: "rect", left: 600, top: 420,
          width: 500, height: 2,
          fill: "#6366f1", opacity: 0.3,
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 600, top: 450,
          text: "DESIGN & INNOVATION",
          fontSize: 14, fontWeight: "600",
          fontFamily: "Space Grotesk", fill: "#94a3b8",
          textAlign: "center", charSpacing: 200,
          originX: "center", originY: "center",
        },
      ],
    },
  },

  // ─── BUSINESS CARD ───────────────────────────────────────────
  {
    id: "bcard-dark",
    name: "Dark Business Card",
    category: "business-card",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    font: "Space Grotesk",
    textColor: "#ffffff",
    data: {
      version: "5.3.0",
      background: "#0f172a",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 1050, height: 600,
          fill: "#0f172a", selectable: false, evented: false,
        },
        {
          type: "rect", left: 0, top: 0,
          width: 12, height: 600,
          fill: "#6366f1", selectable: false,
        },
        {
          type: "i-text", left: 80, top: 160,
          text: "Alex Johnson",
          fontSize: 48, fontWeight: "800",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          originX: "left", originY: "center",
        },
        {
          type: "i-text", left: 80, top: 220,
          text: "Senior Product Designer",
          fontSize: 20, fontWeight: "400",
          fontFamily: "Inter", fill: "#6366f1",
          originX: "left", originY: "center",
        },
        {
          type: "rect", left: 80, top: 280,
          width: 400, height: 1,
          fill: "rgba(255,255,255,0.1)",
          originX: "left",
        },
        {
          type: "i-text", left: 80, top: 360,
          text: "alex@company.com\n+1 (555) 000-0000\ncompany.design",
          fontSize: 18, fontWeight: "400",
          fontFamily: "Inter", fill: "#94a3b8",
          lineHeight: 1.9, originX: "left", originY: "center",
        },
        {
          type: "rect", left: 920, top: 540,
          width: 80, height: 80, rx: 40, ry: 40,
          fill: "#6366f1",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 920, top: 540,
          text: "AJ",
          fontSize: 28, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center",
          originX: "center", originY: "center",
        },
      ],
    },
  },
  {
    id: "bcard-light",
    name: "Clean Business Card",
    category: "business-card",
    bg: "#ffffff",
    font: "Inter",
    textColor: "#1e293b",
    data: {
      version: "5.3.0",
      background: "#ffffff",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 1050, height: 600,
          fill: "#ffffff", selectable: false, evented: false,
        },
        {
          type: "rect", left: 0, top: 480,
          width: 1050, height: 120,
          fill: "#f8fafc", selectable: false,
        },
        {
          type: "rect", left: 80, top: 180,
          width: 72, height: 72, rx: 18, ry: 18,
          fill: "#6366f1",
          originX: "left", originY: "center",
        },
        {
          type: "i-text", left: 80, top: 180,
          text: "◆",
          fontSize: 32, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          originX: "left", originY: "center",
        },
        {
          type: "i-text", left: 200, top: 160,
          text: "Sarah Miller",
          fontSize: 44, fontWeight: "800",
          fontFamily: "Space Grotesk", fill: "#1e293b",
          originX: "left", originY: "center",
        },
        {
          type: "i-text", left: 200, top: 210,
          text: "Creative Director",
          fontSize: 18, fontWeight: "500",
          fontFamily: "Inter", fill: "#6366f1",
          originX: "left", originY: "center",
        },
        {
          type: "i-text", left: 80, top: 380,
          text: "sarah@studio.co   ·   +1 (555) 123-4567   ·   studio.co",
          fontSize: 17, fontWeight: "400",
          fontFamily: "Inter", fill: "#64748b",
          originX: "left", originY: "center",
        },
      ],
    },
  },

  // ─── BANNER ──────────────────────────────────────────────────
  {
    id: "hero-banner",
    name: "Hero Banner",
    category: "banner",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    font: "Space Grotesk",
    textColor: "#ffffff",
    data: {
      version: "5.3.0",
      background: "#0f172a",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 1200, height: 675,
          fill: "#0f172a", selectable: false, evented: false,
        },
        {
          type: "rect", left: 600, top: 337,
          width: 900, height: 500,
          rx: 32, ry: 32,
          fill: "rgba(99,102,241,0.12)",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 600, top: 260,
          text: "Build something\namazing.",
          fontSize: 80, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center", lineHeight: 1.1,
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 600, top: 400,
          text: "Design that makes an impact.",
          fontSize: 24, fontWeight: "400",
          fontFamily: "Inter", fill: "#94a3b8",
          textAlign: "center",
          originX: "center", originY: "center",
        },
        {
          type: "rect", left: 600, top: 490,
          width: 220, height: 60, rx: 30, ry: 30,
          fill: "#6366f1",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 600, top: 490,
          text: "Get Started →",
          fontSize: 18, fontWeight: "700",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "center",
          originX: "center", originY: "center",
        },
      ],
    },
  },

  // ─── PRESENTATION ─────────────────────────────────────────────
  {
    id: "slide-title",
    name: "Title Slide",
    category: "presentation",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    font: "Space Grotesk",
    textColor: "#ffffff",
    data: {
      version: "5.3.0",
      background: "#0f172a",
      objects: [
        {
          type: "rect", left: 0, top: 0,
          width: 1920, height: 1080,
          fill: "#0f172a", selectable: false, evented: false,
        },
        {
          type: "rect", left: 0, top: 0,
          width: 480, height: 1080,
          fill: "#6366f1", selectable: false,
        },
        {
          type: "i-text", left: 240, top: 540,
          text: "2025",
          fontSize: 120, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "rgba(255,255,255,0.15)",
          textAlign: "center",
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 1100, top: 460,
          text: "Presentation\nTitle Here",
          fontSize: 88, fontWeight: "900",
          fontFamily: "Space Grotesk", fill: "#ffffff",
          textAlign: "left", lineHeight: 1.1,
          originX: "center", originY: "center",
        },
        {
          type: "i-text", left: 1100, top: 640,
          text: "Subtitle and presenter name",
          fontSize: 28, fontWeight: "400",
          fontFamily: "Inter", fill: "#94a3b8",
          textAlign: "left",
          originX: "center", originY: "center",
        },
      ],
    },
  },
];
