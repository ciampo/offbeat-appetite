import * as React from 'react';
import { GetStaticProps } from 'next';
import { useDebounce } from 'react-use';
import ReactGA from 'react-ga4';

import PageMeta from '../components/meta/PageMeta';
import { getPostsByText } from '../components/blog-post/sanity-browser-client';
import BlogPostTileList from '../components/blog-post-tile/BlogPostTileList';
import PageHero from '../components/hero/hero';
import { PageContentContainer } from '../components/layouts/Containers';
import { TextInputOlive } from '../components/inputs/Input';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import {
  SanityPageSearch,
  StructuredData,
  NextComponentTypeWithLayout,
  SanityBlogPostPreview,
} from '../typings';

type SearchState = 'INITIAL' | 'LOADING' | 'SUCCESS' | 'ERROR';

const sortPostByMostRecent = (p1: SanityBlogPostPreview, p2: SanityBlogPostPreview): number => {
  const p1Timestamp = Date.parse(p1.datePublished);
  const p2Timestamp = Date.parse(p2.datePublished);

  if (isNaN(p1Timestamp) && isNaN(p2Timestamp)) {
    return 0;
  }

  // If we reach this point, they are not both NaN (but one may be)
  if (isNaN(p1Timestamp)) {
    return 1;
  }
  if (isNaN(p2Timestamp)) {
    return -1;
  }

  return p2Timestamp - p1Timestamp;
};

const SearchLoadingSpinner: React.FC = () => (
  <div aria-hidden="true" className="relative">
    <div className="absolute transform-translate-center">
      <div className="mt-12 sm:ml-12 sm:mt-0 loading-spinner text-white text-3xl animation-spin animation-1s animation-ease-in-out animation-fill-both animation-infinite" />
    </div>
  </div>
);

type PageProps = {
  searchData: SanityPageSearch;
  allPostsData: SanityBlogPostPreview[];
  path: string;
  structuredData: StructuredData[];
};
const SearchPage: NextComponentTypeWithLayout<PageProps> = ({
  searchData,
  allPostsData,
  path,
  structuredData,
}) => {
  const [searchDataFetchState, setsearchDataFetchState] = React.useState<SearchState>('INITIAL');

  // TODO: load from query string
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState<string>('');

  // Initially, all currently available posts are shown
  // TODO: sorting?
  const [searchResults, setSearchResults] = React.useState<SanityBlogPostPreview[]>(allPostsData);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    1000,
    [searchTerm]
  );

  React.useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setsearchDataFetchState('LOADING');

      try {
        // Fetch text search results from Sanity
        const searchResults = await getPostsByText(debouncedSearchTerm);
        // Use them to filter the list of all posts saved locally
        // (this is to make sure that only posts available in current site build
        // are shown to the user)
        setSearchResults(
          allPostsData.filter(({ _id }) => searchResults.map(({ _id }) => _id).includes(_id))
        );

        ReactGA.event({
          category: 'User',
          action: 'New search',
          label: `q=${debouncedSearchTerm}`,
        });

        setsearchDataFetchState('SUCCESS');
      } catch (error) {
        setsearchDataFetchState('ERROR');
      }
    };

    if (debouncedSearchTerm === '') {
      setSearchResults(allPostsData);
    } else {
      fetchData();
    }
  }, [allPostsData, debouncedSearchTerm]);

  const onSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    setSearchTerm(currentTarget.value.trim());
  };

  return (
    <>
      <PageMeta
        path={path}
        title={searchData.seoTitle}
        description={searchData.seoDescription}
        previewImage={searchData.seoImage}
        structuredData={structuredData}
      />

      <PageHero variant="shorter" className="bg-olive-darker">
        <PageContentContainer className="flex flex-col sm:flex-row items-center justify-center">
          <h1 className="sr-only">{searchData.title}</h1>
          <TextInputOlive
            className="w-full max-w-md shadow-lg hover:shadow-lg focus:shadow-lg focus-within:shadow-lg"
            name="search"
            placeholder="Search posts"
            value={searchTerm}
            onChange={onSearchInputChange}
            disableInnerShadow={true}
          />
          {searchDataFetchState === 'LOADING' && <SearchLoadingSpinner />}
        </PageContentContainer>
      </PageHero>

      <section className="py-16 md:py-20 xl:py-24">
        <PageContentContainer>
          {searchDataFetchState === 'ERROR' ? (
            <p className="text-red-700 type-heading-2 text-center">
              An error has occurred while retrieving the search results, please try again.
            </p>
          ) : searchResults.length === 0 ? (
            <p className="type-heading-2 text-center">Sorry, no results were found.</p>
          ) : (
            <BlogPostTileList
              tileShadowVariant={'light'}
              tileLayoutVariant={'vertical'}
              postsData={searchResults}
              showOnlyFirstRow={false}
              eagerLoadFirstTileImage={false}
            />
          )}
        </PageContentContainer>
      </section>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const path = '/search';
  const searchData = await import(`../data/pageSearch.json`).then((m) => m.default);
  const allPostsData = await import(`../data/blogPostPreview.json`).then((m) => m.default);
  allPostsData.sort(sortPostByMostRecent);

  return {
    props: {
      searchData,
      allPostsData,
      path,
      structuredData: [
        generateWebpageStructuredData({
          path,
          title: searchData.seoTitle,
          description: searchData.seoDescription,
          breadcrumbPages: [
            {
              path,
              title: searchData.title,
            },
          ],
        }),
      ],
    },
  };
};
export default SearchPage;
