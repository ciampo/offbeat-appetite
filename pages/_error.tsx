import React, { useCallback } from 'react';
import { NextPageContext } from 'next';

import SimpleLayout from '../components/layouts/Simple';
import PageMeta from '../components/meta/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

import { NextComponentTypeWithLayout } from '../typings';

type ErrorPageProps = {
  statusCode: number;
};

const statusCodes: { [code: number]: string } = {
  400: 'Bad Request',
  404: 'This page could not be found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
};

const CustomError: NextComponentTypeWithLayout<ErrorPageProps> = ({ statusCode }) => {
  const title = statusCodes[statusCode] || 'An unexpected error has occurred';

  const onHomeClick = useCallback((e) => {
    e.preventDefault();
    if (window && window.location && window.location.replace) {
      window.location.replace('/');
    }
  }, []);

  return (
    <>
      <PageMeta title={`${statusCode}: ${title}`} description="An error occurred" path="/404" />

      <DefaultPageTransitionWrapper>
        <header className="mt-16 md:mt-20 xl:mt-24 container mx-auto text-center text-gray-darker">
          <h1 className="text-2xl mb-4">{statusCode}</h1>
          <p className="text-base">{title}</p>
        </header>
        <a href="/" onClick={onHomeClick}>
          Home
        </a>
      </DefaultPageTransitionWrapper>
    </>
  );
};
CustomError.Layout = SimpleLayout;

CustomError.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  const statusCode = res && res.statusCode ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode: statusCode || -1 };
};

export default CustomError;
