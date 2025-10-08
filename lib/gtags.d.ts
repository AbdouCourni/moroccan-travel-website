// lib/gtags.d.ts
interface Window {
  gtag: (...args: any[]) => void;
  dataLayer: any[];
}