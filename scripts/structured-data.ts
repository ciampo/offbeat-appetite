import { portableTextToPlainText } from '../sanity/portableText';
import { joinUrl, stringifyRecipeIngredient, sanitySimpleImageUrl } from './utils';
import { StructuredData, SanityPersonFull, SanityBlogPostFull, SanityRecipe } from '../typings';

import siteMiscContentData from '../data/siteMiscContent.json';

const canonicalUrl = process.env.NEXT_PUBLIC_CANONICAL_URL || '';

export const GRAPH_IDS = {
  AUTHOR: '#author',
  FOUNDER: '#founder',
  ORGANISATION: '#organisation',
  WEBSITE: '#website',
  WEBPAGE: '#webpage',
};

type PersonData = {
  person: SanityPersonFull;
  role: string;
};
function generatePersonStructuredData({ person, role }: PersonData): StructuredData {
  const { name, email, urls, bio, country } = person;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': role,
    name,
    email,
    sameAs: urls.map((url) => url),
    description: bio,
    nationality: {
      '@type': 'Country',
      address: {
        '@type': 'PostalAddress',
        addressCountry: country,
      },
    },
  };
}

export const ORGANISATION_FOUNDER_STRUCTURED_DATA: StructuredData = generatePersonStructuredData({
  person: siteMiscContentData.organisationAuthor,
  role: GRAPH_IDS.FOUNDER,
});

export const ORGANISATION_STRUCTURED_DATA: StructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': GRAPH_IDS.ORGANISATION,
  url: canonicalUrl,
  sameAs: siteMiscContentData.socialLinks.map(({ url }) => url),
  logo: {
    url: joinUrl(canonicalUrl, 'android-chrome-512x512.png'),
    ['@type']: 'ImageObject',
    width: '512',
    height: '512',
  },
  name: siteMiscContentData.siteName,
  email: siteMiscContentData.organisationEmail,
  founder: {
    '@id': GRAPH_IDS.FOUNDER,
  },
};

export const WEBSITE_STRUCTURED_DATA: StructuredData = {
  '@type': 'WebSite',
  '@context': 'https://schema.org',
  '@id': GRAPH_IDS.WEBSITE,
  url: canonicalUrl,
  name: siteMiscContentData.siteName,
  publisher: {
    '@id': GRAPH_IDS.ORGANISATION,
  },
};

type BreadcrumbPage = {
  title: string;
  path: string;
};
type WebpageData = {
  path: string;
  title: string;
  description: string;
  breadcrumbPages: BreadcrumbPage[];
};
export function generateWebpageStructuredData({
  path,
  title,
  description,
  breadcrumbPages,
}: WebpageData): StructuredData {
  const toReturnBase = {
    '@type': 'WebPage',
    '@context': 'https://schema.org',
    '@id': GRAPH_IDS.WEBPAGE,
    url: joinUrl(canonicalUrl, path),
    name: title,
    isPartOf: {
      '@id': GRAPH_IDS.WEBSITE,
    },
    inLanguage: 'en',
    description,
  };

  if (breadcrumbPages.length) {
    return {
      ...toReturnBase,
      breadcrumb: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbPages.map(({ title, path }, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: title,
          item: joinUrl(canonicalUrl, path),
        })),
      },
    };
  }

  return toReturnBase;
}

function generateArticleAuthorStructuredData(person: SanityPersonFull): StructuredData {
  return generatePersonStructuredData({
    person,
    role: GRAPH_IDS.AUTHOR,
  });
}

function generateBlogPostKeywords({ tags = [], keywords }: SanityBlogPostFull): string {
  return [...keywords, ...tags.map(({ name }) => name)].join(', ');
}

type RecipeData = {
  blogPostData: SanityBlogPostFull;
  recipeData: SanityRecipe;
  path: string;
};
export function generateRecipeStructuredData({
  blogPostData,
  recipeData,
  path,
}: RecipeData): StructuredData {
  const toReturn: StructuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipeData.title,
    description: recipeData.description,
    author: {
      '@id': GRAPH_IDS.AUTHOR,
    },
    keywords: generateBlogPostKeywords(blogPostData),
    image: [
      // 1:1
      sanitySimpleImageUrl({ imageBaseSrc: blogPostData.seoImage, width: 1280, height: 1280 }),
      // 4:3
      sanitySimpleImageUrl({ imageBaseSrc: blogPostData.seoImage, width: 1280, height: 960 }),
      // 16:9
      sanitySimpleImageUrl({ imageBaseSrc: blogPostData.seoImage, width: 1280, height: 720 }),
    ],
    url: joinUrl(canonicalUrl, path),
    recipeIngredient: recipeData.ingredients.map(stringifyRecipeIngredient),
    recipeInstructions: recipeData.method.map(({ title, content }, i) => ({
      '@type': 'HowToStep',
      name: title,
      text: portableTextToPlainText(content),
      url: joinUrl(canonicalUrl, `${path}#recipe-step-${i + 1}`),
      // "image": "https://example.com/photos/party-coffee-cake/step4.jpg"
    })),
    prepTime: `PT${recipeData.preparationTime}M`,
    cookTime: `PT${recipeData.cookingTime}M`,
    totalTime: `PT${recipeData.preparationTime + recipeData.cookingTime}M`,
    recipeYield: recipeData.servings.quantity,
    recipeCategory: recipeData.category,
    recipeCuisine: recipeData.cuisine,
    nutrition: {
      '@type': 'nutritionInformation',
      calories: recipeData.calories,
    },
    datePublished: blogPostData.datePublished,
    // Missing: video
  };

  // if (blogPostData.reviews.length) {
  //   toReturn.aggregateRating = {
  //     '@type': 'AggregateRating',
  //     reviewCount: blogPostData.reviews.length,
  //     ratingValue:
  //       Math.round(
  //         (100 * blogPostData.reviews.reduce((acc, curr) => acc + curr, 0)) /
  //           blogPostData.reviews.length
  //       ) / 100,
  //   };
  // }

  return toReturn;
}

type ArticleData = {
  blogPostData: SanityBlogPostFull;
  path: string;
};
export function generateArticleStructuredData({
  blogPostData,
  path,
}: ArticleData): StructuredData[] {
  const toReturn = [
    generateArticleAuthorStructuredData(blogPostData.author),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blogPostData.title,
      alternativeHeadline: blogPostData.excerpt,
      url: joinUrl(canonicalUrl, path),
      inLanguage: 'en',
      // IMAGE TODO:
      // - resize / reformat
      // - add size info
      // - prepare more than one with different ratios
      image: blogPostData.seoImage,
      datePublished: blogPostData.datePublished,
      dateModified: blogPostData._updatedAt.split('T')[0],
      articleSection: blogPostData.category.name,
      keywords: generateBlogPostKeywords(blogPostData),
      author: {
        '@id': GRAPH_IDS.AUTHOR,
      },
      publisher: {
        '@id': GRAPH_IDS.ORGANISATION,
      },
      mainEntityOfPage: {
        '@id': GRAPH_IDS.WEBPAGE,
      },
      commentCount: blogPostData.comments.count,
    },
  ];

  const recipeData = blogPostData.content.find((block) => block._type === 'recipe') as SanityRecipe;
  if (recipeData) {
    toReturn.push(
      generateRecipeStructuredData({
        blogPostData,
        recipeData,
        path,
      })
    );
  }

  return toReturn;
}
