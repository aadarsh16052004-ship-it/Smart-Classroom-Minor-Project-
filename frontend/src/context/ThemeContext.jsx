import { createContext, useContext } from "react";

// Theme is now fixed — light only. Toggle removed.
const ThemeContext = createContext({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }) {
  // Reset body background to our light design
  document.body.style.background = "#f8f9fb";
  document.body.style.color = "#1e293b";
  return (
    <ThemeContext.Provider value={{ dark: false, toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
