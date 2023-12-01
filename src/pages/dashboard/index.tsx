import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FiPlus, FiSearch } from "react-icons/fi";
import { db } from "~/server/mongo";
import { Group, User } from "~/types";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);

type Props = {
  user: User;
  groups: Group[];
  notifications: any[];
};

export default function Dashboard({ user, groups, notifications }: Props) {
  return (
    <>
      <header className="px-8 md:px-12 lg:px-16 2xl:px-32 flex justify-between items-center py-5 lg:py-6">
        <h1 className="font-bold text-lg lg:text-xl">Dashboard</h1>
        <ProfileButton
          image={user.data.image}
          isOnFreePlan={user.data.subscription === "free"}
        />
      </header>
      <main className="px-8 md:px-12 lg:px-16 2xl:px-32 py-8 lg:py-12 md:grid md:grid-cols-5 lg:grid-cols-12 flex flex-col gap-5 md:gap-8 lg:gap-12">
        <div className="md:col-span-3 lg:col-span-7 2xl:col-span-8">
          <article className="flex flex-col gap-y-4 lg:gap-y-5">
            <div className="flex justify-between items-center gap-x-3.5 lg:gap-x-5">
              <h2 className="font-medium text-xl lg:text-2xl">Groups</h2>
              <ul className="flex items-center gap-x-2.5 lg:gap-x-3.5">
                <Link
                  href={"/groups/join"}
                  className="text-sm lg:text-base flex items-center gap-x-1 text-blue-500 underline lg:no-underline lg:text-neutral-600 lg:hover:text-blue-500 lg:hover:underline"
                >
                  <span>Join</span>
                  <FiSearch />
                </Link>
                <Link
                  href={"/groups/create"}
                  className="text-sm lg:tex-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
                >
                  <span>Create</span>
                  <FiPlus className="text-lg lg:text-xl" />
                </Link>
              </ul>
            </div>
            {groups.length >= 1 ? (
              <ul></ul>
            ) : (
              <p className="p-6 lg:p-8 rounded border bg-neutral-100 text-neutral-600 text-center">
                You do not have a group yet.
              </p>
            )}
          </article>
        </div>
        <div className="md:col-span-2 lg:col-span-5 2xl:col-span-4">
          <article className="flex flex-col gap-y-4 lg:gap-y-5">
            <h2 className="font-medium text-xl lg:text-2xl">Notifications</h2>
            {notifications.length >= 1 ? (
              <ul></ul>
            ) : (
              <p className="p-6 lg:p-8 rounded border bg-neutral-100 text-neutral-600 text-center">
                You do not have a notificiation.
              </p>
            )}
          </article>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;

  if (!user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  let groups: Group[] = [];

  if (user.data.groups.length >= 1) {
    const groupDocs = await db("groups");
    groups = await Promise.all(
      user.data.groups.map(async (group) => {
        return (await groupDocs.findOne({ _id: group })) as Group;
      })
    );
  }

  let notifications: any[] = [];

  return {
    props: { user, groups, notifications },
  };
};
