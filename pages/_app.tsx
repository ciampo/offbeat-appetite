import 'preact/debug';
import '../styles/index.css';

import React from 'react';
import App from 'next/app';
import { AnimatePresence } from 'framer-motion';

import { NavVariantProvider } from '../components/nav/nav-variant-context';
import { SharingImageProvider } from '../components/meta/sharing-image-context';
import MainLayout from '../components/layouts/Main';
import Analytics from '../components/Analytics';

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

    return (
      <SharingImageProvider>
        <NavVariantProvider>
          <Analytics />

          <MainLayout>
            <AnimatePresence initial={false} exitBeforeEnter onExitComplete={this.scrollToTop}>
              <Component {...pageProps} key={router.asPath} />
            </AnimatePresence>
          </MainLayout>
        </NavVariantProvider>
      </SharingImageProvider>
    );
  }
}
