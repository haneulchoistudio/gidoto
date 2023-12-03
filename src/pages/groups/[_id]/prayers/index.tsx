import { GetServerSideProps } from "next";
import { returns } from "~/server/ssr";
import { getPwQ, validateDbQueryId } from "~/server/utils";

export default function GroupDetailPrayers() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { redirects } = returns();
  const { _id, v } = validateDbQueryId(ctx, "_id");
  if (!v) return redirects(_id ? `/groups/${_id}` : `/groups/not-found`, false);
  const { pathname } = getPwQ("groups", _id, ["_id"]);
  return redirects(pathname, false);
};
