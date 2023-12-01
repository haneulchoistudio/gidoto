import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

const AccessErrorScreen = dynamic(() =>
  import("~/components/status").then((component) => component.AccessErrorScreen)
);

type Props = { _id: string };

export default function GroupDetailPrayerNotFound({ _id }: Props) {
  return (
    <AccessErrorScreen
      title="Group's Prayer Not Found"
      description="The request group's prayer is not in our database."
      redirectUrls={[{ href: `/groups/${_id}`, name: "Back to the group" }]}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ObjectId.isValid(ctx.query._id as string)) {
    return { redirect: { destination: "/groups/not-found", permanent: false } };
  }
  return { props: { _id: ctx.query._id } };
};
