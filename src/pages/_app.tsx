import type { AppProps } from 'next/app';
import Head from 'next/head';

import { AuthConsumer, AuthProvider } from 'src/contexts/auth/jwt-context';

import 'simplebar-react/dist/simplebar.min.css';
import 'src/styles/globals.css';

import { SnackbarProvider } from 'notistack';
import { useNProgress } from 'src/hooks/use-nprogress';
import SplashScreen from 'src/components/ui/SplashScreen';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import { createTheme } from 'src/theme';
import { initialSettings } from 'src/contexts/settings-context';

const clientSideEmotionCache = createEmotionCache();

const App = (props: AppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);
  useNProgress();

  return (
    <CacheProvider value={emotionCache}>
      <ProgressBar height='4px' color='#2970FF' options={{ showSpinner: true }} shallowRouting />
      <Head>
        <title>TSA</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <SnackbarProvider>
        <AuthProvider>
          <AuthConsumer>
            {(auth) => {
              const theme = createTheme(initialSettings);
              const showSlashScreen = !auth.isInitialized;
              if (!auth.isInitialized) {
                return <SplashScreen />;
              }
              return (
                <ThemeProvider theme={theme}>
                  <Head>
                    <meta name='color-scheme' content={initialSettings.paletteMode} />
                    <meta name='theme-color' content={theme.palette.primary.main} />
                  </Head>
                  <CssBaseline />
                  {showSlashScreen ? (
                    <SplashScreen />
                  ) : (
                    <> {getLayout(<Component {...pageProps} />)}</>
                  )}
                </ThemeProvider>
              );
            }}
          </AuthConsumer>
        </AuthProvider>
      </SnackbarProvider>
    </CacheProvider>
  );
};

export default App;
