import React, { useEffect, memo } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';

import PageMeta from '../components/meta/PageMeta';
import { PageContentContainer } from '../components/layouts/Containers';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import { OALogoFull } from '../components/icons';
import { useNavVariantDispatch } from '../components/nav/nav-variant-context';
import BlogPostTileList from '../components/blog-post-tile/BlogPostTileList';
import { ButtonOliveNeutral } from '../components/button/Button';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import {
  SanityPageHome,
  SanityPageHomeCategorySection,
  StructuredData,
  NextComponentTypeWithLayout,
} from '../typings';

// Home Category Section
type HomeCategorySectionProps = {
  categorySectionData: SanityPageHomeCategorySection;
  even: boolean;
};
const HomeCategorySection: React.FC<HomeCategorySectionProps> = memo(
  ({ categorySectionData, even }) => (
    <section
      className={['py-16 md:py-20 xl:py-24', even ? 'bg-gray-lighter' : 'bg-gray-light']
        .filter(Boolean)
        .join(' ')}
    >
      <PageContentContainer className="flex flex-col items-stretch space-y-10 md:space-y-12 xl:space-y-16 bg-inherit">
        {/* Title */}
        <h2 className="type-display-2 flex justify-center">
          <span className="mr-3" aria-hidden="true">
            —
          </span>
          {categorySectionData.title}
          <span className="ml-3" aria-hidden="true">
            —
          </span>
        </h2>
        {/* Tiles */}
        <BlogPostTileList
          tileShadowVariant={even ? 'lighter' : 'light'}
          tileLayoutVariant={
            categorySectionData.category.featuredBlogPosts.length === 1 ? 'horizontal' : 'vertical'
          }
          postsData={categorySectionData.category.featuredBlogPosts}
          showOnlyFirstRow={true}
        />
        {/* See more link */}
        <ButtonOliveNeutral
          component={(props): JSX.Element => (
            <Link href="/[categoryId]" as={`/${categorySectionData.category.slug}`}>
              <a {...props} />
            </Link>
          )}
          scroll={false}
          className="self-center"
          aria-label={`See more ${categorySectionData.category.name} posts`}
        >
          More {categorySectionData.title.toLowerCase()}
        </ButtonOliveNeutral>
      </PageContentContainer>
    </section>
  )
);
HomeCategorySection.displayName = 'memo(HomeCategorySection)';

// Home Page
type HomeProps = {
  homeData: SanityPageHome;
  path: string;
  structuredData: StructuredData[];
};
const HomePage: NextComponentTypeWithLayout<HomeProps> = ({ homeData, path, structuredData }) => {
  const setVariant = useNavVariantDispatch();
  useEffect(() => {
    setVariant('solid');
  }, [setVariant]);

  return (
    <>
      <PageMeta
        path={path}
        title={homeData.seoTitle}
        description={homeData.seoDescription}
        previewImage={homeData.seoImage}
        structuredData={structuredData}
      />

      <DefaultPageTransitionWrapper>
        <header
          className={[
            'flex flex-col items-center justify-center',
            'mt-16 md:mt-20 xl:mt-24',
            'py-4 xsm:py-8 md:py-12 lg:py-16 xl:py-20',
            '-mb-2 xsm:-mb-4 md:-mb-6 lg:-mb-8 xl:-mb-10',
            'space-y-2 sm:space-y-3 md:space-y-4 xl:space-y-5',
          ].join(' ')}
        >
          <h1>
            <OALogoFull
              aria-label={homeData.title}
              className="w-64 xsm:w-72 md:w-80 lg:w-88 xl:w-96"
            />
          </h1>
          <p className="type-eyebrow">{homeData.subtitle}</p>
        </header>
        {homeData.categorySections.map((categorySectionData, index) => (
          <HomeCategorySection
            key={categorySectionData.category._id}
            categorySectionData={categorySectionData}
            even={index % 2 === 0}
          />
        ))}
      </DefaultPageTransitionWrapper>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const path = '/';
  const homeData = await import(`../data/pageHome.json`).then((m) => m.default);

  return {
    props: {
      homeData,
      path,
      structuredData: [
        generateWebpageStructuredData({
          path,
          title: homeData.seoTitle,
          description: homeData.seoDescription,
          breadcrumbPages: [],
        }),
      ],
    },
  };
};
export default HomePage;
