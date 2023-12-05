import { signOut } from "next-auth/react";
import { useLanguage, useTheme } from "~/contexts";

const SignOutButton: React.FC = () => {
  const d_language = useLanguage();
  const d_theme = useTheme();

  return (
    <button
      type="button"
      onClick={() => {
        signOut();
      }}
      className="font-medium px-3 py-0.5 text-red-500 lg:hover:text-red-400"
    >
      {d_language.lang === "en" ? "Sign Out" : "로그아웃"}
    </button>
  );
};

export default SignOutButton;
