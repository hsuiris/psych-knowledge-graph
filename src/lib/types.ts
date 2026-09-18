export type CategoryId =
  | "therapy"
  | "theory"
  | "disorder"
  | "assessment"
  | "technique"
  | "ethics";

export interface GraphNode {
  id: string;
  label: string;
  category: CategoryId;
  description: string;
  aliases?: string[];
  /** filled at runtime by force-graph */
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  relation: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
