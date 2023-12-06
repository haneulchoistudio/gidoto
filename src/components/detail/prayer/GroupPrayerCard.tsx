import dynamic from "next/dynamic";
import Link from "next/link";
import { ParsedUrlQueryInput } from "querystring";
import { FiEye } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { $ } from "~/client/utils";
import { useLanguage, useTheme } from "~/contexts";
import { GroupProps, Prayer, User } from "~/types";
import { FaHandsPraying } from "react-icons/fa6";

const Profile = dynamic(() =>
  import("~/components/user").then((component) => component.Profile)
);

interface LinkProps {
  pathanme: string;
  query: ParsedUrlQueryInput;
  as: string;
}

type GroupPrayerCardProps = {
  groupTheme: GroupProps["theme"];
  title: string;
  short: string;
  tags: string[];
  isAnonymous: boolean;
  writerImage: string;
  writerName: string;
  isWriter: boolean;
  links: Record<"view" | "edit" | "delete", LinkProps>;
};

const GroupPrayerCard: React.FC<GroupPrayerCardProps> = ({
  groupTheme,
  title,
  short,
  tags,

  writerImage,
  writerName,
  isWriter,

  isAnonymous,

  links,
}): JSX.Element => {
  const { lang, switchLanguage } = useLanguage();
  const { theme: _, switchTheme } = useTheme();
  const $data = $("pages", "groupDetail");

  return (
    <div
      className={twMerge(
        "p-6 border lg:hover:border-neutral-400 rounded shadow shadow-transparent lg:hover:shadow-2xl lg:hover:shadow-neutral-400/20 transition-all duration-[0.375s] ease-in-out cursor-pointer"
      )}
    >
      <div className="flex justify-between items-start gap-x-4 mb-0.5 lg:mb-1">
        <h3 className="font-medium text-xl lg:text-2xl">{title}</h3>
      </div>
      <div className="mb-1.5 lg:mb-2.5">
        <p className="font-light text-neutral-400 text-sm">
          {lang === "en" && "Prayer by "}
          <span className="font-medium text-neutral-600">
            {isAnonymous ? (lang === "en" ? "Unknown" : "익명") : writerName}
          </span>
          {lang === "ko" && " 님의 기도제목"}
        </p>
      </div>
      <div>
        <p className="opacity-60 text-base lg:text-lg">{short}</p>
      </div>
      {/* if tags */}
      {tags.length >= 1 && (
        <div className="mt-2.5 lg:mt-4">
          <ul className="flex items-center flex-wrap gap-2.5">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={twMerge(
                  "inline-block text-xs lg:text-base font-light transform lg:hover:scale-125 lg:hover:underline transition-all duration-[0.375s] ease-in-out cursor-pointer",
                  groupTheme === "default:default" && "text-neutral-900",
                  groupTheme === "adom:red" && "text-red-400",
                  groupTheme === "tsahov:yellow" && "text-amber-500",
                  groupTheme === "kahol:blue" && "text-blue-500"
                )}
              >
                {tag}
              </span>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-between gap-x-5 items-center mt-2.5 lg:mt-4">
        <Link
          href={{
            pathname: links.view.pathanme,
            query: links.view.query,
          }}
          as={links.view.as}
          className="flex items-center gap-x-1.5 text-sm lg:text-base px-2.5 py-1 rounded bg-neutral-900 text-white lg:hover:opacity-60"
        >
          <FaHandsPraying />
          <span>{$data.buttons.view[lang]}</span>
        </Link>
        {/* if user responsible */}
        {isWriter && (
          <div className="flex items-center gap-x-1 lg:gap-x-1.5">
            <Link
              href={{
                pathname: links.edit.pathanme,
                query: links.edit.query,
              }}
              as={links.edit.as}
              className="text-base font-medium lg:text-lg text-neutral-600 lg:hover:text-neutral-400"
            >
              {$data.buttons.edit[lang]}
            </Link>
            <span className="text-neutral-400">|</span>
            <Link
              href={{
                pathname: links.delete.pathanme,
                query: links.delete.query,
              }}
              as={links.delete.as}
              className="text-base font-medium lg:text-lg text-red-500 lg:hover:opacity-60"
            >
              {$data.buttons.delete[lang]}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPrayerCard;
