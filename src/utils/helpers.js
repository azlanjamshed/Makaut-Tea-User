import { SERVER_BASE_URL } from './constants';

/**
 * Returns formatted relative time like 'Just now', '12m', '3h', '2d', or date
 */
export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

/**
 * Formats large counts compactly (e.g. 1200 -> 1.2k)
 */
export const formatCount = (num) => {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(num);
};

/**
 * Ensures image URLs point to the correct CDN or local backend server,
 * with optional ImageKit transformations for high-performance responsive loading.
 *
 * Presets:
 * - 'feed':   600-800px width (tr=w-800,q-80) for feed cards
 * - 'detail': ~1200px width (tr=w-1200,q-85) for post detail page
 * - 'thumb':  ~400px width (tr=w-400,q-75) for trending / thumbnails
 * - 'avatar': 160x160 square (tr=w-160,h-160,c-maintain_ratio,q-80)
 * - 'full':   1600px width (tr=w-1600,q-85) for lightbox inspection
 */
export const resolveImageUrl = (url, preset) => {
  if (!url) return '';
  let fullUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.startsWith('/uploads')) {
      fullUrl = `${SERVER_BASE_URL}${url}`;
    }
  }

  if (preset && (fullUrl.includes('ik.imagekit.io') || fullUrl.includes('imagekit.io'))) {
    if (!fullUrl.includes('tr=') && !fullUrl.includes('tr:')) {
      const presets = {
        feed: 'w-800,q-80',
        detail: 'w-1200,q-85',
        thumb: 'w-400,q-75',
        avatar: 'w-160,h-160,c-maintain_ratio,q-80',
        full: 'w-1600,q-85',
      };
      const transform = presets[preset] || preset;
      const separator = fullUrl.includes('?') ? '&' : '?';
      return `${fullUrl}${separator}tr=${transform}`;
    }
  }

  return fullUrl;
};

export const getOptimizedImageUrl = (url, preset = 'feed') => resolveImageUrl(url, preset);

/**
 * Generates an accessible solid background color based on username or anonymous ID
 */
export const getAvatarBg = (seed = 'anon') => {
  const solidColors = [
    'bg-sky-700',
    'bg-indigo-700',
    'bg-blue-700',
    'bg-slate-700',
    'bg-emerald-700',
    'bg-cyan-700',
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % solidColors.length;
  return solidColors[index];
};
export const getAvatarGradient = getAvatarBg;

/**
 * Extracts the first letter from user name
 */
export const getInitials = (name = 'A') => {
  if (!name) return 'A';
  const clean = name.trim();
  return clean ? clean.charAt(0).toUpperCase() : 'A';
};

/**
 * Smoothly scrolls to top on both mobile window and desktop viewport,
 * and triggers a refresh of the home feed to display recently posted rants.
 */
export const scrollToTopAndRefreshFeed = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const mainViewport = document.getElementById('main-viewport');
  if (mainViewport) {
    mainViewport.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.dispatchEvent(new CustomEvent('rantea:refresh-home-feed'));
};
