import type { FC } from 'react';
import { Children } from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import { createEmotionCache } from 'src/utils/create-emotion-cache';

const Favicon: FC = () => (
  <>
    <link rel='apple-touch-icon' sizes='57x57' href='/' />
    <link rel='apple-touch-icon' sizes='60x60' href='/logo.png' />
    <link rel='apple-touch-icon' sizes='72x72' href='/logo.png' />
    <link rel='apple-touch-icon' sizes='76x76' href='/logo.png' />
    <link rel='apple-touch-icon' sizes='114x114' href='/logo.png' />
    <link rel='apple-touch-icon' sizes='120x120' href='/logo.png' />
    <link rel='apple-touch-icon' sizes='144x144' href='/logo.png' />
    <link rel='apple-touch-icon' sizes='152x152' href='/logo.png' />
    <link rel='apple-touch-icon' sizes='180x180' href='/logo.png' />
    <link rel='icon' type='image/png' sizes='192x192' href='/logo.png' />
    <link rel='icon' type='image/png' sizes='32x32' href='/logo.png' />
    <link rel='icon' type='image/png' sizes='96x96' href='/logo.png' />
    <link rel='icon' type='image/png' sizes='16x16' href='/logo.png' />
    <link rel='manifest' href='/manifest.json' />
    <meta name='msapplication-TileColor' content='#ffffff' />
    <meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
    <meta name='theme-color' content='#ffffff' />
  </>
);

const Fonts: FC = () => (
  <>
    <link rel='preconnect' href='https://fonts.googleapis.com' />
    <link rel='preconnect' href='https://fonts.gstatic.com' />
    <link
      rel='stylesheet'
      href='https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'
    />
    <link
      rel='stylesheet'
      href='https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400&display=swap'
    />
    <link
      rel='stylesheet'
      href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&display=swap'
    />
    <link
      href='https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&display=swap'
      rel='stylesheet'
    ></link>
  </>
);

const Vendors: FC = () => (
  <>
    <link
      rel='stylesheet'
      href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
    />
    <link
      rel='stylesheet'
      href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
    />
  </>
);

const Pwa: FC = () => (
  <>
    <meta name='application-name' content='Tiktoday' />
    <meta name='apple-mobile-web-app-capable' content='yes' />
    <meta name='apple-mobile-web-app-status-bar-style' content='default' />
    <meta name='apple-mobile-web-app-title' content='Tiktoday' />
    <meta name='description' content='Tiktoday' />
    <meta name='format-detection' content='telephone=no' />
    <meta name='mobile-web-app-capable' content='yes' />
    <meta name='msapplication-config' content='/browserconfig.xml' />
    <meta name='msapplication-TileColor' content='#2B5797' />
    <meta name='msapplication-tap-highlight' content='no' />
    <meta name='theme-color' content='#000000' />
    <link rel='manifest' href='/manifest.json' />
  </>
);

// const Seo: FC = () => (
//   <>
//     <meta name="twitter:card" content="summary" />
//     <meta name="twitter:url" content="http://4.194.163.254:3001" />
//     <meta name="twitter:title" content="Tiktoday" />
//     <meta name="twitter:description" content="Tiktoday" />
//     <meta
//       name="twitter:image"
//       content="http://4.194.163.254:3001/icons/android-chrome-192x192.png"
//     />
//     <meta name="twitter:creator" content="@SHub" />
//     <meta property="og:type" content="website" />
//     <meta property="og:title" content="Tiktoday" />
//     <meta property="og:description" content="Tiktoday" />
//     <meta property="og:site_name" content="Tiktoday" />
//     <meta property="og:url" content="http://4.194.163.254:3001" />
//     <meta
//       property="og:image"
//       content="http://4.194.163.254:3001/icons/apple-touch-icon.png"
//     />
//   </>
// );

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <Favicon />
          <Fonts />
          <Vendors />
          <Pwa />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

CustomDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache as any);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <App
          // @ts-expect-error: Emotion cache is not typed
          emotionCache={cache}
          {...props}
        />
      )
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
  };
};

export default CustomDocument;
