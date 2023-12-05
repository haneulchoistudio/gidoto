import { createContext, useContext, useEffect, useState } from "react";
import { User } from "~/types";

export type LanguageOptions<
  LanguageOptionExtension extends string = "en" | "ko"
> = LanguageOptionExtension;

export interface LanguageContextProps<LanguageOptions> {
  lang: LanguageOptions;
  switchLanguage: (_lang: LanguageOptions) => void;
}

const LanguageContext = createContext<{
  lang: LanguageOptions;
  switchLanguage: (_lang: LanguageOptions) => void;
}>({
  lang: "en",
  switchLanguage: () => {},
});

const LanguageContextProvider: React.FC<
  React.PropsWithChildren & { user: User }
> = ({ children, user }) => {
  const [lang, setLang] = useState<LanguageOptions>(
    user ? user.data.preferred_language : "en"
  );

  function switchLanguage(_lang: LanguageOptions) {
    localStorage.setItem("lang", _lang);
    setLang(_lang);
  }

  function _initialLoader() {
    if (!localStorage.getItem("lang")) {
      localStorage.setItem("lang", user ? user.data.preferred_language : "en");
      setLang(user ? user.data.preferred_language : "en");
    } else {
      setLang(
        user
          ? user.data.preferred_language
          : (localStorage.getItem("lang") as LanguageOptions)
      );
    }
  }

  useEffect(() => {
    _initialLoader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContextProvider;

function useLanguage() {
  return useContext(LanguageContext);
}

export { useLanguage };
