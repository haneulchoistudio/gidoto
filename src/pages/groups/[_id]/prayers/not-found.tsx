import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { returns } from "~/server/ssr";
import { validateDbQueryId } from "~/server/utils";

const AccessErrorScreen = dynamic(() =>
  import("~/components/status").then((component) => component.AccessErrorScreen)
);

type Props = { _id_prayer: string; _id: string };

export default function GroupDetailPrayerNotFound({ _id_prayer, _id }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (_id_prayer) {
      router.replace(
        { pathname: router.pathname, query: { _id_prayer, _id } },
        `${router.route}?_id_prayer=${_id_prayer}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccessErrorScreen
      title="Group's Prayer Not Found"
      description="The request group's prayer is not in our database."
      redirectUrls={[
        { href: `/groups/${_id_prayer}`, name: "Back to the group" },
      ]}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props, redirects } = returns();
  const { _id, v: v_id } = validateDbQueryId(ctx, "_id");
  const { _id_prayer, v: v_id_prayer } = validateDbQueryId(ctx, "_id_prayer");
  if (!_id_prayer) return redirects(`/groups/${_id}`, false);
  return props({ _id, _id_prayer });
};
