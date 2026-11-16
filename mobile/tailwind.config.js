/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        /* Anti-Slop Stage & Concert Palette */
        primary: "#2563EB",
        "primary-dark": "#1D4ED8",
        "primary-light": "#EFF6FF",
        secondary: "#0F172A",
        surface: "#F8FAFC",
        background: "#F8FAFC",
        "surface-card": "#FFFFFF",
        "on-surface": "#0F172A",
        "on-background": "#0F172A",
        "on-surface-variant": "#64748B",
        outline: "#94A3B8",
        "outline-variant": "#E2E8F0",
        "surface-container": "#F1F5F9",
        "surface-container-low": "#F8FAFC",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-high": "#E2E8F0",
        "surface-variant": "#F1F5F9",
        "primary-fixed": "#DBEAFE",
        "primary-fixed-dim": "#BFDBFE",
        success: "#10B981",
        amber: "#F59E0B",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};
