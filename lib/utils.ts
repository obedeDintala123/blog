import { Category } from "@/types/post";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.TECH]: "Tech",
  [Category.LIFESTYLE]: "Lifestyle",
  [Category.TRAVEL]: "Travel",
  [Category.FOOD]: "Food",
  [Category.EDUCATION]: "Education",
  [Category.HEALTH]: "Health",
  [Category.FINANCE]: "Finance",
  [Category.SPORTS]: "Sports",
  [Category.ENTERTAINMENT]: "Entertainment",
  [Category.BUSINESS]: "Business",
  [Category.SCIENCE]: "Science",
  [Category.ART]: "Art",
};

export const convertCategory = (category: Category) =>
  CATEGORY_LABELS[category] ?? "Unknown";
