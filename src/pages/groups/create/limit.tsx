import dynamic from "next/dynamic";

const AccessErrorScreen = dynamic(() =>
  import("~/components/status").then((component) => component.AccessErrorScreen)
);

export default function GroupsCreateLimit() {
  return (
    <AccessErrorScreen
      title="Group Limit Reached"
      description="You are currently on a free plan and cannot create more than 2 groups at a time."
      redirectUrls={[
        { href: "/account/subscription", name: "Upgrade to pro" },
        { href: "/dashboard", name: "Back dashboard" },
      ]}
    />
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const user = (await getSession(ctx)) as unknown as User;
//   return { props: { user } };
// };
