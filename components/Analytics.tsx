import * as React from 'react';
import ReactGA from 'react-ga4';
import Router from 'next/router';

const pageView = (): void => {
  if (window.IS_GA_INIT) {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }
};

const Analytics: React.FC = () => {
  React.useEffect(() => {
    // Init GA the first time.
    if (!window.IS_GA_INIT && process.env.NEXT_PUBLIC_GA) {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GA, {
        gtagOptions: {
          // Disable automatic page view (to work properly, it also needs to disable
          // enhanced measurement on GA4 dashboard)
          // https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag#disable_pageview_measurement
          send_page_view: false,
        },
      });
      window.IS_GA_INIT = true;
    }

    // Send a pageview event
    pageView();

    // Send a pageview event every time a new route is activated.
    Router.events.on('routeChangeComplete', pageView);

    return (): void => {
      // Cleanup subscriptions / event listeners.
      Router.events.off('routeChangeComplete', pageView);
    };
  }, []);

  return null;
};

export default Analytics;
