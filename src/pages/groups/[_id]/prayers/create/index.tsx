import dynamic from "next/dynamic";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { db } from "~/server/mongo";
import { returns } from "~/server/ssr";
import { appendToPwQ, getPwQ, len, validateDbQueryId } from "~/server/utils";
import { $, txt } from "~/client/utils";
import { Group, PrayerProps, User } from "~/types";
import { twMerge } from "tailwind-merge";
import { useLanguage, useTheme } from "~/contexts";
import { FiCheck } from "react-icons/fi";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);
const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

type Props = {
  user: User;
  group: Group;
};

export default function GroupsCreate({ user, group }: Props) {
  const { lang, switchLanguage } = useLanguage();
  const { theme: _, switchTheme } = useTheme();
  const $data = $("pages", "createPrayer");
  const router = useRouter();

  const [p, setP] = useState<PrayerProps>({
    user_responsible: user._id as string,
    user_image: user.data.image,
    user_name: user.data.name,
    group_responsible: group._id as string,
    anonymous: false,
    prayer_status: "incomplete",
    title: "",
    short: "",
    long: "",
    tags: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const txt_title = txt(p.title);
    const txt_short = txt(p.short);
    const txt_long = txt(p.long);

    let evaluation: boolean = false;
    // _is_empty_string
    evaluation = [txt_title, txt_short, txt_long]
      .map((each) => each.empty())
      .some(Boolean);
    if (evaluation) {
      setError("Title, short, or long description field(s) is(are) empty.");
      setLoading(false);
      return;
    }

    // _is_over_max
    evaluation = [txt_short].map((each) => each.isOverMax(30)).some(Boolean);
    if (evaluation) {
      setError(
        "Short description must be less than or equal to 30 characters."
      );
      setLoading(false);
      return;
    }

    // _is_below_min
    evaluation = [txt_title, txt_short, txt_long]
      .map((each) => each.isBelowMin(4))
      .some(Boolean);
    if (evaluation) {
      setError("Text fields must be at least 4 characters.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/groups/prayers/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });

    if (!response.ok) {
      setError("Failed to create the prayer. Try it again.");
      setLoading(false);
      return;
    }

    const json = (await response.json()) as { _id_prayer: string };

    await router.push(
      {
        pathname: `/groups/${group._id}/prayers/${json._id_prayer}`,
        query: { _id: group._id as string, _id_prayer: json._id_prayer },
      },
      `/groups/${group._id}/prayers/${json._id_prayer}`
    );

    setLoading(false);
    return;
  }

  return loading ? (
    <Loading
      message={
        lang === "en"
          ? `Creating the prayers...`
          : "기도제목을 생성 중 입니다..."
      }
      fullScreen
    />
  ) : (
    <>
      <header className="px-8 md:px-12 lg:px-16 2xl:px-32 flex justify-between items-center py-4 lg:py-5">
        <div className="flex items-center gap-x-2.5">
          <Link
            href={{
              pathname: `/groups/${group._id}`,
              query: { _id: group._id as string },
            }}
            as={`/groups/${group._id}`}
            className="w-[37.5px] h-[37.5px] rounded border bg-neutral-100 flex justify-center items-center lg:hover:border-neutral-900 text-neutral-600 lg:hover:text-white lg:hover:bg-neutral-900"
          >
            <HiArrowLeft />
          </Link>
          <h1 className="font-bold text-lg lg:text-xl">
            {$data.titles.head[lang]}
          </h1>
        </div>
        <ProfileButton
          image={user.data.image}
          isOnFreePlan={user.data.subscription === "free"}
        />
      </header>
      <main className="px-8 md:px-12 lg:px-16 2xl:px-32 py-8 lg:py-12 h-auto">
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
              {$data.labels.title[lang]}
            </h4>
            <input
              value={p.title}
              onChange={(e) => setP((p) => ({ ...p, title: e.target.value }))}
              type="text"
              className="px-4 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
              placeholder={$data.placeholders.title[lang]}
            />
          </section>
          <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
            <h4 className="font-medium text-lg lg:text-xl">
              {$data.labels.short[lang]}
            </h4>
            <input
              value={p.short}
              onChange={(e) => setP((p) => ({ ...p, short: e.target.value }))}
              type="text"
              className="px-4 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
              placeholder={$data.placeholders.short[lang]}
            />
          </section>
          <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
            <h4 className="font-medium text-lg lg:text-xl">
              {$data.labels.long[lang]}
            </h4>
            <textarea
              rows={4}
              value={p.long}
              onChange={(e) => setP((p) => ({ ...p, long: e.target.value }))}
              className="px-4 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
              placeholder={$data.placeholders.long[lang]}
            />
          </section>
          <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
            <div className="flex justify-between items-center">
              <p
                className={twMerge(
                  "text-sm font-mono lg:text-base",
                  p.anonymous ? "text-green-500" : "text-neutral-400"
                )}
              >
                {$data.paragraphs.anonymous[lang]}
              </p>
              <button
                type="button"
                onClick={() => {
                  setP((p) => ({ ...p, anonymous: !p.anonymous }));
                }}
                className={twMerge(
                  "relative overflow-hidden w-[22.5px] h-[22.5px] lg:w-[25px] lg:h-[25px] rounded-full border flex justify-center items-center group ring",
                  p.anonymous
                    ? "border-transparent ring-green-500"
                    : "lg:hover:border-blue-500 ring-transparent"
                )}
              >
                <FiCheck
                  className={twMerge(
                    "transition-all duration-[0.375s] ease-in-out",
                    p.anonymous
                      ? "text-green-500 scale-100"
                      : "scale-0 text-neutral-400"
                  )}
                />
              </button>
            </div>
          </section>
          <section>
            <button
              disabled={loading}
              type="submit"
              className="w-full px-8 py-3.5 rounded bg-neutral-900 lg:hover:bg-neutral-600 text-white font-medium text-lg"
            >
              {$data.buttons.submit[lang]}
            </button>
          </section>
        </form>
      </main>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirects } = returns();
  const { _id, v } = validateDbQueryId(ctx, "_id");
  if (!v)
    return redirects(
      _id ? "/groups/not-found" : `/groups/not-found?_id=${_id}`,
      false
    );
  const { pathname } = getPwQ(["groups", "prayers"], _id, ["_id"]);
  const user = (await getSession(ctx)) as unknown as User;
  if (!user) return redirects("/", false);
  const groupDocs = await db("groups");
  const group = (await groupDocs.findOne({ _id })) as Group;
  if (!group) return redirects(`/groups/not-found?_id=${_id}`, false);
  if (len(group.data.prayers).eq(10)) {
    const to = appendToPwQ(pathname, "create", "limit");
    return redirects(to, false);
  }
  return props({ user, group });
};
