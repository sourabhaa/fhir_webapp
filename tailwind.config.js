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
        sidebar: "15vw", // Changed to 15% of the viewport width
        "main-content": "94%",
        "main-content-md": "calc(100% - 25vw)",
        "main-content-lg": "calc(100% - 22vw)", // Adjusted for larger screens
        "main-content-xl": "calc(100% - 20vw)", // Adjusted for extra large screens
      },
      height: {
        "red-rectangle": "96vh", // Changed to 70% of the viewport height
        "main-screen": "92vh",
      },
      margin: {
        "red-rect-right": "8vw", // Changed to 8% of the viewport width
        "red-rect-top": "8vh", // Changed to 8% of the viewport height
        "main-right": "14vw", // Changed to 14% of the viewport width
        "main-top": "16vh", // Changed to 16% of the viewport height
        "main-top-md": "5vh", // Changed to 5% of the viewport height
        "main-top-lg": "4vh", // Changed to 4% of the viewport height
        "main-top-xl": "3vh", // Changed to 3% of the viewport height
      },
      maxHeight: {
        "table-sm": "40vh", // Changed to 40% of the viewport height
        "table-md": "50vh", // Changed to 50% of the viewport height
        "table-lg": "60vh", // Changed to 60% of the viewport height
        "table-xl": "70vh", // Changed to 70% of the viewport height
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
