import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand: derived from the Happy Subarashi logo (deep wisteria purple)
        // and a warm rose pink for the wellness/feminine accent.
        brand: {
          purple: {
            50: "#F5F2FB",
            100: "#ECE6F6",
            200: "#D8CCEC",
            300: "#BBA8DC",
            400: "#9D82C9",
            500: "#7E61AE", // primary brand purple (matches logo)
            600: "#664D92",
            700: "#523D76",
            800: "#3E2E5A",
            900: "#2B1F40",
          },
          pink: {
            50: "#FFF3F8",
            100: "#FFE4F0",
            200: "#FECCE3",
            300: "#FDA4CC",
            400: "#FB72AC",
            500: "#F0488C", // secondary accent pink
            600: "#D62E70",
            700: "#B11F59",
            800: "#8C1947",
            900: "#6B143A",
          },
        },
        surface: "#FFFDFE",
        canvas: "#FBF7FB",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(126, 97, 174, 0.12)",
        card: "0 4px 24px -4px rgba(126, 97, 174, 0.16)",
        glow: "0 0 0 4px rgba(240, 72, 140, 0.12)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.15s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
