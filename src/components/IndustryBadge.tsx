import type { IndustryCategory } from "../types/company";
import { INDUSTRY_COLORS, INDUSTRY_LABELS } from "../data/industries";

interface IndustryBadgeProps {
  industry: IndustryCategory;
  short?: boolean;
}

export default function IndustryBadge({ industry, short = false }: IndustryBadgeProps) {
  const label = short ? INDUSTRY_LABELS[industry].split(" / ")[0] : INDUSTRY_LABELS[industry];
  return (
    <span
      className="inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
      style={{ backgroundColor: INDUSTRY_COLORS[industry] }}
    >
      {label}
    </span>
  );
}
