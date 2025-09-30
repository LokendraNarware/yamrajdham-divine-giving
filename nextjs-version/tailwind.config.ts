import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
          glow: 'var(--color-primary-glow)'
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
          rich: 'var(--color-secondary-rich)'
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)'
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)'
        },
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)'
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)'
        },
        temple: {
          peach: 'var(--color-temple-peach)',
          coral: 'var(--color-temple-coral)',
          gold: 'var(--color-temple-gold)',
          bronze: 'var(--color-temple-bronze)',
          brown: 'var(--color-temple-brown)',
          charcoal: 'var(--color-temple-charcoal)',
          grey: 'var(--color-temple-grey)',
          cream: 'var(--color-temple-cream)',
          antiqueGold: 'var(--color-temple-antique-gold)',
          softPeach: 'var(--color-temple-soft-peach)'
        }
      },
      backgroundImage: {
        'gradient-divine': 'var(--gradient-divine)',
        'gradient-peaceful': 'var(--gradient-peaceful)',
        'gradient-gold': 'var(--gradient-gold)',
        'gradient-coral': 'var(--gradient-coral)',
        'gradient-brown': 'var(--gradient-brown)'
      },
      boxShadow: {
        'temple': 'var(--shadow-temple)',
        'gold': 'var(--shadow-gold)',
        'divine': 'var(--shadow-divine)',
        'coral': 'var(--shadow-coral)',
        'brown': 'var(--shadow-brown)'
      }
    }
  }
} satisfies Config;
