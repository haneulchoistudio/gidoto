import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { User } from "~/types";

export default function GroupDetailPrayers() {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ObjectId.isValid(ctx.query._id as string)) {
    return { redirect: { destination: "/groups/not-found", permanent: false } };
  }

  const user = (await getSession(ctx)) as unknown as User;

  if (!user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  return {
    redirect: { destination: `/groups/${ctx.query._id}`, permanent: false },
  };
};
