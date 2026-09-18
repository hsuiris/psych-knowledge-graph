"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { graphData, adjacentIds, endpointId } from "@/lib/graph";
import { categoryColor } from "@/lib/categories";
import { portraitOf } from "@/lib/media";
import { shortLabel } from "@/lib/linkify";
import type { CategoryId, GraphLink, GraphNode } from "@/lib/types";

const ForceGraph = dynamic(() => import("./ForceGraph"), { ssr: false });

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  activeCategories: Set<CategoryId>;
  focusId: string | null;
  focusNonce: number;
}

export default function GraphCanvas({
  selectedId,
  onSelect,
  activeCategories,
  focusId,
  focusNonce,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hoverId, setHoverId] = useState<string | null>(null);

  // graph-force-mutated copy so the simulation keeps node positions stable
  const data = useMemo(
    () => ({
      nodes: graphData.nodes.map((n) => ({ ...n })),
      links: graphData.links.map((l) => ({ ...l })),
    }),
    []
  );

  // Responsive sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ width: r.width, height: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The node we visually emphasise: hover takes priority, else the selection.
  const activeId = hoverId ?? selectedId;
  const highlightSet = useMemo(
    () => (activeId ? adjacentIds(activeId) : null),
    [activeId]
  );

  const isVisible = (cat: CategoryId) => activeCategories.has(cat);

  // Callback ref: tune the d3 forces the moment the (lazy-loaded) graph
  // mounts, for a tighter, more readable layout with less drift.
  const setGraphRef = useCallback((instance: unknown) => {
    fgRef.current = instance;
    if (!instance) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fg = instance as any;
    fg.d3Force?.("charge")?.strength(-180).distanceMax(400);
    fg.d3Force?.("link")?.distance(55);
    fg.d3ReheatSimulation?.();
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__fg = fg;
    }
  }, []);

  // Center & zoom on a node when search / sidebar requests focus.
  // 側欄蓋住右邊，所以把節點放在左邊剩下的可見範圍中間
  useEffect(() => {
    if (!focusId || !fgRef.current) return;
    const node = data.nodes.find((n) => n.id === focusId) as GraphNode | undefined;
    if (!node) return;
    const t = setTimeout(() => {
      if (node.x != null && node.y != null) {
        const zoom = 2.5;
        fgRef.current.centerAt(node.x + panelOffset(size.width) / zoom, node.y, 600);
        fgRef.current.zoom(zoom, 600);
      }
    }, 60);
    return () => clearTimeout(t);
  }, [focusId, focusNonce, data.nodes, size.width]);

  // Initial fit once the engine settles.
  const handleEngineStop = () => {
    fgRef.current?.zoomToFit(500, 60);
  };

  return (
    <div ref={containerRef} className="absolute inset-0">
      {size.width > 0 && (
        <ForceGraph
          innerRef={setGraphRef}
          width={size.width}
          height={size.height}
          graphData={data}
          backgroundColor="#f8fafc"
          cooldownTicks={120}
          onEngineStop={handleEngineStop}
          nodeRelSize={5}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodeVal={(n: any) => 1 + (adjacentDegree(n.id) || 0) * 0.4}
          onNodeClick={(n: GraphNode) => {
            onSelect(n.id);
            const fg = fgRef.current;
            if (fg && n.x != null && n.y != null) {
              fg.centerAt(n.x + panelOffset(size.width) / fg.zoom(), n.y, 500);
            }
          }}
          onBackgroundClick={() => onSelect(null)}
          onNodeHover={(n: GraphNode | null) => setHoverId(n ? n.id : null)}
          linkColor={(l: GraphLink) => linkColor(l, activeId, highlightSet)}
          linkWidth={(l: GraphLink) =>
            isLinkHighlighted(l, activeId) ? 2 : 0.5
          }
          linkDirectionalParticles={(l: GraphLink) =>
            isLinkHighlighted(l, activeId) ? 3 : 0
          }
          linkDirectionalParticleWidth={2}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, scale: number) =>
            drawNode(node, ctx, scale, {
              isVisible,
              activeId,
              selectedId,
              highlightSet,
            })
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = color;
            const r = Math.max(nodeRadius(node), 6);
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
            ctx.fill();
          }}
        />
      )}
    </div>
  );
}

// 側欄寬 max-w-md（448px），窄螢幕時側欄佔滿整個畫面，就不用位移
function panelOffset(width: number): number {
  return width >= 768 ? 224 : 0;
}

// 人物照片：第一次畫到才載入，載入完成前先畫純色圓點
const images = new Map<string, HTMLImageElement>();
function photoFor(id: string): HTMLImageElement | undefined {
  const p = portraitOf(id);
  if (!p) return undefined;
  let img = images.get(id);
  if (!img) {
    img = new Image();
    img.src = p.src;
    images.set(id, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function nodeRadius(node: any): number {
  const r = 4 + Math.min(adjacentDegree(node.id), 8) * 0.6;
  // 有照片的人物放大一點，照片才看得出來
  return portraitOf(node.id) ? Math.max(r, 8) : r;
}

// --- degree cache (for sizing hubs slightly bigger) ---
const degreeCache = new Map<string, number>();
function adjacentDegree(id: string): number {
  if (degreeCache.has(id)) return degreeCache.get(id)!;
  let d = 0;
  for (const l of graphData.links) {
    if (endpointId(l.source) === id || endpointId(l.target) === id) d++;
  }
  degreeCache.set(id, d);
  return d;
}

function isLinkHighlighted(link: GraphLink, activeId: string | null): boolean {
  if (!activeId) return false;
  return (
    endpointId(link.source) === activeId || endpointId(link.target) === activeId
  );
}

function linkColor(
  link: GraphLink,
  activeId: string | null,
  highlightSet: Set<string> | null
): string {
  if (!activeId || !highlightSet) return "rgba(100,116,139,0.25)";
  return isLinkHighlighted(link, activeId)
    ? "rgba(51,65,85,0.6)"
    : "rgba(100,116,139,0.08)";
}

interface DrawOpts {
  isVisible: (cat: CategoryId) => boolean;
  activeId: string | null;
  selectedId: string | null;
  highlightSet: Set<string> | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawNode(
  node: any,
  ctx: CanvasRenderingContext2D,
  scale: number,
  opts: DrawOpts
) {
  const { isVisible, activeId, selectedId, highlightSet } = opts;
  const color = categoryColor(node.category as CategoryId);
  const visible = isVisible(node.category as CategoryId);
  const inHighlight = !highlightSet || highlightSet.has(node.id);
  const dimmed = !visible || (highlightSet != null && !inHighlight);

  const baseR = nodeRadius(node);
  const r = node.id === selectedId ? baseR * 1.4 : baseR;

  ctx.globalAlpha = dimmed ? 0.12 : 1;

  // glow ring for active node
  if (node.id === activeId && !dimmed) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, r + 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = hexToRgba(color, 0.25);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();

  // 人物（與安娜·O 這類案例）照片裁成正方形（取上方，臉通常在上面），塞進圓形，外面留一圈分類顏色
  const photo = photoFor(node.id);
  if (photo) {
    const s = Math.min(photo.naturalWidth, photo.naturalHeight);
    const inner = r - 1.2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x, node.y, inner, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.drawImage(photo, (photo.naturalWidth - s) / 2, 0, s, s, node.x - inner, node.y - inner, inner * 2, inner * 2);
    ctx.restore();
  }

  if (node.id === selectedId) {
    ctx.lineWidth = 1.5 / scale;
    ctx.strokeStyle = "#0f172a";
    ctx.stroke();
  }

  // labels: always for hubs / active, otherwise when zoomed in
  // 連結數 4 以上的樞紐概念在任何縮放層級都顯示名稱，否則整張圖只剩彩色圓點，看不出主題
  const showLabel =
    !dimmed &&
    (scale > 1.4 ||
      adjacentDegree(node.id) >= 4 ||
      node.id === activeId ||
      node.id === selectedId);
  if (showLabel) {
    const fontSize = Math.max(11 / scale, 2.5);
    ctx.font = `${fontSize}px "Noto Sans TC", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(30,41,59,0.92)";
    // 人物名稱只顯示中文短名，英文全名放在側欄，圖上才不會擠成一團
    const label = node.category === "person" ? shortLabel(node.label) : node.label;
    ctx.fillText(label, node.x, node.y + r + 1);
  }

  ctx.globalAlpha = 1;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
