import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { db } from "~/server/mongo";
import { returns } from "~/server/ssr";
import { validateDbQueryId } from "~/server/utils";
import type { Group, User } from "~/types";

const BinaryActionScreen = dynamic(() =>
  import("~/components/status").then(
    (component) => component.BinaryActionScreen
  )
);
const Loading = dynamic(() =>
  import("~/components/status").then((component) => component.Loading)
);

type Props = {
  user: User;
  group: Group;
};

export default function GroupDetailDelete({ user, group }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function deleteGroup() {
    const confirmDelete = confirm(
      `Are you sure you want to delete '${group.data.name}'?`
    );

    if (!confirmDelete) {
      setError("");
      setLoading(false);
      return;
    }

    setError("");
    setLoading(true);

    const response = await fetch("/api/groups/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(group),
    });

    if (!response.ok) {
      setError("Failed to delete the event. Try it again.");
      setLoading(false);
      return;
    }
    await router.push("/dashboard");
    setLoading(false);
  }
  async function goBack() {
    setError("");
    setLoading(true);
    await router.push(
      {
        pathname: `/groups/${group._id}`,
        query: { _id: group._id as string },
      },
      `/groups/${group._id}`
    );
    setLoading(false);
  }

  return loading ? (
    <Loading
      message={`Deleting the group '${group.data.name}'...`}
      fullScreen
    />
  ) : (
    <div>
      {error && (
        <p className="text-center text-red-500 bg-red-500/10 border-b border-red-500/25 px-8 md:px-12 lg:px-16 2xl:px-32 py-2.5 lg:py-4">
          {error}
        </p>
      )}
      <BinaryActionScreen
        title={`Are you suer you want to delete?`}
        description={group.data.name}
        action={{
          positive: {
            name: "Yes, delete it.",
            onClick: deleteGroup,
          },
          negative: {
            name: "No, go back.",
            onClick: goBack,
          },
        }}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirects } = returns();
  const { _id, v } = validateDbQueryId(ctx, "_id");
  if (!v)
    return redirects(
      _id ? `/groups/not-found?_id=${_id}` : "/groups/not-found",
      false
    );
  const user = (await getSession(ctx)) as unknown as User;
  if (!user) return redirects("/", false);
  if (user.data.groups.find((each) => each === ctx.query._id)) {
    const groupDocs = await db("groups");
    const group = (await groupDocs.findOne({ _id })) as Group;
    return props({ user, group });
  }
  return redirects("/groups/not-found", false);
};
