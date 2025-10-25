import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Drakonomi Dragon Theme - Dark & Powerful
        'dragon-primary': '#8B0000',     // Dark Red
        'dragon-secondary': '#FFD700',   // Gold
        'dragon-accent': '#FF4500',      // Orange Red (Dragon Fire)
        'dragon-bg': '#1a1a1a',          // Very Dark Gray
        'dragon-surface': '#2d2d2d',     // Dark Gray
        'dragon-text': '#F5F5DC',        // Beige
        'dragon-text-secondary': '#D4AF37', // Metallic Gold
        'dragon-fire': '#FF6347',        // Tomato (Fire)
        'dragon-scale': '#4B5320',       // Army Green (Dragon Scales)
        'dragon-shadow': '#191970',      // Midnight Blue
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} satisfies Config;
