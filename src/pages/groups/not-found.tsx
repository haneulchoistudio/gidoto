import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { returns } from "~/server/ssr";
import { validateDbQueryId } from "~/server/utils";

const AccessErrorScreen = dynamic(() =>
  import("~/components/status").then((component) => component.AccessErrorScreen)
);

type Props = {
  _id: string;
};

export default function GroupDetailNotFound({ _id }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (_id) {
      router.replace(
        { pathname: router.pathname, query: { _id } },
        `${router.route}?_id=${_id}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccessErrorScreen
      title="Group Not Found"
      description="The request group is not in our database."
      redirectUrls={[{ href: "/dashboard", name: "Back dashboard" }]}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { props } = returns();
  const { _id, v } = validateDbQueryId(ctx, "_id");
  return props({ _id: _id || "" });
};
