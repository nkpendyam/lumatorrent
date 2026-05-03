import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
