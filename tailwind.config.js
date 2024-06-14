/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
    "node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "base-layer": "#E8E8FD",
        "accent-red": "#EE4D38",
        "main-bg": "#FFFFFF",
        "sidebar-bg": "#F8F8FF",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "2.8125rem",
        "3xl": "1.875rem",
      },
      width: {
        sidebar: "230px",
        "main-content": "1350px",
      },
      height: {
        "red-rectangle": "700px",
        "main-screen": "650px",
      },
      margin: {
        "red-rect-right": "80px",
        "red-rect-top": "80px",
        "main-right": "140px",
        "main-top": "160px",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
