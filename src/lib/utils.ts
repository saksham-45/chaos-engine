import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

/**
 * Get language color (common GitHub language colors)
 */
export function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    'JavaScript': '#f7df1e',
    'TypeScript': '#3178c6',
    'Python': '#3776ab',
    'Java': '#ed8b00',
    'C++': '#00599c',
    'C': '#a8b9cc',
    'C#': '#239120',
    'Go': '#00add8',
    'Rust': '#ce422b',
    'Swift': '#fa7343',
    'Kotlin': '#7f52ff',
    'PHP': '#777bb4',
    'Ruby': '#cc342d',
    'Dart': '#0175c2',
    'HTML': '#e34c26',
    'CSS': '#1572b6',
    'Shell': '#89e051',
    'PowerShell': '#012456',
    'R': '#276dc3',
    'MATLAB': '#e16737',
    'Scala': '#dc322f',
    'Clojure': '#5881d8',
    'Haskell': '#5e5086',
    'Lua': '#000080',
    'Perl': '#39457e',
    'Objective-C': '#438eff',
    'Vue': '#4fc08d',
    'React': '#61dafb',
  };

  return colors[language || ''] || '#3dd6c6';
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

