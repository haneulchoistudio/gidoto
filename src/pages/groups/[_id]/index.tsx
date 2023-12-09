import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { db } from "~/server/mongo";
import { Group, Prayer, User } from "~/types";
import { len, validateDbQueryId } from "~/server/utils";
import { returns } from "~/server/ssr";
import { useLanguage, useTheme } from "~/contexts";
import { $ } from "~/client/utils";

const GroupDetailHeader = dynamic(() =>
  import("~/components/detail").then((component) => component.GroupDetailHeader)
);

const GroupDetailDescription = dynamic(() =>
  import("~/components/detail").then(
    (component) => component.GroupDetailDescription
  )
);
const GroupDetailMembers = dynamic(() =>
  import("~/components/detail").then(
    (component) => component.GroupDetailMembers
  )
);
const GroupDetailAccounts = dynamic(() =>
  import("~/components/detail").then(
    (component) => component.GroupDetailAccounts
  )
);
const GroupDetailPrayers = dynamic(() =>
  import("~/components/detail").then(
    (component) => component.GroupDetailPrayers
  )
);
const GroupDetailInvitation = dynamic(() =>
  import("~/components/detail").then(
    (component) => component.GroupDetailInvitation
  )
);
const GroupDetailContactLeader = dynamic(() =>
  import("~/components/detail").then(
    (component) => component.GroupDetailContactLeader
  )
);

type Props = {
  user: User;
  group: Group;
  members: { _id: string; email: string; image: string }[];
  prayers: Prayer[];
};

export default function GroupDetail({ user, group, members, prayers }: Props) {
  const [theme, __] = useState<(typeof group)["data"]["theme"]>(
    group.data.theme
  );

  function ifMember(): boolean {
    function _ifJustMember() {
      return group.data.members.includes(user._id as string);
    }
    function _ifResponsibleMember() {
      return group.data.user_responsible === user._id;
    }
    return _ifJustMember() || _ifResponsibleMember();
  }

  return (
    <>
      <GroupDetailHeader user={user} group={group} theme={theme} />
      <GroupDetailDescription user={user} group={group} theme={theme} />
      <GroupDetailInvitation user={user} group={group} />
      {ifMember() && (
        <div className="flex flex-col px-8 md:px-12 lg:px-16 2xl:px-32 py-8 lg:py-12 md:grid grid-cols-1 md:grid-cols-5 lg:grid-cols-12 gap-8 lg:gap-16">
          <article className="md:col-span-3 lg:col-span-7 2xl:col-span-8">
            <GroupDetailPrayers
              user={user}
              group={group}
              prayers={prayers}
              theme={theme}
            />
          </article>
          <article className="md:col-span-2 lg:col-span-5 2xl:col-span-4 flex flex-col gap-y-8">
            <GroupDetailMembers
              group={group}
              user={user}
              emails={group.data.emails}
              members={members.map((each) => ({
                ...each,
                num_prayers: prayers.filter(
                  (pry) => pry.data.user_responsible === each._id
                ).length,
              }))}
              theme={theme}
            />
            <GroupDetailAccounts
              instagram={
                group.data.accounts.instagram
                  ? [
                      "https://instagram.com",
                      group.data.accounts.instagram,
                    ].join("/")
                  : ""
              }
              kakaotalk={
                group.data.accounts.kakaotalk
                  ? group.data.accounts.kakaotalk
                  : ""
              }
            />
            <GroupDetailContactLeader {...group.data.contact} />
          </article>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { _id, v } = validateDbQueryId(ctx, "_id");
  const { props, redirects } = returns();
  if (!v) return redirects(`/groups/not-found?_id=${_id}`, false);
  const user = (await getSession(ctx)) as unknown as User;
  if (!user) return redirects("/", false);
  const groupDocs = await db("groups");
  const group = (await groupDocs.findOne({ _id })) as Group;

  if (
    !(
      group.data.members.includes(user._id as string) ||
      group.data.user_responsible === (user._id as string)
    )
  ) {
    return redirects("/", false);
  }
  let members: any[] = [];
  if (len(group.data.members).geq(1)) {
    const userDocs = await db("users");
    members = await Promise.all(
      group.data.members.map(async (member_id) => {
        const member = (await userDocs.findOne({ _id: member_id })) as User;
        return member;
      })
    );
    members = members.map((each) => ({
      _id: each?._id,
      email: each?.data.email,
      image: each?.data.image,
    }));
  }
  let prayers: any[] = [];
  if (len(group.data.prayers).geq(1)) {
    const prayerDocs = await db("prayers");
    prayers = await Promise.all(
      group.data.prayers.map(async (prayer_id) => {
        const prayer = (await prayerDocs.findOne({ _id: prayer_id })) as Prayer;
        return prayer;
      })
    );
  }
  return props({ user, group, prayers, members });
};
