import dynamic from "next/dynamic";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { HiArrowLeft } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { db } from "~/server/mongo";
import { validateDbQueryId } from "~/server/utils";
import { returns } from "~/server/ssr";
import type { Group, GroupProps, User } from "~/types";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);
const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

type Props = {
  user: User;
  group: Group;
};

export default function GroupDetailEdit({ user, group }: Props) {
  const router = useRouter();

  const [o, setO] = useState<GroupProps>(group.data);
  const [n, setN] = useState<GroupProps>(group.data);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [diff, setDiff] = useState<boolean>(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (![n.name.trim(), n.description.trim()].every(Boolean)) {
      setError("Your must fill in your group name and description fields.");
      setLoading(false);
      return;
    }

    if (![n.contact.email.trim(), n.contact.email.trim()].every(Boolean)) {
      setError("Your must fill in your group leader's name and email fields.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/groups/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: group._id, data: n }),
    });

    if (!response.ok) {
      setError("Failed to create your group. Try it again.");
      setLoading(false);
      return;
    }

    await router.push(
      {
        pathname: `/groups/${group._id}`,
        query: { _id: group._id as string },
      },
      `/groups/${group._id}`
    );

    setLoading(false);
    return;
  }

  useEffect(() => {
    const different = [
      o.contact.name !== n.contact.name,
      o.contact.email !== n.contact.email,
      o.contact.phone !== n.contact.phone,
      o.address !== n.address,
      o.name !== n.name,
      o.description !== n.description,
      o.accounts.instagram !== n.accounts.instagram,
      o.accounts.kakaotalk !== n.accounts.kakaotalk,
      o.theme !== n.theme,
    ].some(Boolean);
    setDiff(different);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  return loading ? (
    <Loading message="Creating the group..." fullScreen />
  ) : (
    <>
      <header className="px-8 md:px-12 lg:px-16 2xl:px-32 flex justify-between items-center py-4 lg:py-5">
        <div className="flex items-center gap-x-2.5">
          <Link
            href={{
              pathname: `/groups/${group._id}`,
              query: { _id: group._id as string },
            }}
            as={`/groups/${group._id}`}
            className="w-[37.5px] h-[37.5px] rounded border bg-neutral-100 flex justify-center items-center lg:hover:border-neutral-900 text-neutral-600 lg:hover:text-white lg:hover:bg-neutral-900"
          >
            <HiArrowLeft />
          </Link>
          <h1 className="font-bold text-lg lg:text-xl">Edit Group</h1>
        </div>
        <div className="flex items-center gap-x-2.5">
          {diff && (
            <span className="flex items-center gap-x-1.5 text-blue-500">
              <span className="w-[17.5px] h-[17.5px] lg:w-[22.5px] lg:h-[22.5px] rounded-full bg-blue-500 text-white flex justify-center items-center">
                <FiCheck />
              </span>
              <span>Editting</span>
            </span>
          )}
          <ProfileButton
            image={user.data.image}
            isOnFreePlan={user.data.subscription === "free"}
          />
        </div>
      </header>
      <main className="px-8 md:px-12 lg:px-16 2xl:px-32 py-8 lg:py-12 h-auto">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-y-4 lg:gap-y-5 max-w-[500px] mx-auto z-10 relative bg-transparent"
        >
          {error && (
            <p className="p-6 lg:p-8 rounded border bg-red-400/10 border-red-400/25 text-red-400 text-center">
              {error}
            </p>
          )}
          <section className="flex flex-col gap-y-4 lg:gap-y-5">
            <h4 className="font-medium text-lg lg:text-xl">
              Select your group theme.
            </h4>
            <div className="flex flex-col gap-y-1.5 lg:gap-y-2.5">
              <ul className="grid grid-cols-4 gap-4">
                <button
                  disabled={n.theme === "default:default"}
                  onClick={() =>
                    setN((g) => ({ ...g, theme: "default:default" }))
                  }
                  type="button"
                  className={twMerge(
                    "px-3 py-1.5 rounded uppercase text-xs md:text-base font-medium tracking-[0.075rem] border transform",
                    n.theme === "default:default"
                      ? "-translate-y-2.5 bg-neutral-600 text-white"
                      : "-translate-y-0 border-neutral-600 text-neutral-600 bg-transparent lg:opacity-75 lg:hover:opacity-100 lg:hover:scale-105"
                  )}
                >
                  Basic
                </button>
                <button
                  disabled={n.theme === "adom:red"}
                  onClick={() => setN((g) => ({ ...g, theme: "adom:red" }))}
                  type="button"
                  className={twMerge(
                    "px-3 py-1.5 rounded uppercase text-xs md:text-base font-medium tracking-[0.075rem] border transform",
                    n.theme === "adom:red"
                      ? "-translate-y-2.5 bg-red-500 text-white"
                      : "-translate-y-0 border-red-500 text-red-500 bg-transparent lg:opacity-75 lg:hover:opacity-100 lg:hover:scale-105"
                  )}
                >
                  Adom
                </button>
                <button
                  disabled={n.theme === "tsahov:yellow"}
                  onClick={() =>
                    setN((g) => ({ ...g, theme: "tsahov:yellow" }))
                  }
                  type="button"
                  className={twMerge(
                    "px-3 py-1.5 rounded uppercase text-xs md:text-base font-medium tracking-[0.075rem] border transform",
                    n.theme === "tsahov:yellow"
                      ? "-translate-y-2.5 bg-amber-500 text-white"
                      : "-translate-y-0 border-amber-500 text-amber-500 bg-transparent lg:opacity-75 lg:hover:opacity-100 lg:hover:scale-105"
                  )}
                >
                  Tsahov
                </button>
                <button
                  disabled={n.theme === "kahol:blue"}
                  onClick={() => setN((g) => ({ ...g, theme: "kahol:blue" }))}
                  type="button"
                  className={twMerge(
                    "px-3 py-1.5 rounded uppercase text-xs md:text-base font-medium tracking-[0.075rem] border transform",
                    n.theme === "kahol:blue"
                      ? "-translate-y-2.5 bg-blue-500 text-white"
                      : "-translate-y-0 border-blue-500 text-blue-500 bg-transparent lg:opacity-75 lg:hover:opacity-100 lg:hover:scale-105"
                  )}
                >
                  Kahol
                </button>
              </ul>
              <p className={twMerge("text-neutral-600 text-sm font-light")}>
                You have selected the{" "}
                {n.theme === "default:default"
                  ? "basic theme."
                  : `${n.theme.split(":")[0]} theme. ${
                      n.theme.split(":")[0]
                    } means ${n.theme.split(":")[1]} in Hebrew.`}
              </p>
            </div>
          </section>
          <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
            <h4 className="font-medium text-lg lg:text-xl">
              Name your prayer group.
            </h4>
            <input
              value={n.name}
              onChange={(e) => setN((g) => ({ ...g, name: e.target.value }))}
              type="text"
              className="px-4 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
              placeholder="Example Church Young Adults"
            />
          </section>
          <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
            <h4 className="font-medium text-lg lg:text-xl">
              Describe the prayer group.
            </h4>
            <textarea
              value={n.description}
              onChange={(e) =>
                setN((g) => ({ ...g, description: e.target.value }))
              }
              rows={4}
              className="px-4 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400 "
              placeholder="We are the young adult team at Example church. We gather online at Gidoto to pray for one another if anyone needs prayers until it is fulfilled by God."
            />
          </section>
          <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
            <div className="flex flex-col gap-y-0.5 lg:gap-y-1">
              <h4 className="font-medium text-lg lg:text-xl">
                Contact the leader.
              </h4>
              <p className="text-sm text-neutral-600 lg:text-base leading-[1.67] lg:leading-[1.67]">
                Fill them out if the leader of the group{" "}
                <strong>IS NOT YOU.</strong>
              </p>
            </div>
            <ul className=" flex flex-col gap-y-1.5 lg:gap-y-2 w-full">
              <div className="relative w-full">
                <input
                  value={n.contact.email}
                  onChange={(e) =>
                    setN((g) => ({
                      ...g,
                      contact: { ...g.contact, email: e.target.value },
                    }))
                  }
                  type="email"
                  className="relative w-full z-0 pr-4 pl-14 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
                  placeholder="The leader's email."
                />
                <span className="text-sm font-medium absolute z-10 top-1/2 left-3 transform -translate-y-1/2 text-blue-500">
                  Email
                </span>
              </div>
              <div className="relative w-full">
                <input
                  value={n.contact.name}
                  onChange={(e) =>
                    setN((g) => ({
                      ...g,
                      contact: { ...g.contact, name: e.target.value },
                    }))
                  }
                  type="text"
                  className="relative w-full z-0 pr-4 pl-14 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
                  placeholder="The leader's name."
                />
                <span className="text-sm font-medium absolute z-10 top-1/2 left-3 transform -translate-y-1/2 text-blue-500">
                  Name
                </span>
              </div>
              <div className="relative w-full">
                <input
                  value={n.contact.phone}
                  onChange={(e) =>
                    setN((g) => ({
                      ...g,
                      contact: { ...g.contact, phone: e.target.value },
                    }))
                  }
                  type="text"
                  className="relative w-full z-0 pr-4 pl-14 py-3 rounded text-neutral-600 focus:text-neutral-900 placeholder:text-neutral-400"
                  placeholder="The leader's phone."
                />
                <span className="text-sm font-medium absolute z-10 top-1/2 left-3 transform -translate-y-1/2 text-blue-500">
                  Phone
                </span>
              </div>
            </ul>
          </section>
          <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
            <div className="flex flex-col gap-y-0.5 lg:gap-y-1">
              <h4 className="font-medium text-lg lg:text-xl">
                Social accounts of the group.
              </h4>
              <p className="text-sm text-neutral-600 lg:text-base leading-[1.67] lg:leading-[1.67]">
                Enter the social links{" "}
                <strong className="uppercase">if you have them.</strong>
              </p>
            </div>
            <ul className=" flex flex-col gap-y-1.5 lg:gap-y-2 w-full">
              <div className="relative w-full">
                <input
                  value={n.accounts.instagram}
                  onChange={(e) =>
                    setN((g) => ({
                      ...g,
                      accounts: { ...g.accounts, instagram: e.target.value },
                    }))
                  }
                  type="text"
                  className="relative w-full z-0 pr-4 pl-20 py-3 rounded text-neutral-600 text-sm placeholder:text-neutral-400 focus:text-neutral-900"
                  placeholder="Paste your id here."
                />
                <span className="text-sm font-medium absolute z-10 top-1/2 left-3 transform -translate-y-1/2 text-blue-500">
                  Instagram
                </span>
              </div>
              <div className="relative w-full">
                <input
                  value={n.accounts.kakaotalk}
                  onChange={(e) =>
                    setN((g) => ({
                      ...g,
                      accounts: { ...g.accounts, kakaotalk: e.target.value },
                    }))
                  }
                  type="text"
                  className="relative w-full z-0 pr-4 pl-20 py-3 rounded text-neutral-600 text-sm placeholder:text-neutral-400 focus:text-neutral-900"
                  placeholder="Paste your link here."
                />
                <span className="text-sm font-medium absolute z-10 top-1/2 left-3 transform -translate-y-1/2 text-blue-500">
                  Kakaotalk
                </span>
              </div>
            </ul>
          </section>
          {diff && (
            <section>
              <button
                disabled={loading}
                type="submit"
                className="w-full px-8 py-3.5 rounded bg-neutral-900 lg:hover:bg-neutral-600 text-white font-medium text-lg"
              >
                Edit this group.
              </button>
            </section>
          )}
        </form>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { _id, v } = validateDbQueryId(ctx, "_id");
  const { props, redirects } = returns();
  if (!v)
    return redirects(
      _id ? `/groups/not-found?_id=${_id}` : "/groups/not-found",
      false
    );
  const user = (await getSession(ctx)) as unknown as User;
  if (!user) return redirects("/", false);
  const groupDocs = await db("groups");
  const group = (await groupDocs.findOne({ _id })) as Group;
  return props({ user, group });
};
