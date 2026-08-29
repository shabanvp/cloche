/**
 * Returns a lightweight SVG data URL blur placeholder for Next.js Image component
 */
export function getBlurDataURL(color: string = "#EBE4D8"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
    <rect width="10" height="10" fill="${color}"/>
  </svg>`;
  const base64 = typeof window === "undefined"
    ? Buffer.from(svg).toString("base64")
    : btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

export const DEFAULT_BLUR_URL = getBlurDataURL("#FAF7F2");
