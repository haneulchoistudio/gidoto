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

const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

type Props = {
  user: User;
};

export default function Home({ user }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const timer = setTimeout(async () => {
        await router.push("/dashboard");
      }, 1500);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (user) {
    return <Loading fullScreen message="Redirecting to dashboard..." />;
  }

  return (
    <>
      <header className="w-full fixed top-50 z-40 flex justify-end pr-8 md:pr-12 lg:pr-16 2xl:pr-32 py-4 lg:py-5">
        <nav className="flex items-center gap-x-3.5 lg:gap-x-5">
          <div className="bg-neutral-100 rounded overflow-hidden flex items-center">
            <button
              disabled={true}
              type="button"
              className="text-neutral-600 text-sm font-medium px-1 py-0.5 rounded bg-white border"
            >
              EN
            </button>
            <button
              onClick={() =>
                alert(
                  "The default language is set to 'English'. We will add 'Korean' language feature soon. Please try it later."
                )
              }
              type="button"
              className="text-neutral-600 lg:hover:bg-blue-400 lg:hover:text-white text-sm font-medium px-1 py-0.5 rounded bg-neutral-100 border border-transparent lg:hover:border-blue-400"
            >
              KO
            </button>
          </div>
          <Link
            href={"/about"}
            className="text-neutral-600 font-medium uppercase tracking-[0.075rem] text-sm flex items-center gap-x-2 group lg:hover:overflow-hidden lg:hover:underline"
          >
            <span>About Us</span>
            <HiArrowLeft className="text-base lg:text-lg transition-all duration-[0.275s] ease-in-out lg:group-hover:translate-x-full -right-full lg:group-hover:-mr-5 lg:group-hover:scale-125 lg:group-hover:rotate-180" />
          </Link>
        </nav>
      </header>
      <div className="h-screen flex flex-col justify-center items-center px-8 md:px-12 lg:px-16 2xl:px-32">
        <article className="flex flex-col gap-y-1.5 lg:gap-y-2.5 items-center text-center pb-5 lg:pb-8 border-b mb-5 lg:mb-8 w-full">
          <h1 className="font-medium text-4xl lg:text-5xl 2xl:text-6xl">
            Gidoto
          </h1>
          <p className="text-neutral-600">We pray for one another.</p>
        </article>
        <ul className="w-full md:max-w-[325px] mx-auto flex flex-col items-center gap-y-3.5 lg:gap-y-5">
          <button
            onClick={() => signIn("google")}
            type="button"
            className="w-full font-medium flex justify-between items-center gap-x-2.5 px-8 py-3.5 border rounded text-neutral-600 lg:hover:border-blue-500 lg:hover:text-blue-500"
          >
            <span>Sign in with Google</span>
            <FaGoogle className="text-lg lg:text-xl" />
          </button>
          <button
            onClick={() => signIn("kakao")}
            type="button"
            className="w-full font-medium flex justify-between items-center gap-x-2.5 px-8 py-3.5 border rounded text-neutral-600 lg:hover:text-neutral-900 lg:hover:border-amber-400 lg:hover:bg-amber-400"
          >
            <span>Sign in with Kakao</span>
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
