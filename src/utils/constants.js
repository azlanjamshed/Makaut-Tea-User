export const DEPARTMENTS = [
  'All',
  'Computer Science (CSE)',
  'Information Technology (IT)',
  'Electronics & Comm (ECE)',
  'Mechanical Engg (ME)',
  'Electrical Engg (EE)',
  'Civil Engg (CE)',
  'Business Admin (BBA/MBA)',
  'Basic Sciences',
  'Campus General',
];

export const REPORT_REASONS = [
  { id: 'Harassment', label: 'Harassment or Bullying', desc: 'Targeting individuals maliciously' },
  { id: 'Spam', label: 'Spam or Promotional', desc: 'Repetitive ads, links, or bot messages' },
  { id: 'Personal information', label: 'Personal Information (Doxxing)', desc: 'Leaking phone numbers, roll numbers, or private details' },
  { id: 'Offensive', label: 'Hate Speech or Offensive Content', desc: 'Derogatory or excessively abusive language' },
  { id: 'Other', label: 'Other College Policy Violation', desc: 'Any other violation of campus guidelines' },
];

export const REACTIONS = [
  { emoji: '😂', name: 'laugh', label: 'Funny' },
  { emoji: '💀', name: 'skull', label: 'Dead' },
  { emoji: '😭', name: 'cry', label: 'Sad' },
  { emoji: '🔥', name: 'fire', label: 'Lit' },
];

// Single URL configuration for seamless deployment
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const cleanUrl = rawApiUrl.replace(/\/+$/, '');
export const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
export const SERVER_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl.replace(/\/api$/, '') : cleanUrl;
