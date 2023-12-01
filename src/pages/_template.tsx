import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { User } from "~/types";

type Props = {
  user: User;
};

export default function Template({ user }: Props) {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;
  return { props: { user } };
};
