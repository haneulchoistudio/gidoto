import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi";
import { User, Group } from "~/types";

const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

interface GroupdetailInvitationProps {
  user: User;
  group: Group;
}

const GroupDetailInvitation: React.FC<GroupdetailInvitationProps> = ({
  group,
  user,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  async function accept() {
    setError("");
    setLoading(true);
    setMessage("Accepting the invitation...");

    const response = await fetch("/api/groups/accept", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: group._id, user }),
    });

    if (!response.ok) {
      setError("Failed to accept the invitation. Try again.");
      setLoading(false);
      setMessage("");
      return;
    }

    setMessage("Redirecting to the group page...");

    router.reload();
  }

  async function decline() {
    setError("");
    setLoading(true);
    setMessage("Declining the invitation...");

    const response = await fetch("/api/groups/decline", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: group._id, email: user.data.email }),
    });

    if (!response.ok) {
      setError("Failed to decline the invitation. Try again.");
      setMessage("");
      setLoading(false);
      return;
    }

    setMessage("Redirecting to dashboard...");

    await router.push("/dashboard");
  }
  return loading ? (
    <div className="pt-8 lg:pt-12">
      <Loading message={message} fullScreen={false} />
    </div>
  ) : (
    group.data.emails.includes(user.data.email) && (
      <div className="flex flex-col justify-center items-center px-8 md:px-12 lg:px-32 py-8 lg:py-12">
        <article className="flex flex-col items-center text-center gap-y-2.5 mb-5 lg:mb-6">
          <h2 className="font-medium text-xl lg:text-2xl">
            <span className="text-red-500">*</span>
            You are invited to
          </h2>
          <p className="text-neutral-600 px-4 lg:text-lg leading-[1.67]">
            {group.data.name}
          </p>
        </article>
        {error && (
          <p className="mb-8 text-red-500 text-center flex items-center gap-x-1.5">
            <FiInfo className="text-lg lg:text-xl" />

            <span> {error}</span>
          </p>
        )}
        <ul className="w-max mx-auto flex flex-col items-center gap-y-5">
          <button
            disabled={loading}
            onClick={accept}
            type="button"
            className="w-full flex items-center justify-between gap-x-3.5 lg:gap-x-5 font-medium text-neutral-600 border rounded lg:hover:border-neutral-900 lg:hover:text-neutral-900 px-6 py-3 lg:px-8 lg:py-3.5"
          >
            <span>Yes, accept the invitation.</span>
            <HiArrowRight />
          </button>
          <button
            disabled={loading}
            onClick={decline}
            type="button"
            className="w-full flex items-center justify-between gap-x-3.5 lg:gap-x-5 font-medium text-neutral-600 border rounded lg:hover:border-neutral-900 lg:hover:text-neutral-900 px-6 py-3 lg:px-8 lg:py-3.5"
          >
            <span>No, decline it and go back.</span>
            <HiArrowRight />
          </button>
        </ul>
      </div>
    )
  );
};

export default GroupDetailInvitation;
