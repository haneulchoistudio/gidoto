import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { returns } from "~/server/ssr";
import { validateDbQueryId } from "~/server/utils";
import type { User } from "~/types";

type Props = {
  user: User;
};

export default function GroupDetailPrayerDetail({ user }: Props) {
  return <></>;
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
  return props({ user });
};
