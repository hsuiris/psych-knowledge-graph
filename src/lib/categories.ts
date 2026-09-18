import type { CategoryId } from "./types";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  color: string;
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  therapy: { id: "therapy", label: "治療學派", color: "#6366f1" },
  theory: { id: "theory", label: "理論概念", color: "#10b981" },
  disorder: { id: "disorder", label: "心理疾患", color: "#f43f5e" },
  assessment: { id: "assessment", label: "評估診斷", color: "#f59e0b" },
  technique: { id: "technique", label: "諮商技術", color: "#06b6d4" },
  ethics: { id: "ethics", label: "倫理專業", color: "#a855f7" },
  person: { id: "person", label: "人物", color: "#ec4899" },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export function categoryColor(id: CategoryId): string {
  return CATEGORIES[id]?.color ?? "#94a3b8";
}
