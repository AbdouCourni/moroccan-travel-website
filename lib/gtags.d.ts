// lib/gtag.d.ts
interface Window {
  gtag: (...args: any[]) => void;
  dataLayer: any[];
}