import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { db } from "~/server/mongo";
import { returns } from "~/server/ssr";
import { appendToPwQ, getPwQ, len, validateDbQueryId } from "~/server/utils";
import { Group, User } from "~/types";

export default function GroupDetailPrayerCreate() {
  return <></>;
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
  const group = (await groupDocs.findOne({ _id: ctx.query._id })) as Group;
  if (!group) return redirects(`/groups/not-found?_id=${_id}`, false);
  if (len(group.data.prayers).eq(10)) {
    const to = appendToPwQ(pathname, "create", "limit");
    return redirects(to, false);
  }
  return props({ user });
};
