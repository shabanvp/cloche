import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        charcoal: "#1A1A1A",
        gold: "#C5A880",
        ivory: "#F9F8F6",
        emerald: "#2D4A3E",
        // New Theme Colors
        primary: "#0F4C45",
        "primary-container": "#E7F0EF",
        "on-primary-container": "#072B27",
        secondary: "#C8A96A",
        surface: "#F8F6F2",
        "surface-dim": "#EFEBE4",
        "on-surface": "#1C1C17",
        "on-surface-variant": "#494740",
        outline: "#7A776E",
        "outline-variant": "#CAC6BA",
        inverse: {
            surface: "#31302C"
        }
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["Public Sans", "var(--font-playfair)", "serif"],
        headline: ["Public Sans", "sans-serif"],
        body: ["Public Sans", "sans-serif"],
        label: ["Public Sans", "sans-serif"]
      },
    },
  },
  plugins: [],
};
export default config;
