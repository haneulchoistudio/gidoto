import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { User } from "~/types";

type Props = {
  user: User;
};

export default function GroupDetailPrayerDetailEdit({ user }: Props) {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ObjectId.isValid(ctx.query._id as string)) {
    return { redirect: { destination: "/groups/not-found", permanent: false } };
  }
  if (!ObjectId.isValid(ctx.query._id_prayer as string)) {
    return {
      redirect: {
        destination: `/groups/${ctx.query._id}/prayers/not-found`,
        permanent: false,
      },
    };
  }
  //   console.log(ctx.query, ctx.params);
  // { _id: '65698d314b2960b0a501bb42', _id_prayer: '32132131' } { _id: '65698d314b2960b0a501bb42', _id_prayer: '32132131' }
  const user = (await getSession(ctx)) as unknown as User;
  return { props: { user } };
};
