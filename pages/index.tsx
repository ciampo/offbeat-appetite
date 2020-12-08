import React, { memo } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';

import PageMeta from '../components/meta/PageMeta';
import { PageContentContainer } from '../components/layouts/Containers';
import PageHero from '../components/hero/hero';
import BlogPostTileList from '../components/blog-post-tile/BlogPostTileList';
import { ButtonOliveInverted } from '../components/button/Button';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import {
  SanityPageHome,
  SanityPageHomeCategorySection,
  StructuredData,
  NextComponentTypeWithLayout,
} from '../typings';

const BasicSeeMoreLinkEl: React.FC<{ as: string }> = memo(
  ({ as, ...props }): JSX.Element => (
    <Link href="/[categoryId]" as={as}>
      <a {...props} />
    </Link>
  )
);
BasicSeeMoreLinkEl.displayName = 'memo(BasicSeeMoreLinkEl)';

// Home Category Section
type HomeCategorySectionProps = {
  categorySectionData: SanityPageHomeCategorySection;
  even: boolean;
  eagerLoadImages?: boolean;
};
const HomeCategorySection: React.FC<HomeCategorySectionProps> = memo(
  ({ categorySectionData, even, eagerLoadImages = false }) => (
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
          eagerLoadFirstTileImage={eagerLoadImages}
        />
        {/* See more link */}
        <ButtonOliveInverted
          component={BasicSeeMoreLinkEl}
          className="self-center"
          aria-label={`See more ${categorySectionData.category.name} posts`}
          shadow={true}
          border={true}
          as={`/${categorySectionData.category.slug}`}
        >
          More {categorySectionData.title.toLowerCase()}
        </ButtonOliveInverted>
      </PageContentContainer>
    </section>
  )
);
HomeCategorySection.displayName = 'memo(HomeCategorySection)';

type HomeProps = {
  homeData: SanityPageHome;
  path: string;
  structuredData: StructuredData[];
};
const HomePage: NextComponentTypeWithLayout<HomeProps> = ({ homeData, path, structuredData }) => (
  <>
    <PageMeta
      path={path}
      title={homeData.seoTitle}
      description={homeData.seoDescription}
      previewImage={homeData.seoImage}
      structuredData={structuredData}
    />

    <PageHero variant="short" className="bg-gray-800 text-gray-white">
      <PageContentContainer>
        <h1 className="type-display-1 mb-4 md:mb-6">{homeData.subtitle}</h1>
        <p>The Offbeat Appetite is an incredible site built by a very skilled bear</p>
      </PageContentContainer>
    </PageHero>

    {homeData.categorySections.map((categorySectionData, index) => (
      <HomeCategorySection
        key={categorySectionData.category._id}
        categorySectionData={categorySectionData}
        even={index % 2 === 0}
        eagerLoadImages={index === 0}
      />
    ))}
  </>
);

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
