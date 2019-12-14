import React from 'react';
import PropTypes from 'prop-types';
import { NextComponentType, NextPageContext } from 'next';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import { ContentfulApiPageAbout } from '../typings';
import routesConfig from '../routes-config';

type PageAboutProps = ContentfulApiPageAbout & {
  path: string;
};

const About: NextComponentType<{}, PageAboutProps, PageAboutProps> = ({
  meta,
  path,
  title,
  bio,
}) => {
  return (
    <>
      <PageMeta key="page-meta" title={meta.title} description={meta.description} path={path} />

      <DefaultPageTransitionWrapper>
        <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-48 container mx-auto">
          <h1 className="px-6 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{title}</h1>

          {/* Bio */}
          {bio && (
            <div className="lg:flex-1 rich-text-container">{documentToReactComponents(bio)}</div>
          )}
        </section>
      </DefaultPageTransitionWrapper>
    </>
  );
};

About.getInitialProps = async ({ pathname }: NextPageContext): Promise<PageAboutProps> => {
  const toReturn: PageAboutProps = {
    path: '/na',
    title: 'About me',
    meta: {
      title: 'About',
      description: 'About page',
    },
    bio: undefined,
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);

  if (routeConfig && routeConfig.contentfulPageData) {
    const aboutData: ContentfulApiPageAbout = await import(
      `../data/${routeConfig.contentfulPageData}.json`
    ).then((m) => m.default);

    toReturn.path = pathname;
    toReturn.title = aboutData.title;
    toReturn.meta = aboutData.meta;
    toReturn.bio = aboutData.bio;
  }

  return toReturn;
};

About.propTypes = {
  path: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  // using 'any' avoids strange incompatibilities with Typescript type
  bio: PropTypes.any,
};

export default About;
