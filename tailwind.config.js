/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matthewPurple: "#6419E6",
        matthewDark: "#121212",
        matthewGray: "#232323",
        matthewLight: "#F8F8F8"
      },
      keyframes: {
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1)' },
        },
        breathing: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glowing: {
          '0%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.5)' },
          '100%': { filter: 'brightness(1)' },
        }
      },
      animation: {
        heartbeat: 'heartbeat 1s infinite',
        breathing: 'breathing 2s infinite',
        spinSlow: 'spinSlow 1s linear infinite',
        glowing: 'glowing 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        matthewDark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#6419E6",
          secondary: "#D926AA",
          accent: "#1FB2A5",
          neutral: "#191D24",
          "base-100": "#121212",
          "base-200": "#232323",
          "base-300": "#333333",
          "base-content": "#F8F8F8",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#6419E6",
          secondary: "#D926AA",
          accent: "#1FB2A5",
          neutral: "#191D24",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
}