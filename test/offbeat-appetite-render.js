// import React from 'react';
// import PropTypes from 'prop-types';
// import { render as rtlRender } from '@testing-library/react';

// function render(ui, {theme = themes.dark, ...options} = {}) {
//   function Wrapper({children}) {
//     return <ThemeProvider theme={theme}>{children}</ThemeProvider>
//   }

//   return rtlRender(ui, {wrapper: Wrapper, ...options})
// }

export * from '@testing-library/react';
// override the built-in render with our own
// export { render };
