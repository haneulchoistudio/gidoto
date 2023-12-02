import dynamic from "next/dynamic";
import { FiPlus } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { GroupProps, User } from "~/types";

const Profile = dynamic(() =>
  import("~/components/user").then((component) => component.Profile)
);

interface Member {
  num_prayers: number;
  image: string;
  email: string;
}

interface GroupDetailMembersProps {
  theme: GroupProps["theme"];
  members: Member[];
}

const GroupDetailMembers: React.FC<GroupDetailMembersProps> = ({
  theme,
  members,
}) => {
  return (
    <div className="flex flex-col items-center gap-3.5 lg:gap-5">
      <div className="flex items-center justify-between gap-x-4 w-full">
        <h2 className="font-medium text-xl lg:text-2xl">Members</h2>
        <button
          type="button"
          className="text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
        >
          <span>Invite</span>
          <FiPlus className="text-lg lg:text-xl" />
        </button>
      </div>
      {members.length >= 1 ? (
        <ul className="grid grid-cols-3 gap-4 md:grid-cols-3 w-full lg:grid-cols-4 2xl:grid-cols-5">
          {members.map((member, idx) => (
            <div className="relative flex items-center gap-x-1" key={idx}>
              <Profile image={member.image} asModal={false} />
              <span
                key={idx}
                className={twMerge(
                  "w-[22.5px] h-[22.5px] flex justify-center items-center rounded-full text-neutral-600 border",
                  theme === "default:default" &&
                    "bg-neutral-900/10 border-neutral-900/25",
                  theme === "adom:red" && "bg-red-400/10 border-red-400/25",
                  theme === "tsahov:yellow" &&
                    "bg-amber-500/10 border-amber-500/25",
                  theme === "kahol:blue" && "bg-blue-500/10 border-blue-500/25"
                )}
              >
                <span>{member.num_prayers}</span>
              </span>
            </div>
          ))}
        </ul>
      ) : (
        <p className="p-6 lg:p-8 rounded border bg-neutral-100 text-neutral-600 text-center w-full">
          Your group do not have a member yet.
        </p>
      )}
    </div>
  );
};

export default GroupDetailMembers;
