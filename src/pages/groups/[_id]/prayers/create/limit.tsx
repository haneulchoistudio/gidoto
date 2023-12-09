import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { returns } from "~/server/ssr";
import { validateDbQueryId } from "~/server/utils";
import { useLanguage, useTheme } from "~/contexts";
import { $ } from "~/client/utils";

const AccessErrorScreen = dynamic(() =>
  import("~/components/status").then((component) => component.AccessErrorScreen)
);

type Props = { _id: string };

export default function PrayersCreateLimit({ _id }: Props) {
  const { lang, switchLanguage } = useLanguage();
  const { theme: _, switchTheme } = useTheme();
  const $data = $("pages", "prayerLimit");
  return (
    <AccessErrorScreen
      title={$data.titles.head[lang]}
      description={$data.paragraphs.issue[lang]}
      redirectUrls={[
        { href: `/groups/${_id}`, name: $data.buttons.goBack[lang] },
        { href: "/dashboard", name: $data.buttons.goDashboard[lang] },
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
