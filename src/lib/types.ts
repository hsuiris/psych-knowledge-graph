export type CategoryId =
  | "therapy"
  | "theory"
  | "disorder"
  | "assessment"
  | "technique"
  | "ethics"
  | "person"
  | "study";

export interface GraphNode {
  id: string;
  label: string;
  category: CategoryId;
  description: string;
  aliases?: string[];
  /** 人物的生卒年或經典研究的年份，例如 "1856–1939"、"1920" */
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
