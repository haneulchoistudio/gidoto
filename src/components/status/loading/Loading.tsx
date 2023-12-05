import { twMerge } from "tailwind-merge";
import { useLanguage, useTheme } from "~/contexts";

interface RedirectingProps {
  message: string;
  fullScreen?: boolean;
}

const Redirecting: React.FC<RedirectingProps> = ({
  message,
  fullScreen = false,
}) => {
  const d_language = useLanguage();
  const d_theme = useTheme();
  return (
    <div
      className={twMerge(
        "text-center flex flex-col items-center gap-y-2.5 lg:gap-y-3.5",
        fullScreen ? "h-screen justify-center" : "h-auto",
        d_theme.theme === "dark" ? "bg-neutral-900" : "bg-white"
      )}
    >
      <article className="flex justify-center items-center ">
        <span className="w-[42.5px] lg:w-[47.5px] h-[42.5px] lg:h-[47.5px] rounded-full flex justify-center items-center bg-gradient-to-tr from-blue-500 to-sky-500 animate-spin ">
          <span
            className={twMerge(
              "w-[40.5px] lg:w-[45px] h-[40.5px] lg:h-[45px] rounded-full block ring ring-blue-500/50",
              d_theme.theme === "dark" ? "bg-neutral-900" : "bg-white "
            )}
          />
        </span>
      </article>
      <p className="px-8 text-center truncate text-blue-500/75 font-light lg:text-lg animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Redirecting;
