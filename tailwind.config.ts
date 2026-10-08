import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Signal brand colors
        signal: {
          bg: "#07070A",
          "bg-elev": "#0F0F14",
          border: "rgba(255,255,255,0.08)",
          text: "#FAFAFA",
          muted: "#A1A1AA",
          violet: "#8B5CF6",
          cyan: "#22D3EE",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      animation: {
        "orb-drift": "orbDrift 12s ease-in-out infinite",
        "fade-up": "fadeUp 0.4s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        orbDrift: {
          "0%, 100%": { transform: "translateX(-50%) scale(1) translateY(0px)" },
          "33%": { transform: "translateX(-48%) scale(1.05) translateY(-20px)" },
          "66%": { transform: "translateX(-52%) scale(0.98) translateY(10px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "signal-gradient": "linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)",
        "hero-glow": "radial-gradient(ellipse at 50% -20%, rgba(139,92,246,0.15) 0%, transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 32px rgba(139, 92, 246, 0.4)",
        "glow-sm": "0 0 16px rgba(139, 92, 246, 0.3)",
        "glow-cyan": "0 0 32px rgba(34, 211, 238, 0.4)",
        glass: "0 4px 32px rgba(0,0,0,0.4)",
        "glass-hover": "0 8px 48px rgba(139,92,246,0.12), 0 4px 32px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
