import { returns } from "~/server/ssr";
import type { GetServerSideProps } from "next";
import { Screen404 } from "~/components/status";

type Props = {
  errorCode: 404 | 500;
};

export default function ErrorPage({ errorCode }: Props) {
  return errorCode === 404 ? (
    <Screen404 errorCode={errorCode} title="This page does not exist." />
  ) : errorCode === 500 ? (
    <></>
  ) : null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const errorCode = res.statusCode;
  const { props } = returns();
  return props({ errorCode });
};
