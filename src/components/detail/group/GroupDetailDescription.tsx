import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { $ } from "~/client/utils";
import { useLanguage, useTheme } from "~/contexts";
import { Group, GroupProps, User } from "~/types";

interface GroupDetailDescription {
  theme: GroupProps["theme"];
  group: Group;
  user: User;
}

const GroupDetailDescription: React.FC<GroupDetailDescription> = ({
  group,
  theme,
  user,
}) => {
  const { lang, switchLanguage } = useLanguage();
  const { theme: _, switchTheme } = useTheme();
  const $data = $("pages", "groupDetail");
  return (
    <article
      className={twMerge(
        "w-full px-8 md:px-12 lg:px-16 2xl:px-32 pb-8 lg:pb-12 pt-4 lg:pt-6 text-neutral-600",
        theme === "default:default" && "bg-neutral-900/10",
        theme === "adom:red" && "bg-red-400/10",
        theme === "tsahov:yellow" && "bg-amber-500/10",
        theme === "kahol:blue" && "bg-blue-500/10"
      )}
    >
      <p className="text-sm text-center leading-[1.67] lg:text-base lg:leading-[1.67] max-w-[500px] mx-auto ">
        {group.data.description}
      </p>
      {group.data.user_responsible === user._id && (
        <div className="mt-5 flex items-center gap-x-2.5 md:hidden">
          <Link
            href={{
              pathname: `/groups/${group._id}/edit`,
              query: { _id: group._id as string },
            }}
            as={`/groups/${group._id}/edit`}
            className="w-max text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
          >
            {$data.buttons.edit[lang]}
          </Link>
          <Link
            href={{
              pathname: `/groups/${group._id}/delete`,
              query: { _id: group._id as string },
            }}
            as={`/groups/${group._id}/delete`}
            className="w-max text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
          >
            {$data.buttons.delete[lang]}
          </Link>
        </div>
      )}
    </article>
  );
};

export default GroupDetailDescription;
