import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { returns } from "~/server/ssr";
import { validateDbQueryId } from "~/server/utils";
import type { Group, Prayer, User } from "~/types";
import { db } from "~/server/mongo";
import { useLanguage, useTheme } from "~/contexts";
import { $ } from "~/client/utils";

const BinaryActionScreen = dynamic(() =>
  import("~/components/status").then(
    (component) => component.BinaryActionScreen
  )
);
const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

type Props = {
  user: User;
  group: Group;
  prayer: Prayer;
};

export default function GroupDetailPrayerDetailDelete({
  user,
  group,
  prayer,
}: Props) {
  const { lang, switchLanguage } = useLanguage();
  const { theme, switchTheme } = useTheme();
  const $data = $("pages", "deletePrayer");
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function deletePrayer() {
    const confirmDelete = confirm(
      lang === "en"
        ? `Are you sure you want to delete '${prayer.data.title}'?`
        : `'${prayer.data.title}'를 정말로 삭제하시겠습니까?`
    );

    if (!confirmDelete) {
      setError("");
      setLoading(false);
      return;
    }

    setError("");
    setLoading(true);

    const response = await fetch("/api/groups/prayers/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prayer),
    });

    if (!response.ok) {
      setError("Failed to delete the prayer. Try it again.");
      setLoading(false);
      return;
    }
    await router.push(
      {
        pathname: `/groups/${group._id}`,
        query: { _id: group._id as string },
      },
      `/groups/${group._id}`
    );
    setLoading(false);
  }
  async function goBack() {
    setError("");
    await router.push(
      {
        pathname: `/groups/${group._id}/prayers/${prayer._id}`,
        query: { _id: group._id as string, _id_prayer: prayer._id as string },
      },
      `/groups/${group._id}/prayers/${prayer._id}`
    );
  }

  return loading ? (
    <Loading
      message={
        lang === "en"
          ? `Deleting the prayer '${group.data.name}'...`
          : `'${group.data.name}'을 삭제중입니다...`
      }
      fullScreen
    />
  ) : (
    <div>
      {error && (
        <p className="text-center text-red-500 bg-red-500/10 border-b border-red-500/25 px-8 md:px-12 lg:px-16 2xl:px-32 py-2.5 lg:py-4">
          {error}
        </p>
      )}
      <BinaryActionScreen
        title={$data.titles.head[lang]}
        description={prayer.data.title}
        action={{
          positive: {
            name: $data.buttons.delete[lang],
            onClick: deletePrayer,
          },
          negative: {
            name: $data.buttons.goBack[lang],
            onClick: goBack,
          },
        }}
      />
    </div>
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
