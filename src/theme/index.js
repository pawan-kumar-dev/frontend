import { createTheme } from "@mui/material";

const getTheme = (isDarkThemeEnabled = false) => {
  const theme = createTheme({
    palette: {
      mode: isDarkThemeEnabled ? "dark" : "light",
    },
    overrides: {
      MuiFormControl: {
        root: {
          mb: 0,
          mt: 1,
        },
      },
    },
  });
  return theme;
};

export default getTheme;
