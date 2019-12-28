import React from 'react';
import { NextComponentType, NextPageContext } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import RichTextRenderer from '../components/utils/RichTextRenderer';
import { generateWebpageStructuredData } from '../components/utils/structured-data';
import { initialDefaultPageProps } from '../components/utils/initial-props';
import { ContentfulApiPageAbout, ContentfulApiStructuredData } from '../typings';
import routesConfig from '../routes-config';

type PageAboutProps = ContentfulApiPageAbout & {
  path: string;
};

const About: NextComponentType<{}, PageAboutProps, PageAboutProps> = ({
  meta,
  path,
  title,
  bio,
  structuredDataTemplate,
}) => {
  return (
    <>
      <PageMeta
        key="page-meta"
        title={meta.title}
        description={meta.description}
        previewImage={meta.previewImage.file.url}
        path={path}
        webPageStructuredData={
          structuredDataTemplate &&
          generateWebpageStructuredData(structuredDataTemplate, {
            title: meta.title,
            description: meta.description,
          })
        }
      />

      <DefaultPageTransitionWrapper>
        <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-48 container mx-auto">
          <h1 className="px-6 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{title}</h1>

          {/* Bio */}
          {bio && (
            <div className="lg:flex-1 rich-text-container">
              <RichTextRenderer richText={bio} />
            </div>
          )}
        </section>
      </DefaultPageTransitionWrapper>
    </>
  );
};

About.getInitialProps = async ({ pathname }: NextPageContext): Promise<PageAboutProps> => {
  const toReturn: PageAboutProps = {
    ...initialDefaultPageProps,
    path: '/na',
    title: 'About me',
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

  const structuredDataTemplate: ContentfulApiStructuredData = await import(
    `../data/structured-data-template.json`
  ).then((m) => m.default);
  toReturn.structuredDataTemplate = structuredDataTemplate;

  return toReturn;
};

export default About;
