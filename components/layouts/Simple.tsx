import React from 'react';

const SimpleLayout: React.FC = ({ children }) => (
  <main
    data-testid="simple-layout-main-content"
    id="content"
    tabIndex={-1}
    className="outline-none relative bg-gray-lighter z-10"
  >
    {children}
  </main>
);

export default SimpleLayout;
