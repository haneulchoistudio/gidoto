import dynamic from "next/dynamic";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { User } from "~/types";
import { FaGoogle } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";
import { HiArrowLeft } from "react-icons/hi";
import { returns } from "~/server/ssr";
import { useLanguage, useTheme } from "~/contexts";
import { twMerge } from "tailwind-merge";
import { FiMoon, FiSun } from "react-icons/fi";
import { LandingMeta } from "~/components/meta";

const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

type Props = {
  user: User;
};

export default function Home({ user }: Props) {
  const d_language = useLanguage();
  const d_theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      d_language.switchLanguage(user.data.preferred_language);
      d_theme.switchTheme(user.data.preferred_theme);

      const timer = setTimeout(async () => {
        await router.push("/dashboard");
      }, 1500);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (user) {
    return (
      <>
        <LandingMeta user={user} />
        <Loading
          fullScreen
          message={
            user.data.preferred_language === "en"
              ? "Redirecting to dashboard..."
              : "알림판으로 이동중..."
          }
        />
      </>
    );
  }

  return (
    <>
      <LandingMeta user={user} />
      <header
        className={twMerge(
          "w-full fixed top-50 z-40 flex justify-end pr-8 md:pr-12 lg:pr-16 2xl:pr-32 py-4 lg:py-5 h-max bg-transparent",
          d_theme.theme === "dark" ? "text-white" : "text-neutral-900"
        )}
      >
        <nav className="flex items-center gap-x-3.5 lg:gap-x-5">
          <button
            type="button"
            onClick={() =>
              d_theme.switchTheme(d_theme.theme === "dark" ? "light" : "dark")
            }
            className={twMerge(
              "w-[35px] h-[35px] rounded-full border p-1 flex items-center justify-center lg:ring lg:ring-transparent lg:hover:ring-blue-500",
              d_theme.theme === "dark"
                ? "bg-neutral-700 border-neutral-400/40 text-white"
                : "bg-neutral-50 "
            )}
          >
            {d_theme.theme === "dark" ? <FiMoon /> : <FiSun />}
          </button>
          <div
            className={twMerge(
              " rounded flex items-center",
              d_theme.theme === "dark" ? "bg-neutral-900" : "bg-neutral-100"
            )}
          >
            <button
              disabled={d_language.lang === "en"}
              onClick={() => d_language.switchLanguage("en")}
              type="button"
              className={twMerge(
                "text-sm font-medium px-1 py-0.5 rounded border w-[35px] h-[35px] block",
                d_language.lang === "en"
                  ? d_theme.theme === "dark"
                    ? "text-white bg-neutral-700 border-neutral-400/40"
                    : "text-neutral-600 bg-white"
                  : d_theme.theme === "dark"
                  ? "bg-neutral-900 border-neutral-900 lg:hover:bg-blue-500/10 lg:hover:border-blue-500/25 text-neutral-400 lg:hover:text-blue-500"
                  : "lg:hover:bg-blue-400/10 lg:hover:text-blue-400 bg-neutral-100 lg:hover:border-blue-400/25 text-neutral-400 border-transparent "
              )}
            >
              EN
            </button>
            <button
              disabled={d_language.lang === "ko"}
              onClick={() => d_language.switchLanguage("ko")}
              type="button"
              className={twMerge(
                "text-sm font-medium px-1 py-0.5 rounded border w-[35px] h-[35px] block",
                d_language.lang === "ko"
                  ? d_theme.theme === "dark"
                    ? "text-white bg-neutral-700 border-neutral-400/40"
                    : "text-neutral-600 bg-white"
                  : d_theme.theme === "dark"
                  ? "bg-neutral-900 border-neutral-900 lg:hover:bg-blue-500/10 lg:hover:border-blue-500/25 text-neutral-400 lg:hover:text-blue-500"
                  : "lg:hover:bg-blue-400/10 lg:hover:text-blue-400 bg-neutral-100 lg:hover:border-blue-400/25 text-neutral-400 border-transparent "
              )}
            >
              KO
            </button>
          </div>
          <Link
            href={"/about"}
            className="opacity-75 font-medium uppercase tracking-[0.075rem] text-sm flex items-center gap-x-2 group lg:hover:overflow-hidden lg:hover:underline"
          >
            <span>{d_language.lang === "en" ? "About Onus" : "온어스란?"}</span>
            <HiArrowLeft className="text-base lg:text-lg transition-all duration-[0.275s] ease-in-out lg:group-hover:translate-x-full -right-full lg:group-hover:-mr-5 lg:group-hover:scale-125 lg:group-hover:rotate-180" />
          </Link>
        </nav>
      </header>
      <div
        className={twMerge(
          "h-screen flex flex-col justify-center items-center px-8 md:px-12 lg:px-16 2xl:px-32",
          d_theme.theme === "dark"
            ? "bg-neutral-900 text-white"
            : "bg-white text-neutral-900"
        )}
      >
        <article className="flex flex-col gap-y-1.5 lg:gap-y-2.5 items-center text-center pb-5 lg:pb-8 border-b border-neutral-400/40 mb-5 lg:mb-8 w-full">
          <h1 className="font-medium text-4xl lg:text-5xl 2xl:text-6xl">
            {d_language.lang === "en" ? "Onus" : "온어스"}
          </h1>
          <p className="opacity-75 text-lg lg:text-xl 2xl:text-2xl font-light">
            {d_language.lang === "en"
              ? "It's on us. Let's pray for one another."
              : "서로를 위해 끈임없이 기도합니다."}
          </p>
        </article>
        <ul className="w-full md:max-w-[325px] mx-auto flex flex-col items-center gap-y-3.5 lg:gap-y-5">
          <button
            onClick={() => signIn("google")}
            type="button"
            className="w-full font-medium flex justify-between items-center gap-x-2.5 px-8 py-3.5 border rounded opacity-75 lg:hover:border-blue-500 lg:hover:text-blue-500 lg:hover:opacity-100"
          >
            <span>
              {d_language.lang === "en"
                ? "Sign in with Google"
                : "구글로 로그인 하기"}
            </span>
            <FaGoogle className="text-lg lg:text-xl" />
          </button>
          <button
            onClick={() => signIn("kakao")}
            type="button"
            className="w-full font-medium flex justify-between items-center gap-x-2.5 px-8 py-3.5 border rounded opacity-75 lg:hover:text-neutral-900 lg:hover:border-amber-400 lg:hover:bg-amber-400 lg:hover:opacity-100"
          >
            <span>
              {d_language.lang === "en"
                ? "Sign in with Kakao"
                : "카카오 로그인 하기"}
            </span>
            <SiKakaotalk className="text-lg lg:text-xl" />
          </button>
        </ul>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props } = returns();
  const user = (await getSession(ctx)) as unknown as User;
  const message = user
    ? `Welcome to Gidoto, ${user.data.name}.`
    : `Please sign in.`;
  return props({ user, message });
};
