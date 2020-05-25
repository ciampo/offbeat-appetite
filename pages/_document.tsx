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

// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

const RECAPTCHA_SRC = 'https://recaptcha.net/recaptcha/api.js?render=explicit';

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
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#546050" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="msapplication-TileColor" content="#546050" />
          <meta name="theme-color" content="#546050"></meta>
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@marco_ciampini" />

          {/* This allows styles based on JS being supported or not */}
          <script
            dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js-app')` }}
          ></script>

          {[
            'https://www.google-analytics.com',
            'https://fonts.gstatic.com/',
            'https://www.google.com',
            'https://www.gstatic.com',
            'https://fonts.googleapis.com',
          ].map((url) => (
            <link key={url} rel="preconnect" href={url} crossOrigin="anonymous" />
          ))}

          <link rel="preload" as="script" href={RECAPTCHA_SRC} />

          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Yeseva+One&display=swap"
          />
        </Head>
        <body className="text-gray-darker bg-gray-lighter m-0 type-body">
          <Main />
          <NextScript />
          <script defer={true} src={RECAPTCHA_SRC}></script>
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
