import '../styles/index.css';

import React from 'react';
import App, { AppContext, AppInitialProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';

import MainLayout from '../components/layouts/Main';
import Analytics from '../components/utils/Analytics';
import routesConfig from '../routes-config';
import { ContentfulPageGeneric, UiLink } from '../typings';

type CustomAppProps = AppInitialProps & {
  navLinks: UiLink[];
};

export default class MyApp extends App<CustomAppProps> {
  static async getInitialProps({ Component, ctx }: AppContext): Promise<CustomAppProps> {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const navLinks: UiLink[] = [];
    for (const routeConfig of routesConfig) {
      if (!routeConfig.contentfulPageData) {
        continue;
      }

      const routeData: ContentfulPageGeneric = await import(
        `../data/${routeConfig.contentfulPageData}.json`
      ).then((m) => m.default);

      if (!routeData || !routeData.navLabel) {
        continue;
      }

      if (
        routeConfig.dynamicRoute &&
        routeConfig.dynamicRoute.contentfulItemsData &&
        routeConfig.dynamicRoute.params
      ) {
        // Contentful based routes.
        const dataItems = await import(
          `../data/${routeConfig.dynamicRoute.contentfulItemsData}.json`
        ).then((m) => m.default);

        for (const dataItem of dataItems) {
          let href = routeConfig.route;
          let label = routeData.navLabel;

          for (const [pattern, replacerFn] of Object.entries(routeConfig.dynamicRoute.params)) {
            if (replacerFn) {
              href = href.replace(`[${pattern}]`, replacerFn(dataItem));
              label = label.replace(`:${pattern}`, replacerFn(dataItem));
            }
          }

          navLinks.push({ href, label });
        }
      } else {
        navLinks.push({ href: routeConfig.route, label: routeData.navLabel });
      }
    }

    return { pageProps, navLinks };
  }

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
    const { Component, pageProps, router, navLinks } = this.props;

    return (
      <>
        <Analytics />

        <MainLayout navLinks={navLinks}>
          <AnimatePresence initial={false} exitBeforeEnter onExitComplete={this.scrollToTop}>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </MainLayout>
      </>
    );
  }
}
