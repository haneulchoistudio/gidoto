import dynamic from "next/dynamic";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { Group, GroupProps, Prayer, User } from "~/types";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);
const Profile = dynamic(() =>
  import("~/components/user").then((component) => component.Profile)
);

interface GroupPrayerHeaderProps {
  theme: GroupProps["theme"];
  user: User;
  group: Group;
  prayer: Prayer;
}

const GroupPrayerHeader: React.FC<GroupPrayerHeaderProps> = ({
  theme,
  user,
  group,
  prayer,
}) => {
  return (
    <>
      <header
        className={twMerge(
          "px-8 md:px-12 lg:px-16 2xl:px-32 flex justify-between items-center py-4 lg:py-5"
        )}
      >
        <div className="flex items-center gap-x-2.5 md:gap-x-3.5">
          <div className="flex items-center gap-x-2.5">
            <Link
              href={{
                pathname: `/groups/${group._id}`,
                query: { _id: group._id as string },
              }}
              as={`/groups/${group._id}`}
              className={twMerge(
                "w-[37.5px] h-[37.5px] rounded border bg-white flex justify-center items-center lg:hover:border-neutral-900 text-neutral-600 lg:hover:text-white lg:hover:bg-neutral-900"
              )}
            >
              <HiArrowLeft />
            </Link>
            <h1 className="font-bold text-lg lg:text-xl">Prayer</h1>
          </div>
          {user._id === group.data.user_responsible && (
            <div className="md:flex items-center gap-x-2.5 hidden">
              <Link
                href={{
                  pathname: `/groups/${group._id}/prayers/${prayer._id}/edit`,
                  query: {
                    _id: group._id as string,
                    _id_prayer: prayer._id as string,
                  },
                }}
                as={`/groups/${group._id}/prayers/${prayer._id}/edit`}
                className="w-max text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
              >
                Edit
              </Link>
              <Link
                href={{
                  pathname: `/groups/${group._id}/prayers/${prayer._id}/delete`,
                  query: {
                    _id: group._id as string,
                    _id_prayer: prayer._id as string,
                  },
                }}
                as={`/groups/${group._id}/prayers/${prayer._id}/delete`}
                className="w-max text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
              >
                Delete
              </Link>
            </div>
          )}
        </div>
        <ProfileButton
          image={user.data.image}
          isOnFreePlan={user.data.subscription === "free"}
        />
      </header>
      <div
        className={twMerge(
          "w-full border-y ",
          theme === "default:default" &&
            "bg-neutral-900/10 border-neutral-900/25",
          theme === "adom:red" && "bg-red-400/10 border-red-400/25",
          theme === "tsahov:yellow" && "bg-amber-500/10 border-amber/25",
          theme === "kahol:blue" && "bg-blue-500/10 border-blue-500/25"
        )}
      >
        <section
          className={twMerge(
            "px-8 md:px-12 lg:px-16 2xl:px-32 flex flex-col py-8 lg:py-12 max-w-[1080px] mx-auto"
          )}
        >
          <div className="flex flex-col items-center text-center">
            <h4 className="text-base lg:text-lg font-light opacity-60">
              {group.data.name}
            </h4>
            <h3 className="font-medium text-2xl lg:text-4xl mb-1.5 lg:mb-2.5">
              {prayer.data.title}
            </h3>
            <div className="mb-2.5 flex items-center gap-x-1.5 lg:gap-x-2.5">
              <Profile image={user.data.image} asModal={false} />
              <p className="text-sm lg:text-base opacity-60">
                {user.data.name}
              </p>
            </div>
          </div>
          {group.data.user_responsible === user._id && (
            <div className="mt-4 flex items-center justify-center gap-x-2.5 md:hidden">
              <Link
                href={{
                  pathname: `/groups/${group._id}/prayers/${prayer._id}/edit`,
                  query: {
                    _id: group._id as string,
                    _id_prayer: prayer._id as string,
                  },
                }}
                as={`/groups/${group._id}/prayers/${prayer._id}/edit`}
                className="w-max text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
              >
                Edit
              </Link>
              <Link
                href={{
                  pathname: `/groups/${group._id}/prayers/${prayer._id}/delete`,
                  query: {
                    _id: group._id as string,
                    _id_prayer: prayer._id as string,
                  },
                }}
                as={`/groups/${group._id}/prayers/${prayer._id}/delete`}
                className="w-max text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
              >
                Delete
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default GroupPrayerHeader;
