import * as React from 'react';
import { GetStaticProps } from 'next';
import { useDebounce } from 'react-use';

import PageMeta from '../components/meta/PageMeta';
import { getPostsByText } from '../components/blog-post/sanity-browser-client';
import BlogPostTileList from '../components/blog-post-tile/BlogPostTileList';

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

type PageProps = {
  searchData: SanityPageSearch;
  allPostsData: SanityBlogPostPreview[];
  path: string;
  structuredData: StructuredData[];
};
const AboutPage: NextComponentTypeWithLayout<PageProps> = ({
  searchData,
  allPostsData,
  path,
  structuredData,
}) => {
  const [searchDataFetchState, setsearchDataFetchState] = React.useState<SearchState>('INITIAL');

  // TODO: load from query string
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState<string>('');

  // @TODO: start with undefined
  const [searchResults, setSearchResults] = React.useState<SanityBlogPostPreview[]>([]);

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
        const searchResults = await getPostsByText(debouncedSearchTerm);
        setSearchResults(
          allPostsData.filter(({ _id }) => searchResults.map(({ _id }) => _id).includes(_id))
        );

        setsearchDataFetchState('SUCCESS');
      } catch (error) {
        setsearchDataFetchState('ERROR');
      }
    };

    if (debouncedSearchTerm === '') {
      setSearchResults([]);
    } else {
      fetchData();
    }
  }, [allPostsData, debouncedSearchTerm]);

  const onSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget }) => {
    setSearchTerm(currentTarget.value);
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
      <div style={{ height: '200px' }}></div>
      Search:
      <input
        type="text"
        value={searchTerm}
        placeholder="Debounced input"
        onChange={onSearchInputChange}
      />
      <BlogPostTileList
        tileShadowVariant={'light'}
        tileLayoutVariant={'vertical'}
        postsData={searchResults}
        showOnlyFirstRow={false}
        eagerLoadFirstTileImage={false}
      />
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
export default AboutPage;
