import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
        },
        // Content colors
        content: {
          primary: 'var(--content-primary)',
          secondary: 'var(--content-secondary)',
          tertiary: 'var(--content-tertiary)',
          inverse: 'var(--content-inverse)',
        },
        // Interactive colors
        interactive: {
          primary: 'var(--interactive-primary)',
          'primary-hover': 'var(--interactive-primary-hover)',
          secondary: 'var(--interactive-secondary)',
          'secondary-hover': 'var(--interactive-secondary-hover)',
          disabled: 'var(--interactive-disabled)',
        },
        // Brand colors
        brand: {
          'user-base': 'var(--brand-user-base)',
          'user-light': 'var(--brand-user-light)',
          'user-dark': 'var(--brand-user-dark)',
          'task-base': 'var(--brand-task-base)',
          'task-light': 'var(--brand-task-light)',
          'task-dark': 'var(--brand-task-dark)',
        },
        // Border colors
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
        },
        // Feedback colors
        feedback: {
          success: 'var(--feedback-success)',
          error: 'var(--feedback-error)',
          warning: 'var(--feedback-warning)',
          info: 'var(--feedback-info)',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
};
