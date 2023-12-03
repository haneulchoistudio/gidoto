import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { returns } from "~/server/ssr";
import type { User } from "~/types";

type Props = {
  user: User;
};

export default function AccountProfile({ user }: Props) {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;
  const { props, redirects } = returns();
  if (!user) return redirects("/", false);
  return props({ user });
};
