import dynamic from "next/dynamic";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { $ } from "~/client/utils";
import { useLanguage, useTheme } from "~/contexts";
import { Group, GroupProps, User } from "~/types";

const ProfileButton = dynamic(() =>
  import("~/components/user").then((component) => component.ProfileButton)
);

interface GroupDetailHeaderProps {
  theme: GroupProps["theme"];
  user: User;
  group: Group;
}

const GroupDetailHeader: React.FC<GroupDetailHeaderProps> = ({
  theme,
  user,
  group,
}) => {
  const { lang, switchLanguage } = useLanguage();
  const { theme: _, switchTheme } = useTheme();
  const $data = $("pages", "groupDetail");
  return (
    <header
      className={twMerge(
        "px-8 md:px-12 lg:px-16 2xl:px-32 flex justify-between items-center py-4 lg:py-5",
        theme === "default:default" && "bg-neutral-900/10",
        theme === "adom:red" && "bg-red-400/10",
        theme === "tsahov:yellow" && "bg-amber-500/10",
        theme === "kahol:blue" && "bg-blue-500/10"
      )}
    >
      <div className="flex items-center gap-x-2.5 md:gap-x-3.5">
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
        {user._id === group.data.user_responsible && (
          <div className="md:flex items-center gap-x-2.5 hidden">
            <Link
              href={{
                pathname: `/groups/${group._id}/edit`,
                query: { _id: group._id as string },
              }}
              as={`/groups/${group._id}/edit`}
              className="w-max text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
            >
              {$data.buttons.edit[lang]}
            </Link>
            <Link
              href={{
                pathname: `/groups/${group._id}/delete`,
                query: { _id: group._id as string },
              }}
              as={`/groups/${group._id}/delete`}
              className="w-max text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
            >
              {$data.buttons.delete[lang]}
            </Link>
          </div>
        )}
      </div>
      <ProfileButton
        image={user.data.image}
        isOnFreePlan={user.data.subscription === "free"}
      />
    </header>
  );
};

export default GroupDetailHeader;
