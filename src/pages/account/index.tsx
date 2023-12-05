import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { returns } from "~/server/ssr";
import type { User } from "~/types";

export default function Account() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;
  const { props, redirects } = returns();
  if (!user) return redirects("/", false);
  return redirects("/account/profile", false);
};
