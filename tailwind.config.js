module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: {
          offwhite: "#FAFAFB",
          light: "#E0E0E0",
          cream: "#D3D3D3",
          DEFAULT: "#FFF",
        },
        purple: {
          "off-purple": "#3C393F",
          "light-purple": "#252329",
          DEFAULT: "#6A5C9A",
        },
        blue: {
          "off-blue": "#828282",
          "light-blue": "#BDBDBD",
          darkblue: "#333333",
          deepblue: "#282051",
          DEFAULT: "#1976D2",
        },
      },
    },
  },
  plugins: [],
};
