import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { db } from "~/server/mongo";
import { Group, Prayer, User } from "~/types";
import { PiHandsPraying } from "react-icons/pi";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);

const Profile = dynamic(() =>
  import("~/components/user").then((component) => component.Profile)
);
type Props = {
  user: User;
  group: Group;
  prayers: Prayer[];
};

export default function GroupDetail({ user, group, prayers: ___ }: Props) {
  const router = useRouter();

  const [theme, _] = useState<(typeof group)["data"]["theme"]>("tsahov:yellow");
  const [prayers, __] = useState<(typeof ___)[number][]>([
    {
      _id: "",
      data: {
        title: "미래의 대한 무확고함 해결",
        short:
          "미래에 대한 두려움이 생기는데, 두렵지 않고 담대하게 나가고 싶어요.",
        long: "요즘 학교에서 공부하며 또 일하며 왜 이 일을 하고 있는지 무의미하게 느껴질 때가 정말 흔합니다. 그때마다 두려움이 생겨요. 두려움이 아닌 담대함으로 긍정적으로 지낼 수 있게 기도해주시면 감사하겠습니다.",
        anonymous: false,
        group_responsible: group._id as string,
        prayer_status: "incomplete",
        tags: ["두려움", "미래", "부정적"],
        user_responsible: user._id as string,
      },
    },
    {
      _id: "",
      data: {
        title: "미래의 대한 무확고함 해결",
        short:
          "미래에 대한 두려움이 생기는데, 두렵지 않고 담대하게 나가고 싶어요.",
        long: "요즘 학교에서 공부하며 또 일하며 왜 이 일을 하고 있는지 무의미하게 느껴질 때가 정말 흔합니다. 그때마다 두려움이 생겨요. 두려움이 아닌 담대함으로 긍정적으로 지낼 수 있게 기도해주시면 감사하겠습니다.",
        anonymous: false,
        group_responsible: group._id as string,
        prayer_status: "incomplete",
        tags: ["두려움", "미래", "부정적"],
        user_responsible: user._id as string,
      },
    },
    {
      _id: "",
      data: {
        title: "미래의 대한 무확고함 해결",
        short:
          "미래에 대한 두려움이 생기는데, 두렵지 않고 담대하게 나가고 싶어요.",
        long: "요즘 학교에서 공부하며 또 일하며 왜 이 일을 하고 있는지 무의미하게 느껴질 때가 정말 흔합니다. 그때마다 두려움이 생겨요. 두려움이 아닌 담대함으로 긍정적으로 지낼 수 있게 기도해주시면 감사하겠습니다.",
        anonymous: false,
        group_responsible: group._id as string,
        prayer_status: "incomplete",
        tags: ["두려움", "미래", "부정적"],
        user_responsible: user._id as string,
      },
    },
  ]);

  return (
    <>
      <header
        className={twMerge(
          "px-8 md:px-12 lg:px-16 2xl:px-32 flex justify-between items-center py-4 lg:py-5",
          theme === "default:default" && "bg-neutral-900/10",
          theme === "adom:red" && "bg-red-400/10",
          theme === "tsahov:yellow" && "bg-amber-500/10",
          theme === "kahol:blue" && "bg-blue-500/10"
        )}
      >
        <div className="flex items-center gap-x-2.5">
          <Link
            href={"/dashboard"}
            className={twMerge(
              "w-[37.5px] h-[37.5px] rounded border bg-white flex justify-center items-center lg:hover:border-neutral-900 text-neutral-600 lg:hover:text-white lg:hover:bg-neutral-900"
            )}
          >
            <HiArrowLeft />
          </Link>
          <h1 className="font-bold text-lg lg:text-xl">{group.data.name}</h1>
        </div>
        <ProfileButton
          image={user.data.image}
          isOnFreePlan={user.data.subscription === "free"}
        />
      </header>
      <article
        className={twMerge(
          "w-full px-8 md:px-12 lg:px-16 2xl:px-32 pb-8 lg:pb-12 pt-4 lg:pt-6 text-neutral-600",
          theme === "default:default" && "bg-neutral-900/10",
          theme === "adom:red" && "bg-red-400/10",
          theme === "tsahov:yellow" && "bg-amber-500/10",
          theme === "kahol:blue" && "bg-blue-500/10"
        )}
      >
        <p className="text-sm leading-[1.67] lg:text-base lg:leading-[1.67] max-w-[500px] mx-auto ">
          {group.data.description}
        </p>
      </article>
      <div className="flex flex-col px-8 md:px-12 lg:px-16 2xl:px-32 py-8 lg:py-12 md:grid grid-cols-1 md:grid-cols-5 lg:grid-cols-12 gap-8 lg:gap-16">
        <article className="md:col-span-3 lg:col-span-7 2xl:col-span-8">
          <div className="flex flex-col items-center gap-3.5 lg:gap-5 mb-4 lg:mb-5">
            <div className="flex items-center justify-between gap-x-4 w-full">
              <h2 className="font-medium text-xl lg:text-2xl">Prayers</h2>
              <Link
                href={{
                  pathname: `/groups/${group._id}/prayers/create`,
                  query: { _id: group._id as string },
                }}
                as={`/groups/${group._id}/prayers/create`}
                className="text-sm lg:tex-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
              >
                <span>New Prayer</span>
                <FiPlus className="text-lg lg:text-xl" />
              </Link>
            </div>
            <p className="text-neutral-600 font-light lg:text-lg">
              You have {prayers.length} prayers in the list.
            </p>
          </div>
          <ul className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {prayers.map((prayer, idx) => (
              <div
                key={idx}
                className={twMerge(
                  "p-6 rounded border ",
                  theme === "default:default" && "border-neutral-900/25",
                  theme === "adom:red" && "border-red-400/25",
                  theme === "tsahov:yellow" && "border-amber-500/25",
                  theme === "kahol:blue" && "border-blue-500/25"
                )}
              >
                <div className="mb-2.5">
                  <Profile image={user.data.image} asModal={false} />
                  <p className="text-sm text-neutral-600">{user.data.name}</p>
                </div>
                <div className="flex justify-between items-center gap-x-4 mb-0.5 lg:mb-1">
                  <h3 className="font-medium text-lg lg:text-xl">
                    {prayer.data.title}
                  </h3>
                </div>
                <div>
                  <p className="text-neutral-600 text-sm lg:text-base">
                    {prayer.data.short}
                  </p>
                </div>
                {/* if tags */}
                <div className="mt-2.5 lg:mt-4">
                  <ul className="flex items-center flex-wrap gap-2.5">
                    {prayer.data.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={twMerge(
                          "inline-block text-sm font-light transform lg:hover:scale-125 lg:hover:underline transition-all duration-[0.375s] ease-in-out cursor-pointer",
                          theme === "default:default" && "text-neutral-900",
                          theme === "adom:red" && "text-red-400",
                          theme === "tsahov:yellow" && "text-amber-500",
                          theme === "kahol:blue" && "text-blue-500"
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </ul>
          {/* if (prayers.status.completed).length >= 1 */}
          <div className="mt-5 lg:mt-8">
            <button
              type="button"
              className="text-neutral-600 text-base lg:text-lg flex items-center gap-x-2 group lg:overflow-hidden lg:hover:underline"
            >
              <HiArrowRight className="text-lg lg:text-xl transition-all duration-[0.75s] ease-in-out lg:group-hover:-translate-x-[5px] -left-full lg:group-hover:-ml-6 lg:group-hover:scale-125 lg:group-hover:rotate-180" />
              <span>View Completed</span>
            </button>
          </div>
        </article>
        <article className="md:col-span-2 lg:col-span-5 2xl:col-span-4">
          <div className="flex flex-col items-center gap-3.5 lg:gap-5">
            <div className="flex items-center justify-between gap-x-4 w-full">
              <h2 className="font-medium text-xl lg:text-2xl">Members</h2>
              <button
                type="button"
                className="text-sm lg:tex-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
              >
                <span>Invite</span>
                <FiPlus className="text-lg lg:text-xl" />
              </button>
            </div>
            <ul className="grid grid-cols-3 gap-4 md:grid-cols-3 w-full lg:grid-cols-4 2xl:grid-cols-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
                <div className="relative flex items-center gap-x-1" key={idx}>
                  <Profile image={user.data.image} asModal={false} />
                  {prayers.filter(
                    (each) => each.data.user_responsible === user._id
                  ).length >= 1 && (
                    <span
                      className={twMerge(
                        "w-[22.5px] h-[22.5px] flex justify-center items-center rounded-full text-neutral-600 border",
                        theme === "default:default" &&
                          "bg-neutral-900/10 border-neutral-900/25",
                        theme === "adom:red" &&
                          "bg-red-400/10 border-red-400/25",
                        theme === "tsahov:yellow" &&
                          "bg-amber-500/10 border-amber-500/25",
                        theme === "kahol:blue" &&
                          "bg-blue-500/10 border-blue-500/25"
                      )}
                    >
                      <span>
                        {
                          prayers.filter(
                            (each) => each.data.user_responsible === user._id
                          ).length
                        }
                      </span>
                    </span>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ObjectId.isValid(ctx.query._id as string)) {
    return { redirect: { destination: "/groups/not-found", permanent: false } };
  }

  const user = (await getSession(ctx)) as unknown as User;

  if (!user) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const groupDocs = await db("groups");

  const group = (await groupDocs.findOne({ _id: ctx.query._id })) as Group;

  let prayers: any[] = [];

  if (group.data.prayers.length >= 1) {
    const prayerDocs = await db("prayers");
    prayers = await Promise.all(
      group.data.prayers.map(async (prayer_id) => {
        const prayer = (await prayerDocs.findOne({ _id: prayer_id })) as Prayer;
        return prayer;
      })
    );
  }

  return { props: { user, group, prayers } };
};
