export type IndustryCategory =
  | "technology"
  | "finance"
  | "healthcare"
  | "law"
  | "engineering"
  | "education"
  | "marketing"
  | "hospitality"
  | "retail"
  | "ngo"
  | "media"
  | "other";

export interface Company {
  id: string;
  name: string;
  name_ar?: string;
  industries: IndustryCategory[];
  description: string;
  latitude: number;
  longitude: number;
  city: string;
  website?: string;
}
