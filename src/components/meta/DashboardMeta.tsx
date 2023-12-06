import Head from "next/head";
import { useLanguage } from "~/contexts";
import type { User } from "~/types";

interface DashboardMetaProps {
  user: User;
}

const DashboardMeta: React.FC<DashboardMetaProps> = ({ user }) => {
  const { lang } = useLanguage();

  return (
    <Head>
      <title>
        {lang === "en"
          ? `Onus Dashboard | Hi,
        ${user.data.name}`
          : `온어스 알림판 | 안녕하세요, ${user.data.name}님`}
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
          lang === "en"
            ? `Onus Dashboard | Hi,
      ${user.data.name}`
            : `온어스 알림판 | 안녕하세요, ${user.data.name}님`
        }
      />
      <meta
        property="og:description"
        content="Create prayer group, invite members, and post prayers to share. It's a place to share your prayers and pray for one another."
      />
    </Head>
  );
};

export default DashboardMeta;
