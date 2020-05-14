// Must be the first import
if (process.env.NODE_ENV === 'development') {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require('preact/debug');
}

import '../styles/index.css';

import React from 'react';
import App from 'next/app';
import { AnimatePresence } from 'framer-motion';

import { NavVariantProvider } from '../components/nav/nav-variant-context';
import { SharingImageProvider } from '../components/meta/sharing-image-context';
import MainLayout from '../components/layouts/Main';
import Analytics from '../components/Analytics';

import { NextComponentTypeWithLayout } from '../typings';

export default class MyApp extends App {
  scrollToTop(): void {
    if (process.browser) {
      window.scrollTo(0, 0);
    }
  }

  componentDidMount(): void {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }

  componentWillUnmount(): void {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto';
    }
  }

  render(): JSX.Element {
    const { Component, pageProps, router } = this.props;

    const Layout = (Component as NextComponentTypeWithLayout).Layout || MainLayout;

    return (
      <SharingImageProvider>
        <NavVariantProvider>
          <Analytics />

          <Layout>
            <AnimatePresence initial={false} exitBeforeEnter onExitComplete={this.scrollToTop}>
              <Component {...pageProps} key={router.asPath} />
            </AnimatePresence>
          </Layout>
        </NavVariantProvider>
      </SharingImageProvider>
    );
  }
}
