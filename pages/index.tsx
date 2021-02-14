import * as React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';

import PageMeta from '../components/meta/PageMeta';
import { PageContentContainer } from '../components/layouts/Containers';
import PageHero from '../components/hero/hero';
import BlogPostTileList from '../components/blog-post-tile/BlogPostTileList';
import { ButtonOliveInverted, ButtonTransparent } from '../components/button/Button';
import SimplePortableText from '../components/portable-text/SimplePortableText';
import AccessibleImage from '../components/media/AccessibleImage';
import { homeAboutImageResponsiveConfig } from '../components/media/image-responsive-configurations';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import {
  SanityPageHome,
  SanityPageHomeCategorySection,
  StructuredData,
  NextComponentTypeWithLayout,
} from '../typings';

const homeSectionId = (category?: SanityPageHomeCategorySection): string =>
  category ? `home-category-section-${category.category.slug}` : '';

const ButtonLinkComponent: React.FC<{ href: string; as?: string }> = React.memo(
  ({ as, href, ...props }): JSX.Element => (
    <Link href={href} as={as}>
      <a {...props} />
    </Link>
  )
);
ButtonLinkComponent.displayName = 'React.memo(ButtonLinkComponent)';

// Home Category Section
type HomeCategorySectionProps = {
  categorySectionData: SanityPageHomeCategorySection;
  even: boolean;
  eagerLoadImages?: boolean;
};
const HomeCategorySection: React.FC<HomeCategorySectionProps> = React.memo(
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
      <PageContentContainer className="flex flex-col items-stretch bg-inherit">
        {/* Title */}
        <h2 className="type-display-2 flex justify-center items-center space-x-3 mb-5 md:mb-6 xl:mb-8">
          <span aria-hidden="true">—</span>
          <span>{categorySectionData.title}</span>
          <span aria-hidden="true">—</span>
        </h2>
        <p className="text-center mx-auto italic mb-12 sm:mb-16 xl:mb-20">
          {categorySectionData.category.description}
        </p>
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
          className="self-center mt-10 md:mt-12 xl:mt-16"
          aria-label={`See more ${categorySectionData.category.name} posts`}
          shadow={true}
          border={true}
          href="/[categoryId]"
          as={`/${categorySectionData.category.slug}`}
        >
          See all {categorySectionData.category.name.toLowerCase()}
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

    {/* About section */}
    <section className="bg-olive-medium pt-16 pb-20 sm:pt-20 sm:pb-24 md:py-24 xl:py-32">
      <PageContentContainer className="flex flex-col md:flex-row md:justify-between md:items-stretch">
        <div className="mb-12 md:mb-0 md:pb-2 max-w-xl">
          <h2 className="type-display-2 mb-4 md:mb-5 xl:mb-6">{homeData.aboutTitle}</h2>
          <SimplePortableText blocks={homeData.aboutContent} />
        </div>
        <div className="w-full max-w-md self-end md:max-w-none md:self-stretch md:w-64 md:ml-16 md:flex-grow-0 md:flex-shrink-0 lg:w-72 xl:w-80">
          <div className="relative w-full h-0 aspect-ratio-16/9 md:h-full md:aspect-ratio-none">
            <AccessibleImage
              image={homeData.aboutImage}
              responsiveConfig={homeAboutImageResponsiveConfig}
              className="absolute inset-0 w-full h-full rounded"
              style={{
                paddingBottom: '0',
              }}
            />
          </div>
        </div>
      </PageContentContainer>
    </section>

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
