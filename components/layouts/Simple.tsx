import React from 'react';

import Nav from '../nav/Nav';
import Footer from '../footer/Footer';

const SimpleLayout: React.FC = ({ children }) => (
  <>
    <Nav />
    <main
      data-testid="simple-layout-main-content"
      id="content"
      tabIndex={-1}
      className="outline-none relative bg-gray-lighter z-10 md:shadow-lg"
    >
      {children}
    </main>

    <Footer />
  </>
);

export default SimpleLayout;
