import { ObjectId } from "mongodb";
import { GetServerSidePropsContext } from "next";

type GetPathWithQuery = {
  pathname: string;
  query: Record<string, string>;
};

function __getPwQ__(
  page: string,
  dynamicId: string,
  queryKey: [string]
): GetPathWithQuery;
function __getPwQ__(
  page: Array<string>,
  dynamicId: string,
  queryKey: [string]
): GetPathWithQuery;
function __getPwQ__(
  page: Array<string>,
  dynamicId: Array<string>,
  queryKey: [string, string]
): GetPathWithQuery;

function __getPwQ__(
  key: string | Array<string>,
  dynamicId: string | Array<string>,
  queryKey: [string] | [string, string]
): GetPathWithQuery {
  let path: string = "";

  if (Array.isArray(key)) {
    if (Array.isArray(dynamicId)) {
      let paths: string[] = [];
      let length = key.length;

      for (let i = 0; i < length; i++) {
        paths.push(key[i]);
        paths.push(dynamicId[i]);
      }

      path = paths.join("/");

      let query: GetPathWithQuery["query"] = {};

      const queryKey1 = `${queryKey[0]}`;
      const queryKey2 = `${queryKey[1]}`;

      query[queryKey1] = dynamicId[0];
      query[queryKey2] = dynamicId[1];

      return {
        pathname: `/${path}`,
        query,
      };
    }
    if (typeof dynamicId === "string") {
      path = [key[0], dynamicId, key[1]].join("/");

      let query: GetPathWithQuery["query"] = {};

      const queryKey1 = `${queryKey[0]}`;

      query[queryKey1] = dynamicId;

      return {
        pathname: `/${path}`,
        query,
      };
    }
    return { pathname: "", query: {} };
  }
  if (typeof key === "string") {
    path = [key, dynamicId].join("/");

    let query: GetPathWithQuery["query"] = {};

    const queryKey1 = `${queryKey[0]}`;

    query[queryKey1] = dynamicId as string;

    return {
      pathname: `/${path}`,
      query,
    };
  }

  return {
    pathname: "",
    query: {},
  };
}

export { __getPwQ__ };

function __appendToPwQ__(pathWithQuery: string, ...pages: Array<string>) {
  return [pathWithQuery, ...pages].join("/");
}

export { __appendToPwQ__ };

type ContextValidity = {
  v: boolean;
};

function __validateQueryValue(
  ctx: GetServerSidePropsContext,
  validateKey: string
) {
  const query = ctx.query;
  const value = (query[validateKey] as string) ?? "";

  let validity: ContextValidity = { v: false };

  validity.v = value ? true : false;

  let kv: Record<string, string> = {};

  kv[validateKey] = value;

  return {
    ...validity,
    ...kv,
  } as ContextValidity & Record<string, string>;
}

export { __validateQueryValue };

function __validateDbQueryId<ID extends string>(
  ctx: GetServerSidePropsContext,
  validateKey: ID
) {
  const { v } = __validateQueryValue(ctx, validateKey);
  const query = ctx.query;
  const value = query[validateKey] as string;

  let validity: ContextValidity = {
    v: v && ObjectId.isValid(value),
  };

  let kv: Record<string, string> = {};

  kv[validateKey] = value;

  return {
    ...validity,
    ...kv,
  } as ContextValidity & Record<ID, string>;
}

export { __validateDbQueryId };
