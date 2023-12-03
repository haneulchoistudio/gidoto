import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { Group, GroupProps, User } from "~/types";

const Profile = dynamic(() =>
  import("~/components/user").then((component) => component.Profile)
);
const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

interface Member {
  num_prayers: number;
  image: string;
  email: string;
}

interface GroupDetailMembersProps {
  theme: GroupProps["theme"];
  members: Member[];
  emails: string[];
  user: User;
  group: Group;
}

const GroupDetailMembers: React.FC<GroupDetailMembersProps> = ({
  group,
  user,
  emails,
  theme,
  members,
}) => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [openInvite, setOpenInvite] = useState<boolean>(false);

  async function invite() {
    if (error) {
      setOpenInvite(false);
      return;
    }

    setError("");
    setLoading(true);

    const response = await fetch("/api/groups/invite", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: group._id,
        email,
        name: group.data.name,
        message: `We invite you to join our ${group.data.name} at Gidoto. Let's pray together.`,
      }),
    });

    if (!response.ok) {
      setError(`Failed to invite ${email}. Try it again.`);
      setLoading(false);
      setEmail("");
      setOpenInvite(false);
      return;
    }

    router.reload();
    setLoading(false);
    return;
  }

  useEffect(() => {
    if (email) {
      const asUser = user.data.email === email;
      if (asUser) {
        setError(`You cannot invite yourself.`);
        return;
      } else {
        setError("");
      }
      const asInvited = emails.find((each) => each === email);
      if (asInvited) {
        setError(`'${asInvited}' is already invited.`);
        return;
      } else {
        setError("");
      }
      const asMember = members.find((member) => member.email === email);
      if (asMember) {
        setError(`'${asMember.email}' already exists in the list.`);
        return;
      } else {
        setError("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  return (
    <div className="flex flex-col items-center gap-3.5 lg:gap-5">
      <div className="flex items-center justify-between gap-x-4 w-full">
        <h2 className="font-medium text-xl lg:text-2xl">Members</h2>
        {openInvite ? (
          <div className="flex items-center gap-x-2.5">
            <button
              type="button"
              onClick={() => setOpenInvite(false)}
              className="flex items-center  py-1 lg:py-1.5 font-medium text-red-500 lg:hover:text-red-400"
            >
              <span>Close</span>
            </button>
            {email && (
              <button
                disabled={loading}
                type="button"
                onClick={invite}
                className="text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
              >
                <span>Send</span>
                <FiPlus className="text-lg lg:text-xl" />
              </button>
            )}
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setOpenInvite(true)}
              className="text-sm lg:text-base px-2.5 py-1 lg:px-3 lg:py-1.5 rounded border flex items-center gap-x-1 lg:gap-x-1.5 font-medium border-neutral-600 lg:hover:bg-neutral-900 lg:hover:border-neutral-900 lg:hover:text-white"
            >
              <span>Invite</span>
              <FiPlus className="text-lg lg:text-xl" />
            </button>
          </div>
        )}
      </div>
      {openInvite && (
        <div className="relative w-full">
          {loading ? (
            <Loading message={"Inviting..."} fullScreen={false} />
          ) : (
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className={twMerge(
                "w-full rounded px-4 py-3",
                error &&
                  "focus:ring-transparent focus:border-red-500 border-red-500/25"
              )}
              placeholder="Enter the email to invite."
            />
          )}
          {error && (
            <p className="text-sm text-red-500 font-light mt-1">{error}</p>
          )}
        </div>
      )}
      {members.length >= 1 ? (
        <ul className="w-full flex flex-wrap items-center gap-x-3.5">
          {members.map((member, idx) => (
            <div
              className="relative flex items-center gap-x-1 lg:gap-x-1.5"
              key={idx}
            >
              <Profile image={member.image} asModal={false} />
              {member.num_prayers >= 1 && (
                <span
                  key={idx}
                  className={twMerge(
                    "w-[22.5px] h-[22.5px] flex justify-center items-center rounded-full text-neutral-600 border",
                    theme === "default:default" &&
                      "bg-neutral-900/10 border-neutral-900/25",
                    theme === "adom:red" && "bg-red-400/10 border-red-400/25",
                    theme === "tsahov:yellow" &&
                      "bg-amber-500/10 border-amber-500/25",
                    theme === "kahol:blue" &&
                      "bg-blue-500/10 border-blue-500/25"
                  )}
                >
                  <span>{member.num_prayers}</span>
                </span>
              )}
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
