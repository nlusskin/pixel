module.exports = {
  purge: [
    './components/*.tsx',
    './pages/*.tsx'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      margin: {
        '1/4': '25%',
        '1/3': '33.33%',
        '1/2': '50%'
      },
      padding: {
        '1/4': '25%',
        '1/3': '33.33%',
        '1/2': '50%'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
