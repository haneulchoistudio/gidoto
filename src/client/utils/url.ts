function __url__<Urls extends Array<string>>(...urls: Urls) {
  return `/${urls.join("/")}`;
}

export { __url__ };
