import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import type { GroupProps, User } from "~/types";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);
const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

type Props = {
  user: User;
};

export default function GroupsCreate({ user }: Props) {
  const router = useRouter();

  const [g, setG] = useState<GroupProps>({
    user_responsible: user._id as string,
    theme: "default:default",
    name: "",
    description: "",
    address: "",
    accounts: { instagram: "", kakaotalk: "" },
    contact: { email: user.data.email, name: user.data.name, phone: "" },
    emails: [],
    members: [],
    prayers: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (![g.name.trim(), g.description.trim()].every(Boolean)) {
      console.log(g);
      setError("Your must fill in your group name and description fields.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/groups/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(g),
    });

    if (!response.ok) {
      setError("Failed to create your group. Try it again.");
      setLoading(false);
      return;
    }

    const json = (await response.json()) as { _id: string };

    await router.push(
      {
        pathname: `/groups/${json._id}`,
        query: { _id: json._id },
      },
      `/groups/${json._id}`
    );

    setLoading(false);
    return;
  }

  return loading ? (
    <Loading message="Creating the group..." fullScreen />
  ) : (
    <>
      <header className="px-8 md:px-12 lg:px-16 2xl:px-32 flex justify-between items-center py-5 lg:py-6">
        <div className="flex items-center gap-x-2.5">
          <Link
            href={"/dashboard"}
            className="w-[37.5px] h-[37.5px] rounded border bg-neutral-100 flex justify-center items-center lg:hover:border-neutral-900 text-neutral-600 lg:hover:text-white lg:hover:bg-neutral-900"
          >
            <HiArrowLeft />
          </Link>
          <h1 className="font-bold text-lg lg:text-xl">Create Group</h1>
        </div>
        <ProfileButton
          image={user.data.image}
          isOnFreePlan={user.data.subscription === "free"}
        />
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
                  disabled={g.theme === "default:default"}
                  onClick={() =>
                    setG((g) => ({ ...g, theme: "default:default" }))
                  }
                  type="button"
                  className={twMerge(
                    "px-3 py-1.5 rounded uppercase text-xs md:text-base font-medium tracking-[0.075rem] border transform",
                    g.theme === "default:default"
                      ? "-translate-y-2.5 bg-neutral-600 text-white"
                      : "-translate-y-0 border-neutral-600 text-neutral-600 bg-transparent lg:opacity-75 lg:hover:opacity-100 lg:hover:scale-105"
                  )}
                >
                  Basic
                </button>
                <button
                  disabled={g.theme === "adom:red"}
                  onClick={() => setG((g) => ({ ...g, theme: "adom:red" }))}
                  type="button"
                  className={twMerge(
                    "px-3 py-1.5 rounded uppercase text-xs md:text-base font-medium tracking-[0.075rem] border transform",
                    g.theme === "adom:red"
                      ? "-translate-y-2.5 bg-red-500 text-white"
                      : "-translate-y-0 border-red-500 text-red-500 bg-transparent lg:opacity-75 lg:hover:opacity-100 lg:hover:scale-105"
                  )}
                >
                  Adom
                </button>
                <button
                  disabled={g.theme === "tsahov:yellow"}
                  onClick={() =>
                    setG((g) => ({ ...g, theme: "tsahov:yellow" }))
                  }
                  type="button"
                  className={twMerge(
                    "px-3 py-1.5 rounded uppercase text-xs md:text-base font-medium tracking-[0.075rem] border transform",
                    g.theme === "tsahov:yellow"
                      ? "-translate-y-2.5 bg-amber-500 text-white"
                      : "-translate-y-0 border-amber-500 text-amber-500 bg-transparent lg:opacity-75 lg:hover:opacity-100 lg:hover:scale-105"
                  )}
                >
                  Tsahov
                </button>
                <button
                  disabled={g.theme === "kahol:blue"}
                  onClick={() => setG((g) => ({ ...g, theme: "kahol:blue" }))}
                  type="button"
                  className={twMerge(
                    "px-3 py-1.5 rounded uppercase text-xs md:text-base font-medium tracking-[0.075rem] border transform",
                    g.theme === "kahol:blue"
                      ? "-translate-y-2.5 bg-blue-500 text-white"
                      : "-translate-y-0 border-blue-500 text-blue-500 bg-transparent lg:opacity-75 lg:hover:opacity-100 lg:hover:scale-105"
                  )}
                >
                  Kahol
                </button>
              </ul>
              <p className={twMerge("text-neutral-600 text-sm font-light")}>
                You have selected the{" "}
                {g.theme === "default:default"
                  ? "basic theme."
                  : `${g.theme.split(":")[0]} theme. ${
                      g.theme.split(":")[0]
                    } means ${g.theme.split(":")[1]} in Hebrew.`}
              </p>
            </div>
          </section>
          <section className="flex flex-col gap-y-2.5 lg:gap-y-3.5">
            <h4 className="font-medium text-lg lg:text-xl">
              Name your prayer group.
            </h4>
            <input
              value={g.name}
              onChange={(e) => setG((g) => ({ ...g, name: e.target.value }))}
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
              value={g.description}
              onChange={(e) =>
                setG((g) => ({ ...g, description: e.target.value }))
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
                  value={g.contact.email}
                  onChange={(e) =>
                    setG((g) => ({
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
                  value={g.contact.name}
                  onChange={(e) =>
                    setG((g) => ({
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
                  value={g.contact.phone}
                  onChange={(e) =>
                    setG((g) => ({
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
                  value={g.accounts.instagram}
                  onChange={(e) =>
                    setG((g) => ({
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
                  value={g.accounts.kakaotalk}
                  onChange={(e) =>
                    setG((g) => ({
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
          <section>
            <button
              disabled={loading}
              type="submit"
              className="w-full px-8 py-3.5 rounded bg-neutral-900 lg:hover:bg-neutral-600 text-white font-medium text-lg"
            >
              Create this group.
            </button>
          </section>
        </form>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;
  return { props: { user } };
};
