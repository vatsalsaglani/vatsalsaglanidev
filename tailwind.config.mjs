/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          background: "#F1F5F7",
          surface: "#E5E7EB",
          accent: "#FF4B1F",
          secondary: "#1FDDFF",
          text: "#141B1F",
        },
        // Dark mode colors
        dark: {
          background: "#141B1F",
          surface: "#1F292E",
          accent: "#FF4B1F",
          secondary: "#1FDDFF",
          text: "#F1F5F7",
        },
      },
      gradients: {
        primary: ["#FF4B1F", "#1FDDFF"],
      },
      zIndex: {
        'behind': '-1',
      }
    },
  },
  plugins: [],
};
