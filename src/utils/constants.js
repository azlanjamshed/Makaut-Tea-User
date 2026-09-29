export const DEPARTMENTS = [
  "All",
  "Computer Science and Engineering (CSE)",
  "Information Technology (IT)",
  "Forensic",
  "Bio Informatic",
  "LLB",
  "VLSI",
  "MTech",
  "Biotech Building",
  "Other",
];

export const REPORT_REASONS = [
  {
    id: "Harassment",
    label: "Harassment or Bullying",
    desc: "Targeting individuals maliciously",
  },
  {
    id: "Spam",
    label: "Spam or Promotional",
    desc: "Repetitive ads, links, or bot messages",
  },
  {
    id: "Personal information",
    label: "Personal Information (Doxxing)",
    desc: "Leaking phone numbers, roll numbers, or private details",
  },
  {
    id: "Offensive",
    label: "Hate Speech or Offensive Content",
    desc: "Derogatory or excessively abusive language",
  },
  {
    id: "Other",
    label: "Other College Policy Violation",
    desc: "Any other violation of campus guidelines",
  },
];

export const REACTIONS = [
  { emoji: "❤️", name: "love", label: "Love" },
  { emoji: "👎", name: "dislike", label: "Dislike" },
  { emoji: "💀", name: "dead", label: "Dead" },
];

// Single URL configuration for seamless deployment
const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const cleanUrl = rawApiUrl.replace(/\/+$/, "");
export const API_BASE_URL = cleanUrl.endsWith("/api")
  ? cleanUrl
  : `${cleanUrl}/api`;
export const SERVER_BASE_URL = cleanUrl.endsWith("/api")
  ? cleanUrl.replace(/\/api$/, "")
  : cleanUrl;
