import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

/**
 * @typedef {Object} DarkModeContextValue
 * @property {boolean} isDarkMode - The current dark mode state.
 * @property {() => void} toggleDarkMode - Function to toggle dark mode.
 */

// Create context with a default value of `null`
const DarkModeContext = createContext(null);

/**
 * Dark Mode Provider component that manages theme state.
 *
 * @param {{ children: React.ReactNode }} props
 */
function DarkModeProvider({ children }) {
  // Use local storage to store dark mode preference
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
    "isDark",
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  /**
   * Toggles dark mode state.
   */
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export default DarkModeProvider;

/**
 * Custom hook for accessing the dark mode context.
 *
 * @returns {DarkModeContextValue}
 */
const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

export { useDarkMode };
