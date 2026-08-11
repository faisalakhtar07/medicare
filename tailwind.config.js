/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#0A1F33',
          900: '#0C2A45',
          800: '#123A5C',
        },
        teal: {
          50: '#EDFBFA',
          100: '#D3F4F1',
          400: '#2BB8AC',
          500: '#0E9C90',
          600: '#0A7F76',
          700: '#08655F',
        },
        skyfaint: '#F1F8FC',
        mint: {
          500: '#22A96C',
          600: '#1B8A58',
        },
        coral: '#FF6B57',
      },
      boxShadow: {
        card: '0 2px 10px rgba(12,42,69,0.06)',
        cardHover: '0 12px 28px rgba(12,42,69,0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
