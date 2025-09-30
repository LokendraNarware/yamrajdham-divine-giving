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
        'gradient-divine': 'linear-gradient(135deg, var(--color-primary), var(--color-primary-glow))',
        'gradient-peaceful': 'linear-gradient(180deg, var(--color-background), var(--color-card))',
        'gradient-gold': 'linear-gradient(45deg, var(--color-temple-gold), var(--color-temple-bronze))',
        'gradient-coral': 'linear-gradient(135deg, var(--color-temple-coral), var(--color-temple-gold))',
        'gradient-brown': 'linear-gradient(135deg, var(--color-temple-brown), var(--color-temple-gold))'
      },
      boxShadow: {
        'temple': '0 10px 30px -10px rgba(255, 169, 104, 0.25)',
        'gold': '0 5px 20px -5px rgba(212, 165, 116, 0.3)',
        'divine': '0 0 40px rgba(255, 169, 104, 0.2)',
        'coral': '0 5px 20px -5px rgba(255, 140, 66, 0.25)',
        'brown': '0 5px 20px -5px rgba(139, 115, 85, 0.2)'
      }
    }
  }
} satisfies Config;
