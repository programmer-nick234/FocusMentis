import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.5)',
        'glow-lg': '0 0 30px rgba(124, 58, 237, 0.7)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'responsive-xs': ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.4' }],
        'responsive-sm': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.5' }],
        'responsive-base': ['clamp(1rem, 2vw, 1.125rem)', { lineHeight: '1.6' }],
        'responsive-lg': ['clamp(1.125rem, 2.5vw, 1.25rem)', { lineHeight: '1.5' }],
        'responsive-xl': ['clamp(1.25rem, 3vw, 1.5rem)', { lineHeight: '1.4' }],
        'responsive-2xl': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.3' }],
        'responsive-3xl': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.2' }],
        'responsive-4xl': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      const newUtilities = {
        '.text-gradient': {
          'background': 'var(--gradient-primary)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-secondary': {
          'background': 'var(--gradient-secondary)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.hover-lift': {
          'transition': 'var(--transition-normal)',
        },
        '.hover-lift:hover': {
          'transform': 'translateY(-4px)',
          'box-shadow': 'var(--shadow-xl)',
        },
        '.hover-glow': {
          'transition': 'var(--transition-normal)',
        },
        '.hover-glow:hover': {
          'box-shadow': '0 0 20px rgba(124, 58, 237, 0.5)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

export default config
