/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
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
        },
        animation: {
          heartbeat: 'heartbeat 1s infinite',
          breathing: 'breathing 2s infinite',
          spinSlow: 'spinSlow 1s linear infinite',
        },
      },
    },
    plugins: [require("daisyui")],
    daisyui: {
      themes: [
        {
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