import type { Redirect } from "next";

function __ssrProps__<Props>(props: Props) {
  return { props };
}

function __ssrRedirects__<Destination extends string, Permanency>(
  destination: Destination,
  permanent: boolean = false
) {
  return {
    redirect: {
      destination,
      permanent,
    } as Redirect,
  };
}

function returns() {
  return {
    props: __ssrProps__,
    redirects: __ssrRedirects__,
  };
}

export { returns };
