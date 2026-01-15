/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom "Pro Max" Palette
                'pro-dark': '#0f172a',
                'pro-light': '#f8fafc',
                'pro-primary': '#3b82f6',
                'pro-accent': '#f97316',
            }
        },
    },
    plugins: [],
}
