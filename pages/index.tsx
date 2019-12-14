import React from 'react';
import PropTypes from 'prop-types';
import { NextComponentType, NextPageContext } from 'next';
import Link from 'next/link';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import PageMeta from '../components/PageMeta';
import { ContentfulApiPageHome, ContentfulApiProject } from '../typings';
import routesConfig from '../routes-config';

type PageHomeProps = ContentfulApiPageHome & {
  path: string;
  projects: ContentfulApiProject[];
};

const PostLink: React.FC<{ id: string; label: string }> = ({ id, label }) => (
  <li>
    <Link href="/post/[id]" as={`/post/${id}`}>
      <a>{label}</a>
    </Link>
  </li>
);

PostLink.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

const Home: NextComponentType<{}, PageHomeProps, PageHomeProps> = ({ path, meta, projects }) => (
  <>
    <PageMeta title={meta.title} description={meta.description} path={path} />

    <DefaultPageTransitionWrapper>
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-48 container mx-auto">
        <div className="w-full text-gray-700">
          <h1 className="m-0 w-fullleading-tight text-5xl text-center">Next.js template</h1>
          <p className="text-center">Just a little help to get started with all the right stuff.</p>
        </div>

        <nav>
          <ul>
            {projects.map((p) => (
              <PostLink id={p.slug} label={p.title} key={`home-post-link${p.slug}`} />
            ))}
          </ul>
        </nav>
      </section>
    </DefaultPageTransitionWrapper>
  </>
);

Home.getInitialProps = async ({ pathname }: NextPageContext): Promise<PageHomeProps> => {
  const toReturn = {
    path: '/na',
    pageTitle: 'Home',
    meta: {
      title: 'Home',
      description: 'Home page',
    },
    projects: [] as ContentfulApiProject[],
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);

  if (routeConfig && routeConfig.contentfulPageData) {
    const homeData: ContentfulApiPageHome = await import(
      `../data/${routeConfig.contentfulPageData}.json`
    ).then((m) => m.default);

    toReturn.path = pathname;
    toReturn.pageTitle = homeData.pageTitle;
    toReturn.meta = homeData.meta;
  }

  const projects: ContentfulApiProject[] = await import('../data/personal-projects.json').then(
    (m) => m.default
  );

  toReturn.projects = projects;

  return toReturn;
};

Home.propTypes = {
  path: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  pageTitle: PropTypes.string.isRequired,
  projects: PropTypes.array.isRequired,
};

export default Home;
