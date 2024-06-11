import type { AppProps } from "next/app";
import Head from "next/head";

import { AuthConsumer, AuthProvider } from "src/contexts/auth/jwt-context";

import "simplebar-react/dist/simplebar.min.css";
import "src/styles/globals.css";

import { SnackbarProvider } from "notistack";
import { useNProgress } from "src/hooks/use-nprogress";
import SplashScreen from "src/components/ui/SplashScreen";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);
  useNProgress();

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/logos/logo.png" />
        <title>CHÁNH TẠNG VIỆT DỊCH</title>
        <meta name="viewport" content="width=1024" />
      </Head>

      <SnackbarProvider>
        <AuthProvider>
          <AuthConsumer>
            {(auth) => {
              if (!auth.isInitialized) {
                return <SplashScreen />;
              }
              return <>{getLayout(<Component {...pageProps} />)}</>;
            }}
          </AuthConsumer>
        </AuthProvider>
      </SnackbarProvider>
    </>
  );
};

export default App;
