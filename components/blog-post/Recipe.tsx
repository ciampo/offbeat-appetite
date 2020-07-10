import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { usePostReviewsState } from './blog-post-reviews-context';
import { StarEmptyIcon, StarHalfIcon, StarFullIcon } from '../icons';
import SimplePortableText from '../portable-text/SimplePortableText';
import { ArticleContentContainer } from '../layouts/Containers';
import { stringifyRecipeIngredient, stringifyRecipeQuantity, joinUrl } from '../../scripts/utils';

import {
  recipePrepTimeLabel,
  recipeCookTimeLabel,
  recipeTimeUnitLabel,
  recipeServingsLabel,
  recipeIngredientsSectionTitle,
  recipeMethodSectionTitle,
  recipeDescriptionSectionTitle,
  recipeInformationSectionTitle,
} from '../../data/siteMiscContent.json';

import { SanityRecipe } from '../../typings';
import { AllSharingButtons } from '../sharing/sharing-links';

import { socialShareLabel } from '../../data/siteMiscContent.json';

const FORM_NAME = 'review-rating';
const FORM_METHOD = 'POST';
const FORM_ACTION = '/thank-you';
const FIELD_NAMES = {
  BOT: 'bot-field',
  RATING: 'rating',
  DOCUMENT_ID: 'document-id',
  FORM_NAME: 'form-name',
};

function encode(data: { [key: string]: string }): string {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

const ReviewForm: React.FC<{ documentId: string | null }> = ({ documentId }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [highlightedStarIndex, setHighlightedStarIndex] = useState(-1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = !documentId || isSubmitting;

  const handleSubmit = useCallback((e?: React.FormEvent<HTMLFormElement>): void => {
    e?.preventDefault();

    function onSubmissionError(error: string): void {
      setIsSubmitting(false);
      setShowErrorMessage(true);
      setShowSuccessMessage(false);

      const errorMsg = JSON.stringify(error);
      console.warn(errorMsg);

      // if (reaptchaRef.current) {
      //   reaptchaRef.current.reset();
      // }

      // ReactGA.event({
      //   ...GA_BASE_EVENT,
      //   label: `Error [${errorMsg}]`,
      // });
    }

    function onSubmissionSuccess(): void {
      setIsSubmitting(false);
      setShowErrorMessage(false);
      setShowSuccessMessage(true);

      formRef.current?.reset();

      // if (reaptchaRef.current) {
      //   reaptchaRef.current.reset();
      // }

      // ReactGA.event({
      //   ...GA_BASE_EVENT,
      //   label: 'Success',
      // });
    }

    if (formRef.current) {
      setIsSubmitting(true);
      setShowErrorMessage(false);
      setShowSuccessMessage(false);

      const formData = new FormData(formRef.current);

      fetch(FORM_ACTION, {
        method: FORM_METHOD,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          [FIELD_NAMES.FORM_NAME]: FORM_NAME,
          [FIELD_NAMES.DOCUMENT_ID]: formData.get(FIELD_NAMES.DOCUMENT_ID) as string,
          [FIELD_NAMES.RATING]: formData.get(FIELD_NAMES.RATING) as string,
          // 'g-recaptcha-response': recaptchaValue,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            onSubmissionSuccess();
          } else {
            onSubmissionError(`${response.status} ${response.statusText} ${response.body}`);
          }
        })
        .catch((error) => onSubmissionError(error));
    }
  }, []);

  const handleRadioKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.keyCode === 13) {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleStarMouseEnter = useCallback(
    (starIndex): void => {
      if (!isDisabled) {
        setHighlightedStarIndex(starIndex);
      }
    },
    [setHighlightedStarIndex, isDisabled]
  );
  const handleStarMouseLeave = useCallback((): void => {
    if (!isDisabled) {
      setHighlightedStarIndex(-1);
    }
  }, [setHighlightedStarIndex, isDisabled]);

  return showSuccessMessage ? (
    <p className="type-heading-4 text-center">Thank you for rating this recipe!</p>
  ) : (
    <>
      <div className="flex items-center justify-center flex-col 2xsm:flex-row space-y-2 2xsm:space-x-6 2xsm:space-y-0">
        <p className="type-heading-4">Rate this recipe</p>
        <form
          ref={formRef}
          name={FORM_NAME}
          method={FORM_METHOD}
          action={FORM_ACTION}
          data-netlify="true"
          data-netlify-honeypot={FIELD_NAMES.BOT}
          // data-netlify-recaptcha="true"
          // data-testid="newsletter-form"
          onSubmit={handleSubmit}
          className="flex"
          onMouseLeave={(): void => handleStarMouseLeave()}
        >
          {/* Form name (for netlify) */}
          <input type="hidden" name={FIELD_NAMES.FORM_NAME} value={FORM_NAME} />

          {/* Honeypot field (anti-spam) */}
          <p hidden>
            <label>
              Don&apos;t fill this out if you&apos;re human:
              <input name={FIELD_NAMES.BOT} type="text" />
            </label>
          </p>

          <input type="hidden" name={FIELD_NAMES.DOCUMENT_ID} value={documentId || ''} />

          {/* Stars */}
          {[1, 2, 3, 4, 5].map((i) => {
            const starClassName = [
              'w-6 h-6 xl:w-8 xl:h-8',
              isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            ].join(' ');
            const StarElement = highlightedStarIndex >= i ? StarFullIcon : StarEmptyIcon;
            const highlightStars = (): void => handleStarMouseEnter(i);
            return (
              <label key={`rating-${i}`}>
                <input
                  name={FIELD_NAMES.RATING}
                  type="radio"
                  value={i}
                  disabled={isDisabled}
                  className="sr-only"
                  onFocus={highlightStars}
                  onBlur={handleStarMouseLeave}
                  onKeyDown={handleRadioKeyDown}
                />
                <StarElement
                  className={starClassName}
                  onMouseEnter={highlightStars}
                  onMouseLeave={handleStarMouseLeave}
                  onClick={handleSubmit}
                />
              </label>
            );
          })}
        </form>
      </div>
      {showErrorMessage && (
        <p className="type-footnote italic text-center mt-2">
          There was an error with your submission, please try again later.
        </p>
      )}
    </>
  );
};

const RecipeSectionTitle: React.FC<{ text: string }> = ({ text }) => (
  <h3 className="type-heading-2 text-center">{text}</h3>
);

type RecipeProps = {
  recipe: SanityRecipe;
  className?: string;
};
const Recipe: React.FC<RecipeProps> = ({ recipe, className }) => {
  const { asPath } = useRouter();
  const reviewsState = usePostReviewsState();

  return (
    <article
      data-testid="recipe-wrapper"
      id="recipe"
      className={[
        'bg-gray-lighter sm:rounded-lg overflow-hidden contain-l-p shadow-neu-lighter',
        'pt-10 sm:pt-12 md:pt-16 xl:pt-20 outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      tabIndex={-1}
    >
      <ArticleContentContainer className="pb-10 sm:pb-12 md:pb-16 xl:pb-20">
        <header className="flex flex-col-reverse items-center">
          {/* Title */}
          <h2 className="type-display-2 text-center mt-4 xl:mt-6">{recipe.title}</h2>

          {/* Rating — read only */}
          <p className="flex flex-col items-center text-olive-darker space-y-1">
            <span
              aria-label={
                reviewsState.data.reviewCount > 0
                  ? `Rating: ${reviewsState.data.ratingValue} out of 5`
                  : 'No reviews yet'
              }
              className="flex"
            >
              {[1, 2, 3, 4, 5].map((i) => {
                const starClassName = 'w-6 h-6 xl:w-8 xl:h-8';
                if (reviewsState.data.ratingValue >= i) {
                  return <StarFullIcon className={starClassName} />;
                } else if (reviewsState.data.ratingValue >= i - 0.5) {
                  return <StarHalfIcon className={starClassName} />;
                } else {
                  return <StarEmptyIcon className={starClassName} />;
                }
              })}
            </span>
            <span className="type-footnote italic">
              {reviewsState.data.reviewCount > 0
                ? `${reviewsState.data.reviewCount} reviews`
                : 'No reviews yet'}
            </span>
          </p>
        </header>

        {/* Sharing */}
        <aside
          className="mt-8 md:mt-10 xl:mt-12 flex flex-col items-center space-y-1"
          aria-label="Share recipe"
        >
          <p className="type-body">{socialShareLabel.replace(':platformName', '').trim()}</p>
          <div className="flex flex-wrap justify-center space-x-1 xsm:space-x-2">
            <AllSharingButtons
              link={joinUrl(
                process.env.NEXT_PUBLIC_CANONICAL_URL as string,
                `${asPath.split(/[?#]/)[0]}#recipe`
              )}
              message={recipe.title}
              iconPrefix="recipe-icon-social"
            />
          </div>
        </aside>

        {/* Description  */}
        <section className="mt-8 md:mt-10 xl:mt-12">
          <h3 className="sr-only">{recipeDescriptionSectionTitle}</h3>
          <p className="type-body text-center">{recipe.description}</p>
        </section>

        {/* Info panel (serving / prep + cooking times) */}
        <section className="mt-8 sm:mt-10 md:mt-12 xl:mt-16">
          <h3 className="sr-only">{recipeInformationSectionTitle}</h3>
          <dl className="flex flex-wrap mx-auto">
            {[
              {
                title: recipeServingsLabel,
                quantity: recipe.servings.quantity,
                unit: recipe.servings.unit,
              },
              {
                title: recipePrepTimeLabel,
                quantity: recipe.preparationTime,
                unit: recipeTimeUnitLabel,
              },
              {
                title: recipeCookTimeLabel,
                quantity: recipe.cookingTime,
                unit: recipeTimeUnitLabel,
              },
            ].map(({ title, quantity, unit }, index, array) => (
              <React.Fragment key={`instruction-box-${index}`}>
                <dt
                  className={[
                    'type-tag text-center text-gray-dark border-gray-medium',
                    'pt-4 px-2 2xsm:pt-6 xsm:pt-6 xsm:px-4 md:pt-4',
                    index === array.length - 1 && '2xsm:border-l',
                    index > 0 && '2xsm:border-t md:border-t-0 md:border-l',
                    index > 0
                      ? // Side by side on 2xsm screen
                        `w-full 2xsm:w-1/2 2xsm:order-${index + 2} md:w-1/3 md:order-${index + 1}`
                      : // Full bleed on 2xsm screen
                        `w-full 2xsm:order-${index + 1} md:w-1/3 md:order-${index + 1}`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {title}
                </dt>
                <dd
                  data-testid={`recipe-info-detail-${index}`}
                  className={[
                    'flex items-end justify-center md:flex-col md:items-center border-gray-medium',
                    'pt-2 px-2 pb-4 2xsm:pt-3 2xsm:pb-6 xsm:px-4 xsm:pb-6 md:pt-5 md:pb-3',
                    index === array.length - 1 && '2xsm:border-l',
                    index > 0 && 'md:border-l',
                    index > 0
                      ? // Side by side on 2xsm screen
                        `w-full 2xsm:w-1/2 2xsm:order-${
                          index + 2 + array.length
                        } md:w-1/3 md:order-${index + 1 + array.length}`
                      : // Full bleed on 2xsm screen
                        `w-full 2xsm:order-${index + 2} md:w-1/3 md:order-${
                          index + 1 + array.length
                        }`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="type-display-2 leading-none">{quantity}</span>
                  <span className="type-body lowercase ml-2 md:ml-0">{unit}</span>
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </section>

        {/* Ingredients  */}
        <section className="mt-8 2xsm:mt-10 md:mt-12 xl:mt-16 space-y-5 sm:space-y-6 md:space-y-8 xl:space-y-10">
          <RecipeSectionTitle text={recipeIngredientsSectionTitle} />
          <ul className="space-y-2 md:space-y-3 xl:space-y-4" data-testid="recipe-ingredients-list">
            {recipe.ingredients.map((ingredient) => (
              <li
                key={ingredient._key}
                aria-label={stringifyRecipeIngredient(ingredient)}
                className="flex items-top justify-center space-x-2 md:space-x-3 xl:space-x-4"
              >
                <span className="w-16 2xsm:w-20 xsm:w-24 font-medium text-right leading-snug">
                  {stringifyRecipeQuantity(ingredient) || '—'}
                </span>
                <span className="w-48 2xsm:w-56 xsm:w-64 text-left leading-snug">
                  {ingredient.name}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Method  */}
        <section className="mt-8 2xsm:mt-10 md:mt-12 xl:mt-16 space-y-5 sm:space-y-6 md:space-y-8 xl:space-y-10">
          <RecipeSectionTitle text={recipeMethodSectionTitle} />
          <ol
            className="space-y-4 sm:space-y-5 md:space-y-6 xl:space-y-8"
            data-testid="recipe-method-list"
          >
            {recipe.method.map(({ title, content, _key }, index) => (
              <li key={_key} id={`recipe-step-${index + 1}`}>
                <p className="type-heading-4 mb-2 md:mb-4 xl:mb-6">
                  <span aria-label={`Step ${index + 1}`}>{index + 1}. </span>
                  {title}
                </p>
                <SimplePortableText blocks={content} />
              </li>
            ))}
          </ol>
        </section>
      </ArticleContentContainer>

      {/* Interactive rating */}
      <aside className="bg-olive-darker text-white py-10 sm:py-12 md:py-16 xl:py-20">
        <ArticleContentContainer>
          <ReviewForm documentId={reviewsState.data.documentId} />
          <noscript>Please enable JavaScript to submit a review for this recipe.</noscript>
        </ArticleContentContainer>
      </aside>
    </article>
  );
};

export default Recipe;
