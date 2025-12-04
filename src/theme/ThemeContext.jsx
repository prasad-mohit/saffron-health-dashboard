// src/ThemeContext.jsx
import { createContext, useContext, useState } from "react";
import { themes } from "./themes";

const ThemeContext = createContext({
  theme: themes.saffronPurple, // default fallback
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.saffronPurple);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
