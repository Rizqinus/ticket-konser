/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4D3298",
        "primary-dark": "#3b2574",
        "primary-light": "#EEF2FF",
        secondary: "#55389E",
        surface: "#F9F8FD",
        background: "#F9F8FD",
        "surface-card": "#FFFFFF",
        "on-surface": "#1C1B1F",
        "on-background": "#0B1536",
        "on-surface-variant": "#49454F",
        outline: "#CAC4D0",
        "outline-variant": "#E7E0EC",
        "surface-container": "#F3EFF4",
        "surface-container-low": "#EEF2FF",
        "surface-container-lowest": "#FFFFFF",
        "surface-variant": "#E7E0EC",
        "primary-fixed": "#EADDFF",
        "primary-fixed-dim": "#D0BCFF",
        success: "#2E7D32",
      },
    },
  },
  plugins: [],
};
