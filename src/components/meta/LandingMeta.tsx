import Head from "next/head";
import { useLanguage } from "~/contexts";
import type { User } from "~/types";

interface LandingMetaProps {
  user?: User;
}

const LandingMeta: React.FC<LandingMetaProps> = ({ user = null }) => {
  const { lang } = useLanguage();

  return (
    <Head>
      <title>
        {user
          ? lang === "en"
            ? `Welcome to Onus, ${user.data.name}!`
            : `${user.data.name}님 어서오세요!`
          : lang === "en"
          ? `Onus, where we pray for each other`
          : "온어스, 서로를 위한 기도"}
      </title>
      <meta
        name="keywords"
        content="prayer group, pray for one another, pray for each other, we pray together, let's pray, onus, Onus, 온어스, 기도해요, 기도제목, 기도그룹, 다 같이 기도해요"
      />
      <meta
        name="description"
        content="Create prayer group, invite members, and post prayers to share. It's a place to share your prayers and pray for one another."
      />
      <meta
        property="og:title"
        content={
          user
            ? lang === "en"
              ? `Welcome to Onus, ${user.data.name}!`
              : `${user.data.name}님 어서오세요!`
            : lang === "en"
            ? `Onus, where we pray for each other`
            : "온어스, 서로를 위한 기도"
        }
      />
      <meta
        property="og:description"
        content="Create prayer group, invite members, and post prayers to share. It's a place to share your prayers and pray for one another."
      />
    </Head>
  );
};

export default LandingMeta;
