import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { User } from "~/types";

type Props = {
  user: User;
};

export default function GroupDetailEdit({ user }: Props) {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ObjectId.isValid(ctx.query._id as string)) {
    return { redirect: { destination: "/groups/not-found", permanent: false } };
  }
  const user = (await getSession(ctx)) as unknown as User;
  return { props: { user } };
};
