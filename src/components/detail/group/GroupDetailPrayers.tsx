import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiPlus } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { $, url } from "~/client/utils";
import { useLanguage, useTheme } from "~/contexts";
import { Group, GroupProps, Prayer, User } from "~/types";

const Profile = dynamic(() =>
  import("~/components/user").then((component) => component.Profile)
);
const GroupPrayerCard = dynamic(() =>
  import("~/components/detail").then((component) => component.GroupPrayerCard)
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
  const { lang, switchLanguage } = useLanguage();
  const { theme: _, switchTheme } = useTheme();
  const $data = $("pages", "groupDetail");
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
        <div className="flex items-center justify-between gap-x-4 w-full">
          <h2 className="font-medium text-xl lg:text-2xl">
            {$data.titles.containers.prayers[lang]}
          </h2>
          <Link
            href={{
              pathname: `/groups/${group._id}/prayers/create`,
              query: { _id: group._id as string },
            }}
            as={`/groups/${group._id}/prayers/create`}
            className="text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
          >
            <span>{$data.buttons.newPrayer[lang]}</span>
            <FiPlus className="text-lg lg:text-xl" />
          </Link>
        </div>
        {prayers.length >= 1 && (
          <p className="text-neutral-600 font-light lg:text-lg w-full text-start">
            {lang === "en" && (
              <>
                You have {prayers.length}{" "}
                {prayers.length > 1 ? "prayers" : "prayer"} in the list.
              </>
            )}
            {lang === "ko" && (
              <>{prayers.length}개의 기도제목이 올려져 있습니다.</>
            )}
          </p>
        )}
      </div>
      {prayers.length >= 1 ? (
        <ul className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {prayers.map(
            (prayer, idx) =>
              prayer && (
                <GroupPrayerCard
                  key={idx}
                  title={prayer.data.title}
                  short={prayer.data.short}
                  isAnonymous={prayer.data.anonymous}
                  tags={prayer.data.tags}
                  isWriter={prayer.data.user_responsible === user._id}
                  writerName={prayer.data.user_name ?? ""}
                  writerImage={prayer.data.user_image}
                  links={{
                    view: {
                      pathanme: url(
                        "groups",
                        group._id as string,
                        "prayers",
                        prayer._id as string
                      ),
                      query: {
                        _id: group._id as string,
                        _id_prayer: prayer._id as string,
                      },
                      as: url(
                        "groups",
                        group._id as string,
                        "prayers",
                        prayer._id as string
                      ),
                    },
                    edit: {
                      pathanme: url(
                        "groups",
                        group._id as string,
                        "prayers",
                        prayer._id as string,
                        "edit"
                      ),
                      query: {
                        _id: group._id as string,
                        _id_prayer: prayer._id as string,
                      },
                      as: url(
                        "groups",
                        group._id as string,
                        "prayers",
                        prayer._id as string,
                        "edit"
                      ),
                    },
                    delete: {
                      pathanme: url(
                        "groups",
                        group._id as string,
                        "prayers",
                        prayer._id as string,
                        "delete"
                      ),
                      query: {
                        _id: group._id as string,
                        _id_prayer: prayer._id as string,
                      },
                      as: url(
                        "groups",
                        group._id as string,
                        "prayers",
                        prayer._id as string,
                        "delete"
                      ),
                    },
                  }}
                  groupTheme={group.data.theme}
                />
              )
          )}
        </ul>
      ) : (
        <p className="p-6 lg:p-8 rounded border bg-neutral-100 text-neutral-600 text-center w-full">
          {$data.paragraphs.noPrayer[lang]}
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
            <span>
              {lang === "en"
                ? "View the list of completed prayers"
                : "이뤄진 기도제목들 보기"}
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default GroupDetailPrayers;
