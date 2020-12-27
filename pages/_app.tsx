// Must be the first import
if (process.env.NODE_ENV === 'development') {
  // Must use require here as import statements are only allowed
  // to exist at the top of a file.
  require('preact/debug');
}

import '../styles/index.css';

import React from 'react';
import App from 'next/app';
import dynamic from 'next/dynamic';

import { SharingImageProvider } from '../components/meta/sharing-image-context';
import MainLayout from '../components/layouts/Main';

const Analytics = dynamic(() => import('../components/Analytics'), { ssr: false });

import { NextComponentTypeWithLayout } from '../typings';

export default class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps, router } = this.props;

    const Layout = (Component as NextComponentTypeWithLayout).Layout || MainLayout;

    return (
      <SharingImageProvider>
        <Analytics />

        <Layout>
          <Component {...pageProps} key={router.asPath} />
        </Layout>
      </SharingImageProvider>
    );
  }
}
