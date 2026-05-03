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
        soft: "var(--lt-shadow-soft)",
        panel: "var(--lt-shadow-panel)",
      },
    },
  },
  plugins: [],
} satisfies Config;
