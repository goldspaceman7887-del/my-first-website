import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          900: "#14432A",
          700: "#1F6B3B",
          500: "#3D9A5C",
        },
        leaf: {
          300: "#8FD19E",
          100: "#DCF3E1",
        },
        cream: {
          50: "#FBF7EE",
          100: "#F3ECDA",
        },
        sky: {
          400: "#6FB7DE",
          100: "#E3F2FA",
        },
        earth: {
          600: "#9C7B4F",
        },
        sunset: {
          400: "#E8A24B",
        },
        // Torii red — used sparingly, only for the Japanese decorative motifs
        // (wave pattern, torii icon), never as a UI/brand action color.
        torii: {
          500: "#B54A3C",
        },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        body: ["Inter", "'Noto Sans JP'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      keyframes: {
        grow: {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "100%": { transform: "scaleY(1)", opacity: "1" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        grow: "grow 0.6s ease-out forwards",
        sway: "sway 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
