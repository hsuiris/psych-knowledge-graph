import raw from "@/data/graph.json";
import type { GraphData, GraphLink, GraphNode } from "./types";

export const graphData = raw as GraphData;

export const nodeById: Map<string, GraphNode> = new Map(
  graphData.nodes.map((n) => [n.id, n])
);

function endpointId(end: string | GraphNode): string {
  return typeof end === "string" ? end : end.id;
}

export interface Neighbor {
  node: GraphNode;
  relation: string;
  /** true when the current node is the source of the link */
  outgoing: boolean;
}

/** All concepts directly linked to the given node, with the relation label. */
export function neighborsOf(nodeId: string): Neighbor[] {
  const result: Neighbor[] = [];
  for (const link of graphData.links) {
    const s = endpointId(link.source);
    const t = endpointId(link.target);
    if (s === nodeId) {
      const node = nodeById.get(t);
      if (node) result.push({ node, relation: link.relation, outgoing: true });
    } else if (t === nodeId) {
      const node = nodeById.get(s);
      if (node) result.push({ node, relation: link.relation, outgoing: false });
    }
  }
  return result;
}

/** Set of node ids adjacent to the given node (plus itself). */
export function adjacentIds(nodeId: string): Set<string> {
  const set = new Set<string>([nodeId]);
  for (const n of neighborsOf(nodeId)) set.add(n.node.id);
  return set;
}

export function linkId(link: GraphLink): string {
  return `${endpointId(link.source)}->${endpointId(link.target)}`;
}

export { endpointId };
