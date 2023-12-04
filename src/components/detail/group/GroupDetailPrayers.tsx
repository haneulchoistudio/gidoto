import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiPlus } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { Group, GroupProps, Prayer, User } from "~/types";

const Profile = dynamic(() =>
  import("~/components/user").then((component) => component.Profile)
);

interface GroupDetailPrayers {
  group: Group;
  prayers: Prayer[];
  user: User;
  theme: GroupProps["theme"];
}

const GroupDetailPrayers: React.FC<GroupDetailPrayers> = ({
  group,
  prayers,
  theme,
  user,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
        <div className="flex items-center justify-between gap-x-4 w-full">
          <h2 className="font-medium text-xl lg:text-2xl">Prayers</h2>
          <Link
            href={{
              pathname: `/groups/${group._id}/prayers/create`,
              query: { _id: group._id as string },
            }}
            as={`/groups/${group._id}/prayers/create`}
            className="text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
          >
            <span>New Prayer</span>
            <FiPlus className="text-lg lg:text-xl" />
          </Link>
        </div>
        {prayers.length >= 1 && (
          <p className="text-neutral-600 font-light lg:text-lg w-full text-start">
            You have {prayers.length}{" "}
            {prayers.length > 1 ? "prayers" : "prayer"} in the list.
          </p>
        )}
      </div>
      {prayers.length >= 1 ? (
        <ul className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {prayers.map(
            (prayer, idx) =>
              prayer && (
                <div
                  key={idx}
                  className={twMerge(
                    "py-6 rounded border border-transparent transition-all duration-[0.375s] ease-in-out cursor-pointer",
                    theme === "default:default" &&
                      "lg:hover:border-neutral-900/25 lg:hover:bg-neutral-900/10 lg:hover:px-6",
                    theme === "adom:red" &&
                      "lg:hover:border-red-400/25 lg:hover:bg-red-400/10 lg:hover:px-6",
                    theme === "tsahov:yellow" &&
                      "lg:hover:border-amber-500/25 lg:hover:bg-amber-500/10 lg:hover:px-6",
                    theme === "kahol:blue" &&
                      "lg:hover:border-blue-500/25 lg:hover:bg-blue-500/10 lg:hover:px-6"
                  )}
                >
                  <div className="mb-2.5">
                    <Profile image={user.data.image} asModal={false} />
                    <p className="text-sm opacity-60">{user.data.name}</p>
                  </div>
                  <div className="flex justify-between items-center gap-x-4 mb-0.5 lg:mb-1">
                    <h3 className="font-medium text-lg lg:text-xl">
                      {prayer.data.title}
                    </h3>
                  </div>
                  <div>
                    <p className="opacity-60 text-sm lg:text-base">
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
                  <div className="flex justify-between items-center">
                    <Link
                      href={{
                        pathname: `/groups/${group._id}/prayers/${prayer._id}`,
                        query: {
                          _id: group._id as string,
                          _id_prayer: prayer._id as string,
                        },
                      }}
                      as={`/groups/${group._id}/prayers/${prayer._id}`}
                      className="font-medium lg:text-neutral-400 lg:hover:text-neutral-900 text-neutral-600"
                    >
                      View
                    </Link>
                    {/* if user responsible */}
                    {group.data.user_responsible === user._id && (
                      <div className="col-span-12 flex items-center gap-x-2.5">
                        <Link
                          href={{
                            pathname: `/groups/${group._id}/prayers/${prayer._id}/edit`,
                            query: {
                              _id: group._id as string,
                              _id_prayer: prayer._id as string,
                            },
                          }}
                          as={`/groups/${group._id}/prayers/${prayer._id}/edit`}
                          className="font-medium lg:text-blue-400 lg:group-hover:text-blue-500 text-blue-500 lg:group-hover:hover:text-blue-300"
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
                          className="font-medium lg:text-red-400 lg:group-hover:text-red-500 text-red-500 lg:group-hover:hover:text-red-300"
                        >
                          Delete
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )
          )}
        </ul>
      ) : (
        <p className="p-6 lg:p-8 rounded border bg-neutral-100 text-neutral-600 text-center w-full">
          Your group do not have a shared prayer yet.
        </p>
      )}
      {/* if (prayers.status.completed).length >= 1 */}
      {prayers.length >= 1 && (
        <div className="mt-5 lg:mt-8">
          <button
            type="button"
            className="text-neutral-600 text-base lg:text-lg flex items-center gap-x-2 group lg:overflow-hidden lg:hover:underline"
          >
            <HiArrowRight className="text-lg lg:text-xl transition-all duration-[0.75s] ease-in-out lg:group-hover:-translate-x-[5px] -left-full lg:group-hover:-ml-6 lg:group-hover:scale-125 lg:group-hover:rotate-180" />
            <span>View Completed</span>
          </button>
        </div>
      )}
    </>
  );
};

export default GroupDetailPrayers;
