import { nodeById, neighborsOf } from "./graph";
import { DETAILS, type ConceptDetail } from "@/data/details";
import type { GraphNode } from "./types";

export interface RelationGroup {
  relation: string;
  nodes: GraphNode[];
}

export interface Concept {
  node: GraphNode;
  detail?: ConceptDetail;
  /** this-concept → others, grouped by relation */
  outgoing: RelationGroup[];
  /** others → this-concept, grouped by relation */
  incoming: RelationGroup[];
  /** human-readable sentences describing the relationships */
  narrative: string[];
}

function group(
  pairs: { node: GraphNode; relation: string }[]
): RelationGroup[] {
  const map = new Map<string, GraphNode[]>();
  for (const p of pairs) {
    const arr = map.get(p.relation) ?? [];
    arr.push(p.node);
    map.set(p.relation, arr);
  }
  return [...map.entries()].map(([relation, nodes]) => ({ relation, nodes }));
}

export function getConcept(id: string): Concept | null {
  const node = nodeById.get(id);
  if (!node) return null;

  const neighbors = neighborsOf(id);
  const outgoing = group(
    neighbors.filter((n) => n.outgoing).map((n) => ({ node: n.node, relation: n.relation }))
  );
  const incoming = group(
    neighbors.filter((n) => !n.outgoing).map((n) => ({ node: n.node, relation: n.relation }))
  );

  const join = (nodes: GraphNode[]) => nodes.map((n) => `「${n.label}」`).join("、");
  const narrative: string[] = [];
  for (const g of outgoing) {
    narrative.push(`「${node.label}」${g.relation}${join(g.nodes)}。`);
  }
  for (const g of incoming) {
    narrative.push(`${join(g.nodes)}${g.relation}「${node.label}」。`);
  }

  return { node, detail: DETAILS[id], outgoing, incoming, narrative };
}

export function allConceptIds(): string[] {
  return [...nodeById.keys()];
}
