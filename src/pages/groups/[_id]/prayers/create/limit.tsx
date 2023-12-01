import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

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
  if (!ObjectId.isValid(ctx.query._id as string)) {
    return { redirect: { destination: "/groups/not-found", permanent: false } };
  }

  return { props: { _id: ctx.query._id } };
};
