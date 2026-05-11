/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['Syne', 'sans-serif'],
                body:    ['DM Sans', 'sans-serif'],
                sans:    ['DM Sans', 'sans-serif'],
            },
            colors: {
                ink:   '#09090E',
                brand: {
                    DEFAULT: '#2563EB',
                    light:   '#3B82F6',
                    dark:    '#1D4ED8',
                },
            },
            backgroundImage: {
                'grid-dot': "radial-gradient(circle, rgba(96,165,250,0.12) 1px, transparent 1px)",
            },
            backgroundSize: {
                'grid-28': '28px 28px',
            },
        },
    },
    plugins: [],
};
