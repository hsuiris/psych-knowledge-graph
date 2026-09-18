export type CategoryId =
  | "therapy"
  | "theory"
  | "disorder"
  | "assessment"
  | "technique"
  | "ethics"
  | "person";

export interface GraphNode {
  id: string;
  label: string;
  category: CategoryId;
  description: string;
  aliases?: string[];
  /** 人物節點的生卒年，例如 "1856–1939" */
  years?: string;
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
