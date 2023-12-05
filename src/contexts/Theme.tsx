import { createContext, useContext, useEffect, useState } from "react";
import { User } from "~/types";

export type ThemeOptions<
  ThemeOptionsExtension extends string = "light" | "dark"
> = ThemeOptionsExtension;

export interface ThemeContextProps {
  theme: ThemeOptions;
  switchTheme: (_theme: ThemeOptions) => void;
}

const ThemeContext = createContext<{
  theme: ThemeOptions;
  switchTheme: (_theme: ThemeOptions) => void;
}>({
  theme: "light",
  switchTheme: () => {},
});

export const ThemeContextProvider: React.FC<
  React.PropsWithChildren & { user: User }
> = ({ children, user }) => {
  const [theme, setTheme] = useState<ThemeOptions>(
    user ? user.data.preferred_theme : "light"
  );

  function switchTheme(_theme: ThemeOptions) {
    localStorage.setItem("theme", _theme);
    setTheme(_theme);
  }

  function _initialLoader() {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", user ? user.data.preferred_theme : "light");
      setTheme(user ? user.data.preferred_theme : "light");
    } else {
      setTheme(
        user
          ? user.data.preferred_theme
          : (localStorage.getItem("theme") as ThemeOptions)
      );
    }
  }

  useEffect(() => {
    _initialLoader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

function useTheme() {
  return useContext(ThemeContext);
}

export { useTheme };
