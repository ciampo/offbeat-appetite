import React from 'react';

import Nav from '../nav/Nav';

const MainLayout: React.FC = ({ children }) => (
  <>
    <Nav />

    <main className="w-full">{children}</main>

    {/* <Footer /> */}
  </>
);

export default MainLayout;
