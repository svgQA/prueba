/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'b-light': '#efefef',
        'b-light-dark': '#dfdfdf',
        'b-dark': '#282828',
        'b-dark-light': '#3d3d3d',
        't-light': '#282828',
        't-light-dark': '#1a1a1a',
        't-dark': '#efefef',
        't-dark-light': '#ffffff',
        primary: '#00BDD6',
        secondary: '#1DD75B',
        ternary: '#00727B',
        m4: '#ADF5FF',
        m5: '#409D9F',
        m6: '#AEFDC8',
        warning: '',
        error: '#EF4444',
        success: '',
      },
    },
  },
  plugins: [],
};
