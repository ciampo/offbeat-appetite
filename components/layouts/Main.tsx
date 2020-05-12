import React from 'react';

import Nav from '../nav/Nav';
import Footer from '../footer/Footer';
import NewsletterSubscribe from '../form/NewsletterSubscribe';

const MainLayout: React.FC = ({ children }) => (
  <>
    <Nav />

    <main
      data-testid="main-layout-main-content"
      id="content"
      tabIndex={-1}
      className="outline-none relative bg-gray-white z-10 min-h-screen"
    >
      {children}
    </main>

    <NewsletterSubscribe formInstance="pre-footer" />

    <Footer />
  </>
);

export default MainLayout;
