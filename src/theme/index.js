const { createTheme } = require("@mui/material");

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 320,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1536,
      xxl: 1680,
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiTextField: {
      defaultProps: {
        autoComplete: "off",
        autoCorrect: "off",
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
