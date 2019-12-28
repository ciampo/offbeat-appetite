import React from 'react';
import { NextComponentType, NextPageContext } from 'next';

import PageMeta from '../../components/PageMeta';
import ContentfulImage from '../../components/media/image';
import ContentfulVideo from '../../components/media/video';
import DefaultPageTransitionWrapper from '../../components/page-transition-wrappers/Default';
import { initialDefaultPageProps } from '../../components/utils/initial-props';

import {
  ContentfulApiPageProject,
  ContentfulApiProject,
  ContentfulMedia,
  ContentfulApiStructuredData,
} from '../../typings';
import {
  generateWebpageStructuredData,
  generateArticleStructuredData,
} from '../../components/utils/structured-data';
import routesConfig from '../../routes-config';
import { content, narrowMedia } from '../../components/media/sizes-presets';

type PagePostProps = ContentfulApiPageProject & {
  path: string;
  project?: ContentfulApiProject;
  parentPage?: {
    path: string;
    title: string;
  };
};

const articleMedia = (
  mediaObj: {
    source: ContentfulMedia;
  },
  sizePreset: {
    sizes: string;
    resolutions: number[];
  },
  wrapperClassName?: string
): JSX.Element => (
  <div className={wrapperClassName}>
    {/video/.test(mediaObj.source.file.contentType) ? (
      <ContentfulVideo src={mediaObj.source.file.url} className="mb-24" />
    ) : (
      <ContentfulImage
        baseSrc={mediaObj.source.file.url}
        resolutions={sizePreset.resolutions}
        sizes={sizePreset.sizes}
        label={mediaObj.source.description}
        className="relative mb-24"
        ratio={
          mediaObj.source.file.details.image
            ? mediaObj.source.file.details.image.height / mediaObj.source.file.details.image.width
            : undefined
        }
        lazy={true}
        base64Thumb={mediaObj.source.file.__base64Thumb}
      />
    )}
  </div>
);

const Post: NextComponentType<{}, PagePostProps, PagePostProps> = ({
  mediaSectionTitle,
  project,
  meta,
  path,
  structuredDataTemplate,
  parentPage,
}) =>
  project ? (
    <>
      <PageMeta
        title={meta.title}
        description={meta.description}
        previewImage={meta.previewImage.file.url}
        path={path}
        webPageStructuredData={
          structuredDataTemplate &&
          generateWebpageStructuredData(structuredDataTemplate, {
            title: meta.title,
            description: meta.description,
            breadcrumbsPages: parentPage && [
              {
                name: parentPage.title,
                url: parentPage.path,
              },
            ],
          })
        }
        articleStructuredData={
          structuredDataTemplate &&
          generateArticleStructuredData(structuredDataTemplate, {
            title: project.title,
            image: `https:${project.tileImage.file.url}?w=1280&fit=fill&fm=jpg&q=70`,
            publicationDate: project.publicationDate,
            modifiedDate: project._updatedAt,
          })
        }
      />

      <DefaultPageTransitionWrapper>
        <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-48 container mx-auto">
          <h1 className="px-6 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {project.title}
          </h1>
          <p>This is the post content.</p>
        </section>
        <section className="container mx-auto px-6 mt-24 sm:mt-32 md:mt-40 mb-16 sm:mb-20 md:mb-24">
          <h2 className="sr-only">{mediaSectionTitle}</h2>

          {/* Wide pictures */}
          {project.widePictures &&
            project.widePictures.map((mediaObj) => articleMedia(mediaObj, content))}

          {/* Narrow pictures */}
          {project.narrowPictures &&
            project.narrowPictures.map((mediaObj) =>
              articleMedia(mediaObj, narrowMedia, 'mx-auto max-w-xs')
            )}
        </section>
      </DefaultPageTransitionWrapper>
    </>
  ) : null;

Post.getInitialProps = async ({ pathname, query }: NextPageContext): Promise<PagePostProps> => {
  const toReturn: PagePostProps = {
    ...initialDefaultPageProps,
    path: 'N/A',
    mediaSectionTitle: 'Media',
    project: undefined,
    parentPage: undefined,
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);
  if (
    routeConfig &&
    routeConfig.dynamicRoute &&
    routeConfig.dynamicRoute.contentfulItemsData &&
    routeConfig.dynamicRoute.params
  ) {
    const postData: ContentfulApiProject[] = await import(
      `../../data/${routeConfig.dynamicRoute.contentfulItemsData}.json`
    ).then((m) => m.default);

    const currentPost = postData.find((item) => {
      let matchFound = true;

      for (const [pattern, replacerFn] of Object.entries(routeConfig.dynamicRoute.params)) {
        matchFound = matchFound && query[pattern] === replacerFn(item);
      }

      return matchFound;
    });

    if (currentPost) {
      const projectPageData: ContentfulApiPageProject = await import(
        `../../data/${routeConfig.contentfulPageData}.json`
      ).then((m) => m.default);

      // Meta data comes from projectPageData, and then placeholders are swapped
      // for the actual title/description of the current project.
      toReturn.meta = {
        title: projectPageData.meta.title.replace('[project-title]', currentPost.title),
        description: projectPageData.meta.description.replace(
          '[project-description]',
          currentPost.title
        ),
        previewImage: currentPost.tileImage,
      };

      toReturn.mediaSectionTitle = projectPageData.mediaSectionTitle;

      // Path and projects are set from the current project API data.
      toReturn.path = pathname;
      for (const [pattern, replacerFn] of Object.entries(routeConfig.dynamicRoute.params)) {
        toReturn.path = toReturn.path.replace(`[${pattern}]`, replacerFn(currentPost));
      }

      toReturn.project = currentPost;

      const structuredDataTemplate: ContentfulApiStructuredData = await import(
        `../../data/structured-data-template.json`
      ).then((m) => m.default);
      toReturn.structuredDataTemplate = structuredDataTemplate;
    }

    // if (routeConfig.parentRoute) {
    //   const parentRouteConfig = routesConfig.find(({ route }) => route === routeConfig.parentRoute);
    //   if (parentRouteConfig && parentRouteConfig.contentfulPageData) {
    //     const parentPageData: ContentfulApiPageProjectsList = await import(
    //       `../../data/${parentRouteConfig.contentfulPageData}.json`
    //     ).then((m) => m.default);

    //     toReturn.parentPage = {
    //       path: routeConfig.parentRoute,
    //       title: parentPageData.title,
    //     };
    //   }
    // }
  }

  return toReturn;
};

export default Post;
