import "~/styles/index.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { LanguageContextProvider, ThemeContextProvider } from "~/contexts";

export default function App(props: AppProps) {
  const { Component, pageProps: moreProps, router: _Router } = props;
  const { session, ...pageProps } = moreProps;

  return (
    <SessionProvider session={session}>
      <ThemeContextProvider user={pageProps.user}>
        <LanguageContextProvider user={pageProps.user}>
          <Component {...pageProps} />
        </LanguageContextProvider>
      </ThemeContextProvider>
    </SessionProvider>
  );
}
