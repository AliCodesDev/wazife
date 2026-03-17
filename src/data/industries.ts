import type { IndustryCategory } from "../types/company";

export const INDUSTRY_CATEGORIES: IndustryCategory[] = [
  "technology",
  "finance",
  "healthcare",
  "law",
  "engineering",
  "education",
  "marketing",
  "hospitality",
  "retail",
  "ngo",
  "media",
  "other",
];

export const INDUSTRY_COLORS: Record<IndustryCategory, string> = {
  technology: "#3B82F6",   // blue
  finance: "#10B981",      // emerald
  healthcare: "#EF4444",   // red
  law: "#8B5CF6",          // violet
  engineering: "#F59E0B",  // amber
  education: "#06B6D4",    // cyan
  marketing: "#EC4899",    // pink
  hospitality: "#F97316",  // orange
  retail: "#14B8A6",       // teal
  ngo: "#6366F1",          // indigo
  media: "#A855F7",        // purple
  other: "#6B7280",        // gray
};

export const INDUSTRY_LABELS: Record<IndustryCategory, string> = {
  technology: "Technology / Software",
  finance: "Finance / Banking",
  healthcare: "Healthcare / Pharmacy",
  law: "Law / Legal",
  engineering: "Engineering / Construction",
  education: "Education",
  marketing: "Marketing / Advertising",
  hospitality: "Hospitality / Tourism",
  retail: "Retail / E-commerce",
  ngo: "NGOs / International Orgs",
  media: "Media / Entertainment",
  other: "Other",
};
