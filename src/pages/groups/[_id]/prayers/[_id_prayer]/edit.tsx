import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { $, txt } from "~/client/utils";
import { returns } from "~/server/ssr";
import { validateDbQueryId } from "~/server/utils";
import type { Group, Prayer, PrayerProps, User } from "~/types";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { db } from "~/server/mongo";
import { useLanguage, useTheme } from "~/contexts";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);
const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

type Props = {
  user: User;
  group: Group;
  prayer: Prayer;
};

export default function GroupDetailPrayerDetailEdit({
  user,
  group,
  prayer,
}: Props) {
  const { lang, switchLanguage } = useLanguage();
  const { theme: _, switchTheme } = useTheme();
  const $data = $("pages", "editPrayer");
  const router = useRouter();

  const [o, setO] = useState<PrayerProps>(prayer.data);
  const [n, setN] = useState<PrayerProps>(prayer.data);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [diff, setDiff] = useState<boolean>(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const txt_title = txt(n.title);
    const txt_short = txt(n.short);
    const txt_long = txt(n.long);

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

    const response = await fetch("/api/groups/prayers/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: prayer._id, data: n }),
    });

    if (!response.ok) {
      setError("Failed to create your prayer. Try it again.");
      setLoading(false);
      return;
    }

    await router.push(
      {
        pathname: `/groups/${group._id}/prayers/${prayer._id}`,
        query: { _id: group._id as string, _id_prayer: prayer._id as string },
      },
      `/groups/${group._id}/prayers/${prayer._id}`
    );

    setLoading(false);
    return;
  }

  useEffect(() => {
    const different = [
      o.title !== n.title,
      o.short !== n.short,
      o.long !== n.long,
    ].some(Boolean);
    setDiff(different);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  return loading ? (
    <Loading
      message={
        lang === "en"
          ? `Editting the prayer...`
          : "기도제목을 수정 중 입니다..."
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
        <div className="flex items-center gap-x-2.5">
          {diff && (
            <span className="flex items-center gap-x-1.5 text-blue-500">
              <span className="w-[17.5px] h-[17.5px] lg:w-[22.5px] lg:h-[22.5px] rounded-full bg-blue-500 text-white flex justify-center items-center">
                <FiCheck />
              </span>
              <span>{lang === "en" ? "Editting" : "수정 중"}</span>
            </span>
          )}
          <ProfileButton
            image={user.data.image}
            isOnFreePlan={user.data.subscription === "free"}
          />
        </div>
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
              value={n.title}
              onChange={(e) => setN((p) => ({ ...p, title: e.target.value }))}
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
              value={n.short}
              onChange={(e) => setN((p) => ({ ...p, short: e.target.value }))}
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
              value={n.long}
              onChange={(e) => setN((p) => ({ ...p, long: e.target.value }))}
              className="px-4 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
              placeholder={$data.placeholders.long[lang]}
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
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirects } = returns();
  const { _id, v: v_id } = validateDbQueryId(ctx, "_id");
  const { _id_prayer, v: v_id_prayer } = validateDbQueryId(ctx, "_id_prayer");
  if (!v_id)
    return redirects(_id ? `/groups/${_id}` : `/groups/not-found`, false);
  if (!v_id_prayer)
    return redirects(
      _id_prayer
        ? `/groups/${_id}/prayers/not-found?_id_prayer=${_id_prayer}`
        : `/groups/${_id}/prayers/not-found`,
      false
    );
  const user = (await getSession(ctx)) as unknown as User;
  if (!user) return redirects("/", false);
  const groupDocs = await db("groups");
  const group = (await groupDocs.findOne({ _id })) as Group;
  const prayerDocs = await db("prayers");
  const prayer = (await prayerDocs.findOne({ _id: _id_prayer })) as Prayer;
  return props({ user, prayer, group });
};
