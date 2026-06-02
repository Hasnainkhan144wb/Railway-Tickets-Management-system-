import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext =
  createContext();

export const ThemeProvider =
  ({ children }) => {

    const [darkMode,
      setDarkMode] =
      useState(false);

    useEffect(() => {

      const theme =
        localStorage.getItem(
          "theme"
        );

      if (theme === "dark") {

        document.documentElement.classList.add(
          "dark"
        );

        setDarkMode(true);
      }

    }, []);

    const toggleTheme =
      () => {

        if (darkMode) {

          document.documentElement.classList.remove(
            "dark"
          );

          localStorage.setItem(
            "theme",
            "light"
          );

        } else {

          document.documentElement.classList.add(
            "dark"
          );

          localStorage.setItem(
            "theme",
            "dark"
          );
        }

        setDarkMode(
          !darkMode
        );
      };

    return (

      <ThemeContext.Provider
        value={{
          darkMode,
          toggleTheme,
        }}
      >

        {children}

      </ThemeContext.Provider>
    );
  };

export const useTheme =
  () =>
    useContext(
      ThemeContext
    );