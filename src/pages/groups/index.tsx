import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { returns } from "~/server/ssr";
import type { User } from "~/types";

export default function Groups() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirects } = returns();
  const user = (await getSession(ctx)) as unknown as User;
  if (!user) return redirects("/", false);
  return redirects("/dashboard", false);
};
