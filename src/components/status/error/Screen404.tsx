import Link from "next/link";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import { useLanguage, useTheme } from "~/contexts";

interface Screen404Props {
  errorCode: 404;
  title: string;
}

const Screen404: React.FC<Screen404Props> = ({ errorCode, title }) => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const router = useRouter();
  const asPath = router.asPath;

  return (
    <div
      id="__404__NOT__FOUND"
      className={twMerge(
        "h-screen flex justify-center items-center p-8 md:p-12 lg:p-16 2xl:p-32",
        theme === "dark"
          ? "bg-neutral-900 text-white"
          : "bg-white text-neutral-900"
      )}
    >
      <article className="flex flex-col">
        <h2 className="font-medium  text-4xl 2xl:text-5xl mb-1 lg:mb-1.5 2xl:mb-2.5">
          {lang === "en" ? "Oops!" : "죄송해요!"}
        </h2>
        <div className="flex items-center gap-x-1.5 lg:gap-x-2 text-lg lg:text-xl opacity-60 mb-3 lg:mb-5">
          <span className="text-red-500">{errorCode}</span>

          <p className="font-light text-base opacity-75 lg:text-lg">
            &apos;{asPath}&apos;{" "}
            {lang === "en"
              ? "page does not exist."
              : "페이지가 존재하지 않습니다."}
          </p>
        </div>

        <Link
          href={"/"}
          className={twMerge(
            "px-5 py-2.5 lg:px-6 lg:py-3 lg:text-lg rounded border font-medium text-center",
            theme === "dark"
              ? " border-white/25 bg-white/10 text-white÷75  lg:hover:bg-white/25 lg:hover:text-white "
              : "border-neutral-900 bg-white text-neutral-900 lg:hover:bg-neutral-900 lg:hover:text-white "
          )}
        >
          {lang === "en" ? "Back to main" : "메인으로 돌아가기"}
        </Link>
      </article>
    </div>
  );
};

export default Screen404;
