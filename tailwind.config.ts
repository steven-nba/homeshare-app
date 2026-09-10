import type { Config } from "tailwindcss";

// Design tokens for the group's visual identity: warm, residential, light,
// welcoming — a boutique-hospitality feel rather than a generic marketplace.
// Swap these once real branding/logo is finalized (see README "Open Items").
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm stone/linen background — lighter and cooler than the typical
        // AI-cliche cream, keeps the app feeling airy rather than "designed".
        stone: {
          50: "#FBF9F5",
          100: "#F5F2EA",
          200: "#E9E3D3",
        },
        // Deep olive — the primary color. Reads residential/natural
        // (gardens, countryside homes) rather than "travel app blue".
        olive: {
          50: "#EEF1E9",
          100: "#DCE3D2",
          400: "#7C9268",
          600: "#556B44",
          700: "#435339",
          900: "#2B3524",
        },
        // Warm ochre/gold — secondary accent for highlights, badges, CTAs.
        gold: {
          100: "#F3E4C8",
          400: "#D9A653",
          600: "#B87F2E",
        },
        // Warm charcoal-brown for text instead of pure black.
        ink: {
          DEFAULT: "#362F27",
          muted: "#8B8172",
        },
        border: "#E5DFD3",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
