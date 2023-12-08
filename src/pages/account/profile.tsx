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
import { useLanguage, useTheme } from "~/contexts";
import { AccountProfileMeta } from "~/components/meta";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);
const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

type Props = {
  user: User;
};

export default function AccountProfile({ user }: Props) {
  const router = useRouter();
  const [o, _o] = useState<UserProps>(user.data);
  const [n, setN] = useState<UserProps>(user.data);
  const [diff, setDiff] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { lang, switchLanguage } = useLanguage();
  const { theme, switchTheme } = useTheme();
  const $data = $("pages", "accountProfile");

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
      o.name !== n.name,
      o.nickname !== n.nickname,
      o.bio !== n.bio,
    ].some(Boolean);
    setDiff(different);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  return (
    <>
      <AccountProfileMeta user={user} />
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
            {lang === "en" ? "Profile" : "프로필"}
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
                ? "To edit your account preferences, "
                : "환경설정은"}
              {lang === "en" ? "go to " : " "}
              <Link
                href={"/account/preferences"}
                className="inline-flex items-enter gap-x-0.5 text-blue-500 lg:hover:underline"
              >
                <span>{lang === "en" ? "Account" : "계정"}</span>
                <span>/</span>
                <span>{lang === "en" ? "Preferences" : "환경설정"}</span>
              </Link>
              {lang === "en" ? "." : " 으로 가주세요."}
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
                  {$data.labels.name[lang]}
                </h4>
                <input
                  value={n.name}
                  onChange={(e) =>
                    setN((p) => ({ ...p, name: e.target.value }))
                  }
                  type="text"
                  className="px-4 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
                  placeholder="Example Church Young Adults"
                />
              </section>
              <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
                <h4 className="font-medium text-lg lg:text-xl">
                  {$data.labels.nickname[lang]}
                </h4>
                <div className="relative w-full">
                  <input
                    value={n.nickname}
                    onChange={(e) =>
                      setN((g) => ({
                        ...g,
                        nickname: e.target.value,
                      }))
                    }
                    type="text"
                    className="relative w-full z-0 pr-4 pl-8 py-3 rounded focus:text-neutral-600 text-blue-400 placeholder:text-neutral-400"
                  />
                  <span className="font-medium absolute z-10 top-1/2 left-3 transform -translate-y-1/2 text-blue-500">
                    @
                  </span>
                </div>
              </section>
              <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
                <h4 className="font-medium text-lg lg:text-xl">
                  {$data.labels.email[lang]}
                </h4>
                <input
                  disabled={true}
                  value={n.email}
                  onChange={(e) =>
                    setN((p) => ({ ...p, nickname: e.target.value }))
                  }
                  type="text"
                  className="px-4 py-3 rounded bg-neutral-50 border-neutral-400/25 text-neutral-400 focus:text-neutral-900 placeholder:text-neutral-400"
                />
              </section>
              <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
                <h4 className="font-medium text-lg lg:text-xl">
                  {$data.labels.bio[lang]}
                </h4>
                <textarea
                  rows={4}
                  value={n.bio}
                  onChange={(e) => setN((p) => ({ ...p, bio: e.target.value }))}
                  className="px-4 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
                  placeholder="Let's introduce yoruself to others in a few sentences."
                />
              </section>
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
