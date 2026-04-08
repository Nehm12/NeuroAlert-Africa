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
        primary: {
          dark: "#042E22",
          DEFAULT: "#0D7A5F",
          mid: "#10916F",
          light: "#5DD6A8",
        },
        accent: {
          gold: "#F5A623",
          red: "#E84040",
        },
        bg: {
          dark: "#040F0C",
          dark2: "#071A14",
          sand: "#F5F4EF",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
        mono: ["Courier New", "monospace"],
      },
      animation: {
        "float": "float 5s ease-in-out infinite",
        "float-delayed": "float-delayed 6s ease-in-out 1.5s infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "slide-up": "slide-up 0.7s ease forwards",
        "spin-slow": "spin-slow 20s linear infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "beacon": "beacon 2s ease-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(93, 214, 168, 0.3), 0 0 40px rgba(93, 214, 168, 0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(93, 214, 168, 0.6), 0 0 80px rgba(93, 214, 168, 0.2)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        beacon: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "70%": { transform: "scale(3)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
      },
      backdropBlur: {
        xs: "4px",
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};
export default config;
