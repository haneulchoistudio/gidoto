import dynamic from "next/dynamic";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { $, txt } from "~/client/utils";
import { returns } from "~/server/ssr";
import { UserProps, type User } from "~/types";
import { FiArrowDown, FiCheck } from "react-icons/fi";
import { useLanguage, useTheme } from "~/contexts";
import { AccountPreferencesMeta } from "~/components/meta";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);
const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

type Props = {
  user: User;
};

export default function AccountPreferences({ user }: Props) {
  const languages = {
    en: {
      en: "English",
      ko: "Korean",
    },
    ko: {
      en: "영어",
      ko: "한국어",
    },
  } as const;
  const themes = {
    en: {
      light: "Light",
      dark: "Dark",
    },
    ko: {
      light: "밝음",
      dark: "어두움",
    },
  } as const;

  const router = useRouter();
  const { lang, switchLanguage } = useLanguage();
  const { theme, switchTheme } = useTheme();
  const $data = $("pages", "accountPreferences");

  const [openDisplayLanguage, setOpenDisplayLanguage] =
    useState<boolean>(false);
  const [openDisplayTheme, setOpenDisplayTheme] = useState<boolean>(false);

  const [o, _o] = useState<UserProps>(user.data);
  const [n, setN] = useState<UserProps>(user.data);
  const [diff, setDiff] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const txt_name = txt(n.name);
    const txt_nickname = txt(n.nickname);
    const txt_bio = txt(n.bio);

    let evaluation: boolean = false;
    // _is_empty_string
    evaluation = [txt_name, txt_bio].map((each) => each.empty()).some(Boolean);
    if (evaluation) {
      setError("Name or bio description field(s) is(are) empty.");
      setLoading(false);
      return;
    }

    // _is_over_max
    evaluation = [txt_name, txt_nickname]
      .map((each) => each.isOverMax(30))
      .some(Boolean);
    if (evaluation) {
      setError("Name or nickname must be less than or equal to 30 characters.");
      setLoading(false);
      return;
    }

    // _is_below_min
    evaluation = [txt_name].map((each) => each.isBelowMin(4)).some(Boolean);
    if (evaluation) {
      setError("Text fields must be at least 4 characters.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/users/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, data: n }),
    });

    if (!response.ok) {
      setError("Failed to update the profile. Try it again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.reload();

    return;
  }

  useEffect(() => {
    const different = [
      o.preferred_language !== n.preferred_language,
      o.preferred_theme !== n.preferred_theme,
      o.preferred_show_nickname !== n.preferred_show_nickname,
      o.preferred_view_profile !== n.preferred_view_profile,
    ].some(Boolean);
    setDiff(different);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  return (
    <>
      <AccountPreferencesMeta user={user} />
      <header
        className={twMerge(
          "px-8 md:px-12 lg:px-16 2xl:px-32 flex justify-between items-center py-4 lg:py-5"
        )}
      >
        <div className="flex items-center gap-x-2.5 md:gap-x-3.5">
          <div className="flex items-center gap-x-2.5">
            <Link
              href={"/dashboard"}
              className={twMerge(
                "w-[37.5px] h-[37.5px] rounded border bg-white flex justify-center items-center lg:hover:border-neutral-900 text-neutral-600 lg:hover:text-white lg:hover:bg-neutral-900"
              )}
            >
              <HiArrowLeft />
            </Link>
            <h1 className="font-bold text-lg lg:text-xl">
              {$data.titles.head[lang]}
            </h1>
          </div>
        </div>
        <ProfileButton
          image={user.data.image}
          isOnFreePlan={user.data.subscription === "free"}
        />
      </header>
      <div className="w-ful bg-neutral-100">
        <p
          className={twMerge(
            "px-8 md:px-12 lg:px-16 2xl:px-32 flex py-4 lg:py-5 max-w-[1080px] mx-auto items-center gap-x-1 lg:gap-x-1.5 text-neutral-400 text-sm lg:text-base"
          )}
        >
          <span>{lang === "en" ? "Account" : "계정"}</span>
          <span>/</span>
          <span className="font-medium text-neutral-600">
            {lang === "en" ? "Preferences" : "환경설정"}
          </span>
        </p>
      </div>
      {loading ? (
        <Loading message="Updating the user..." />
      ) : (
        <>
          <main className="px-8 md:px-12 lg:px-16 2xl:px-32 py-8 lg:py-12 h-auto">
            <p className="mb-4 lg:mb-8 text-neutral-600 max-w-[500px] w-full mx-auto text-start">
              {lang === "en"
                ? "To edit your account profile, "
                : "프로필 설정은"}
              {lang === "en" ? "go to " : " "}
              <Link
                href={"/account/profile"}
                className="inline-flex items-enter gap-x-0.5 text-blue-500 lg:hover:underline"
              >
                <span>{lang === "en" ? "Account" : "계정"}</span>
                <span>/</span>
                <span>{lang === "en" ? "Profile" : "프로필"}</span>
              </Link>
              {lang === "en" ? "." : " 로 가주세요."}
            </p>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-y-4 lg:gap-y-5 max-w-[500px] mx-auto z-10 relative bg-transparent"
            >
              {error && (
                <p className="p-6 lg:p-8 rounded border bg-red-400/10 border-red-400/25 text-red-400 text-center">
                  {error}
                </p>
              )}

              <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
                <h4 className="font-medium text-lg lg:text-xl">
                  {$data.labels.lang[lang]}
                </h4>
                <div className="relative">
                  <button
                    onClick={() => setOpenDisplayLanguage(!openDisplayLanguage)}
                    type="button"
                    className={twMerge(
                      "w-full px-4 py-3 rounded border text-neutral-600 flex justify-between items-center ",
                      openDisplayLanguage
                        ? "border-b-transparent bg-neutral-50  rounded-b-none text-neutral-400 font-light"
                        : "lg:hover:border-transparent lg:ring lg:ring-transparent lg:hover:ring-blue-500 font-medium"
                    )}
                    placeholder="Example Church Young Adults"
                  >
                    <span>
                      {n.preferred_language === "en" ? "English" : "한국어"}
                    </span>
                    <FiArrowDown
                      className={twMerge(
                        "transition-all duration-[0.375s] ease-in-out transform inline-blok",
                        openDisplayLanguage
                          ? "rotate-180 text-blue-500 scale-110"
                          : "rotate-0"
                      )}
                    />
                  </button>
                  {openDisplayLanguage && (
                    <div className="w-full border-x border-b border-b-rounded">
                      {Object.keys(languages).map(
                        (each, idx) =>
                          each !== n.preferred_language && (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => {
                                setN((n) => ({
                                  ...n,
                                  preferred_language: each as "en" | "ko",
                                }));
                                switchLanguage(each as "en" | "ko");
                                setOpenDisplayLanguage(false);
                              }}
                              className="w-full py-3 lg:hover:bg-blue-50 text-neutral-600 lg:hover:text-blue-500"
                            >
                              {
                                languages[n.preferred_language][
                                  each as "en" | "ko"
                                ]
                              }
                            </button>
                          )
                      )}
                    </div>
                  )}
                </div>
              </section>
              <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
                <h4 className="font-medium text-lg lg:text-xl">
                  {$data.labels.theme[lang]}
                </h4>
                <div className="relative">
                  <button
                    // disabled={true}
                    onClick={
                      // () => setOpenDisplayTheme(!openDisplayTheme)
                      () =>
                        alert(
                          lang === "en"
                            ? "This featuer is currently not available. Sorry for the inconvenience."
                            : "이 기능은 아직 지원되지 않습니다. 불편을 끼쳐드려 죄송합니다."
                        )
                    }
                    type="button"
                    className={twMerge(
                      "w-full px-4 py-3 rounded border text-neutral-600 flex justify-between items-center ",
                      openDisplayTheme
                        ? "border-b-transparent bg-neutral-50 rounded-b-none text-neutral-400 font-light"
                        : "lg:hover:border-transparent lg:ring lg:ring-transparent lg:hover:ring-blue-500 font-medium"
                    )}
                    placeholder="Example Church Young Adults"
                  >
                    <span>
                      {n.preferred_theme === "dark"
                        ? n.preferred_language === "en"
                          ? "Dark"
                          : "어두움"
                        : n.preferred_language === "en"
                        ? "Light"
                        : "밝음"}
                    </span>
                    <FiArrowDown
                      className={twMerge(
                        "transition-all duration-[0.375s] ease-in-out transform inline-blok",
                        openDisplayTheme
                          ? "rotate-180 text-blue-500 scale-110"
                          : "rotate-0"
                      )}
                    />
                  </button>
                  {openDisplayTheme && (
                    <div className="w-full border-x border-b border-b-rounded">
                      {Object.keys(themes[n.preferred_language]).map(
                        (each, idx) =>
                          each !== n.preferred_theme && (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => {
                                setN((n) => ({
                                  ...n,
                                  preferred_theme: each as "light" | "dark",
                                }));
                                switchTheme(each as "light" | "dark");
                                setOpenDisplayTheme(false);
                              }}
                              className="w-full py-3 lg:hover:bg-blue-50 text-neutral-600 lg:hover:text-blue-500"
                            >
                              {
                                themes[n.preferred_language][
                                  each as "light" | "dark"
                                ]
                              }
                            </button>
                          )
                      )}
                    </div>
                  )}
                </div>
              </section>
              <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
                <h4 className="font-medium text-lg lg:text-xl">
                  {$data.labels.profileAccess[lang]}
                </h4>
                <div className="flex justify-between items-center">
                  <p
                    className={twMerge(
                      "text-sm font-mono lg:text-base",
                      n.preferred_view_profile === "public"
                        ? "text-green-500"
                        : "text-neutral-400"
                    )}
                  >
                    {lang === "en"
                      ? "Can others see my profile info?"
                      : "다른 유저들이 유저님의 프로파일을 볼 수 있나요?"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (n.preferred_view_profile === "public") {
                        setN((n) => ({
                          ...n,
                          preferred_view_profile: "hidden",
                          preferred_show_nickname: false,
                        }));
                      } else {
                        setN((n) => ({
                          ...n,
                          preferred_view_profile: "public",
                        }));
                      }
                    }}
                    className={twMerge(
                      "relative overflow-hidden w-[22.5px] h-[22.5px] lg:w-[25px] lg:h-[25px] rounded-full border flex justify-center items-center group ring",
                      n.preferred_view_profile === "public"
                        ? "border-transparent ring-green-500"
                        : "lg:hover:border-blue-500 ring-transparent"
                    )}
                  >
                    <FiCheck
                      className={twMerge(
                        "transition-all duration-[0.375s] ease-in-out",
                        n.preferred_view_profile === "public"
                          ? "text-green-500 scale-100"
                          : "scale-0 text-neutral-400"
                      )}
                    />
                  </button>
                </div>
              </section>
              {n.preferred_view_profile === "public" && (
                <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
                  <h4 className="font-medium text-lg lg:text-xl">
                    {$data.labels.publicNicknameAccess[lang]}
                  </h4>
                  <div className="flex justify-between items-center">
                    <p
                      className={twMerge(
                        "text-sm font-mono lg:text-base",
                        n.preferred_show_nickname
                          ? "text-green-500"
                          : "text-neutral-400"
                      )}
                    >
                      {lang === "en"
                        ? "Can others see my nickname as well?"
                        : "다른 유저들이 유저님의 닉네임도 볼 수 있나요?"}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setN((n) => ({
                          ...n,
                          preferred_show_nickname: !n.preferred_show_nickname,
                        }))
                      }
                      className={twMerge(
                        "relative overflow-hidden w-[22.5px] h-[22.5px] lg:w-[25px] lg:h-[25px] rounded-full border flex justify-center items-center group ring",
                        n.preferred_show_nickname
                          ? "border-transparent ring-green-500"
                          : "lg:hover:border-blue-500 ring-transparent"
                      )}
                    >
                      <FiCheck
                        className={twMerge(
                          "transition-all duration-[0.375s] ease-in-out",
                          n.preferred_show_nickname
                            ? "text-green-500 scale-100"
                            : "scale-0 text-neutral-400"
                        )}
                      />
                    </button>
                  </div>
                </section>
              )}
              {diff && (
                <section>
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full px-8 py-3.5 rounded bg-neutral-900 lg:hover:bg-neutral-600 text-white font-medium text-lg"
                  >
                    {$data.buttons.submit[lang]}
                  </button>
                </section>
              )}
            </form>
          </main>
        </>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;
  const { props, redirects } = returns();
  if (!user) return redirects("/", false);
  return props({ user });
};
