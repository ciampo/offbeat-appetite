import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
  DocumentProps,
} from 'next/document';

import { sharedTheme } from '../tailwind.shared';

// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

const PRECONNECT_ORIGINS = [
  'https://www.google-analytics.com',
  'https://www.google.com',
  'https://www.gstatic.com',
];

const PRELOAD_WEBFONTS = [
  '/fonts/raleway-v14-latin-regular.woff2',
  '/fonts/raleway-v14-latin-500.woff2',
  '/fonts/raleway-v14-latin-600.woff2',
  '/fonts/raleway-v14-latin-600.woff2',
  '/fonts/yeseva-one-v14-latin-regular.woff2',
];

class CustomDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render(): JSX.Element {
    return (
      // scroll-pt-[n] classes follow the same height as the heder nav
      <Html lang="en" className="scroll-pt-16 md:scroll-pt-20 xl:scroll-pt-24">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="twitter:card" content="summary" />
          <meta property="og:type" content="website" />

          {/* Manifests */}
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="msapplication-config" content="/browserconfig.xml" />

          {/* Icons & theme colors */}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link
            rel="mask-icon"
            href="/safari-pinned-tab.svg"
            color={sharedTheme.colors.olive.darker}
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="msapplication-TileColor" content={sharedTheme.colors.olive.darker} />
          <meta name="theme-color" content={sharedTheme.colors.olive.darker}></meta>
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@marco_ciampini" />

          {/* This allows styles based on JS being supported or not */}
          <script
            dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js-app')` }}
          ></script>

          {PRECONNECT_ORIGINS.map((url) => (
            <link key={url} rel="preconnect" href={url} crossOrigin="anonymous" />
          ))}

          {PRELOAD_WEBFONTS.map((url) => (
            <link
              key={url}
              rel="preload"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
              href={url}
            />
          ))}
        </Head>
        <body className="text-gray-darker bg-gray-lighter m-0 type-body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
