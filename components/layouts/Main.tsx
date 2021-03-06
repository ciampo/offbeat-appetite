import * as React from 'react';

import Nav from '../nav/Nav';
import NewsletterSubscribeForm from '../form/NewsletterSubscribe';
import Footer from '../footer/Footer';

const MainLayout: React.FC = ({ children }) => (
  <>
    <Nav />

    <main
      data-testid="main-layout-main-content"
      id="site-content"
      tabIndex={-1}
      className="outline-none relative bg-gray-lighter"
    >
      {children}

      <NewsletterSubscribeForm formInstance="pre-footer" />
    </main>

    <Footer />
  </>
);

export default MainLayout;
