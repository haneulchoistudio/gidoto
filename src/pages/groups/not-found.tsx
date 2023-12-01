import dynamic from "next/dynamic";

const AccessErrorScreen = dynamic(() =>
  import("~/components/status").then((component) => component.AccessErrorScreen)
);

export default function GroupDetailNotFound() {
  return (
    <AccessErrorScreen
      title="Group Not Found"
      description="The request group is not in our database."
      redirectUrls={[{ href: "/dashboard", name: "Back dashboard" }]}
    />
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const user = (await getSession(ctx)) as unknown as User;
//   return { props: { user } };
// };
