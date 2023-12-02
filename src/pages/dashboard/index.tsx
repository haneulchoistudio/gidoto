import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiEye, FiPlus, FiSearch } from "react-icons/fi";
import { db } from "~/server/mongo";
import { Group, GroupProps, User } from "~/types";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);

type Props = {
  user: User;
  groups: Group[];
  notifications: {
    _id: string;
    name: string;
    theme: GroupProps["theme"];
  }[];
};

export default function Dashboard({ user, groups, notifications }: Props) {
  const router = useRouter();

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
              <ul className="grid grid-col-1 md:grid-cols-2 gap-5 lg:gap-8">
                {groups.map((group, idx) => (
                  <div
                    onClick={async () => {
                      await router.push(
                        {
                          pathname: `/groups/${group._id}`,
                          query: { _id: group._id as string },
                        },
                        `/groups/${group._id}`
                      );
                    }}
                    key={idx}
                    className="w-full grid grid-cols-12 gap-3.5 lg:gap-5 border  rounded lg:hover:border-neutral-600 px-5 py-3.5 transition-all duration-[0.35s] ease-in-out cursor-pointer group"
                  >
                    <div className="col-span-9">
                      <h4 className="font-medium text-lg lg:text-xl">
                        {group.data.name}
                      </h4>
                      <p className="text-neutral-600 font-light truncate">
                        {group.data.description}
                      </p>
                    </div>
                    <div className="col-span-3 flex justify-end items-center">
                      <Link
                        href={{
                          pathname: `/groups/${group._id}`,
                          query: { _id: group._id as string },
                        }}
                        as={`/groups/${group._id}`}
                        className="w-[37.5px] h-[37.5px] rounded border bg-neutral-100 flex justify-center items-center lg:group-hover:border-neutral-900/25 text-neutral-600 lg:group-hover:text-neutral-900 lg:group-hover:bg-white lg:group-hover:hover:border-neutral-900"
                      >
                        <FiEye />
                      </Link>
                    </div>
                    {group.data.user_responsible === user._id && (
                      <div className="col-span-12 flex items-center gap-x-2.5">
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await router.push(
                              {
                                pathname: `/groups/${group._id}/edit`,
                                query: { _id: group._id as string },
                              },
                              `/groups/${group._id}/edit`
                            );
                          }}
                          className="font-medium lg:text-blue-400 lg:group-hover:text-blue-500 text-blue-500 lg:group-hover:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await router.push(
                              {
                                pathname: `/groups/${group._id}/delete`,
                                query: { _id: group._id as string },
                              },
                              `/groups/${group._id}/delete`
                            );
                          }}
                          className="font-medium lg:text-red-400 lg:group-hover:text-red-500 text-red-500 lg:group-hover:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
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
              <ul className="flex flex-col w-full">
                {notifications.map((each, idx) => (
                  <div
                    key={idx}
                    className="py-2.5 lg:hover:px-3.5 border border-transparent lg:hover:border-neutral-600/25 rounded transition-all duration-[0.35s] ease-in-out cursor-pointer"
                  >
                    <p className="tex-sm lg:text-base text-neutral-600">
                      {each.name}&apos;s member invites you to join.
                    </p>
                    <ul className="flex items-center">
                      <Link
                        href={{
                          pathname: `/groups/${each._id}`,
                          query: { _id: each._id },
                        }}
                        as={`/groups/${each._id}`}
                        className="underline text-blue-500 text-sm lg:text-base font-medium lg:no-underline lg:hover:underline lg:hover:text-blue-400"
                      >
                        View
                      </Link>
                    </ul>
                  </div>
                ))}
              </ul>
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
  const groupDocs = await db("groups");

  if (user.data.groups.length >= 1) {
    groups = await Promise.all(
      user.data.groups.map(async (group) => {
        return (await groupDocs.findOne({ _id: group })) as Group;
      })
    );
  }

  let notifications: any[] = [];

  notifications = await groupDocs
    .find({ "data.emails": user.data.email })
    .toArray();

  notifications = notifications.map((each) => ({
    _id: each._id,
    name: each.data.name,
    theme: each.data.theme,
  }));

  return {
    props: { user, groups, notifications },
  };
};
