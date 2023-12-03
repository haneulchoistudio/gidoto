import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { returns } from "~/server/ssr";
import { validateDbQueryId } from "~/server/utils";

const AccessErrorScreen = dynamic(() =>
  import("~/components/status").then((component) => component.AccessErrorScreen)
);

type Props = { _id: string };

export default function PrayersCreateLimit({ _id }: Props) {
  return (
    <AccessErrorScreen
      title="Group's Prayer Limit Reached"
      description="Your group is currently on a free plan and cannot create more than 3 prayers at a time."
      redirectUrls={[
        { href: `/groups/${_id}`, name: "Back to the group" },
        { href: "/dashboard", name: "Back dashboard" },
      ]}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirects } = returns();
  const { _id, v } = validateDbQueryId(ctx, "_id");
  if (!v)
    return redirects(
      _id ? "/groups/not-found" : `/groups/not-found?_id=${_id}`,
      false
    );
  return props({ _id });
};
