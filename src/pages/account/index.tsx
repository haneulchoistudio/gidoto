import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { User } from "~/types";

export default function Account() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;

  if (!user) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { redirect: { destination: "/account/profile", permanent: false } };
};
