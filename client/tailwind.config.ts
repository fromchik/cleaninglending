import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F3F5F1",
        ink: "#202724",
        pine: "#315F4F",
        teal: "#6FA58B",
        mint: "#E6ECE5",
        gold: "#E5C243"
      },
      boxShadow: {
        soft: "0 16px 34px rgba(32, 39, 36, 0.08)",
        card: "0 8px 22px rgba(32, 39, 36, 0.07)"
      },
      borderRadius: {
        luxury: "16px"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
