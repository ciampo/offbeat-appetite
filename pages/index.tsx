import React, { memo } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';

import PageMeta from '../components/meta/PageMeta';
import { PageContentContainer } from '../components/layouts/Containers';
import PageHero from '../components/hero/hero';
import BlogPostTileList from '../components/blog-post-tile/BlogPostTileList';
import { ButtonOliveInverted, ButtonTransparent } from '../components/button/Button';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import {
  SanityPageHome,
  SanityPageHomeCategorySection,
  StructuredData,
  NextComponentTypeWithLayout,
} from '../typings';

const homeSectionId = (category?: SanityPageHomeCategorySection): string =>
  category ? `home-category-section-${category.category.slug}` : '';

const ButtonLinkComponent: React.FC<{ href: string; as?: string }> = memo(
  ({ as, href, ...props }): JSX.Element => (
    <Link href={href} as={as}>
      <a {...props} />
    </Link>
  )
);
ButtonLinkComponent.displayName = 'memo(ButtonLinkComponent)';

// Home Category Section
type HomeCategorySectionProps = {
  categorySectionData: SanityPageHomeCategorySection;
  even: boolean;
  eagerLoadImages?: boolean;
};
const HomeCategorySection: React.FC<HomeCategorySectionProps> = memo(
  ({ categorySectionData, even, eagerLoadImages = false }) => (
    <section
      className={[
        'focus:outline-none py-16 md:py-20 xl:py-24',
        even ? 'bg-gray-lighter' : 'bg-gray-light',
      ]
        .filter(Boolean)
        .join(' ')}
      id={homeSectionId(categorySectionData)}
      tabIndex={-1}
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
          component={ButtonLinkComponent}
          className="self-center"
          aria-label={`See more ${categorySectionData.category.name} posts`}
          shadow={true}
          border={true}
          href="/[categoryId]"
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

    <PageHero variant="short" backgroundImage={homeData.heroImage}>
      <PageContentContainer className="text-gray-white text-shadow text-center">
        <h1 className="type-display-1 max-w-ch-22 mx-auto mb-6 sm:mb-8 md:mb-10 xl:mb-12 ">
          {homeData.subtitle}
        </h1>
        <ButtonTransparent
          component={ButtonLinkComponent}
          href={`#${homeSectionId(homeData.categorySections?.[0])}`}
          className="inline-flex group type-tag border-gray-white border-opacity-35"
        >
          {homeData.heroCtaLabel}
          <svg
            className="w-6 h-6 ml-1 -mr-2 transform duration-100 transition-transform translate-y-px group-hover:translate-y-1 group-focus:translate-y-1"
            role="presentation"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M7.4 8.6l4.6 4.6 4.6-4.6L18 10l-6 6-6-6 1.4-1.4z" />
          </svg>
        </ButtonTransparent>
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
