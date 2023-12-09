import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { $ } from "~/client/utils";
import { useLanguage, useTheme } from "~/contexts";
import { db } from "~/server/mongo";
import { returns } from "~/server/ssr";
import { validateDbQueryId } from "~/server/utils";
import { GroupProps, type Group, type Prayer, type User } from "~/types";

type Props = {
  user: User;
  writer: User;
  group: Group;
  prayer: Prayer;
};

const GroupPrayerHeader = dynamic(() =>
  import("~/components/detail").then((component) => component.GroupPrayerHeader)
);

export default function GroupDetailPrayerDetail({
  user,
  group,
  prayer,
  writer,
}: Props) {
  const { lang, switchLanguage } = useLanguage();
  const { theme: _, switchTheme } = useTheme();
  const $data = $("pages", "prayerDetail");
  const [theme, __] = useState<GroupProps["theme"]>(group.data.theme);

  return (
    <>
      <GroupPrayerHeader
        theme={theme}
        user={user}
        group={group}
        prayer={prayer}
        writer={writer}
      />
      <div className="w-full">
        <section className="px-8 md:px-12 lg:px-16 2xl:px-32 flex flex-col py-8 lg:py-12 max-w-[1080px] mx-auto gap-y-8 lg:gap-y-12">
          <div className="flex flex-col items-start gap-3.5 lg:gap-5">
            <h2 className="font-medium text-xl lg:text-2xl">
              {$data.paragraphs.short[lang]}
            </h2>
            <p className="text-lg lg:text-xl text-neutral-600">
              {prayer.data.short}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3.5 lg:gap-5">
            <h2 className="font-medium text-xl lg:text-2xl">
              &apos;{prayer.data.title}&apos; {$data.paragraphs.long[lang]}
            </h2>
            <p className="text-lg lg:text-xl text-neutral-600 leading-[1.67] lg:leading-[1.67]">
              {prayer.data.long}
            </p>
          </div>
        </section>
      </div>
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

  if (
    ![
      group.data.user_responsible == user._id,
      group.data.members.includes(user._id as string),
    ].some(Boolean)
  ) {
    return redirects("/", false);
  }

  const prayerDocs = await db("prayers");
  const prayer = (await prayerDocs.findOne({ _id: _id_prayer })) as Prayer;

  let writer = user._id === prayer._id ? user : null;

  if (!writer) {
    const userDocs = await db("users");
    writer = await userDocs.findOne({ _id: prayer.data.user_responsible });
  }

  return props({ user, group, prayer, writer });
};
