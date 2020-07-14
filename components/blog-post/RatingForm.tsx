import React, { useCallback, useRef, useState } from 'react';

import { ButtonTransparent } from '../button/Button';
import { StarEmptyIcon, StarFullIcon } from '../icons';

const FORM_NAME = 'review-rating';
const FORM_METHOD = 'POST';
const FORM_ACTION = '/thank-you';
const FIELD_NAMES = {
  BOT: 'bot-field',
  RATING: 'rating',
  DOCUMENT_ID: 'document-id',
  FORM_NAME: 'form-name',
};

const COPY = {
  BOT_LABEL: "Don't fill this out if you're human:",
  SUBMIT_LABEL: 'Rate this recipe',
  SUBMITTING_LABEL: 'Please wait...',
  ERROR_MESSAGE: 'There was an error with your submission, please try again later.',
};

function encode(data: { [key: string]: string }): string {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

const RatingForm: React.FC<{
  documentId: string | null;
  successCallback: (rating: number) => void;
}> = ({ documentId, successCallback }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [highlightedStarIndex, setHighlightedStarIndex] = useState(-1);
  const [selectedStarIndex, setSelectedStarIndex] = useState(-1);
  const solidStarIndex = highlightedStarIndex > -1 ? highlightedStarIndex : selectedStarIndex;

  const isDisabled = !documentId || isSubmitting;

  const starClassName = [
    'w-6 h-6 sm:w-8 sm:h-8',
    isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
  ].join(' ');

  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>): void => {
      e?.preventDefault();

      function onSubmissionError(error: string): void {
        setIsSubmitting(false);
        setShowErrorMessage(true);

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

      function onSubmissionSuccess(rating: number): void {
        setIsSubmitting(false);
        setShowErrorMessage(false);

        formRef.current?.reset();

        successCallback(rating);

        // if (reaptchaRef.current) {
        //   reaptchaRef.current.reset();
        // }

        // ReactGA.event({
        //   ...GA_BASE_EVENT,
        //   label: 'Success',
        // });
      }

      if (formRef.current && !isDisabled) {
        setIsSubmitting(true);
        setShowErrorMessage(false);

        const formData = new FormData(formRef.current);

        const ratingAsString = formData.get(FIELD_NAMES.RATING) as string;
        const parsedRating = parseInt(ratingAsString, 10);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
          onSubmissionError(`Invalid rating: ${formData.get(FIELD_NAMES.RATING)}`);
          return;
        }

        fetch(FORM_ACTION, {
          method: FORM_METHOD,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode({
            [FIELD_NAMES.FORM_NAME]: FORM_NAME,
            [FIELD_NAMES.DOCUMENT_ID]: formData.get(FIELD_NAMES.DOCUMENT_ID) as string,
            [FIELD_NAMES.RATING]: ratingAsString,
            // 'g-recaptcha-response': recaptchaValue,
          }),
        })
          .then((response) => {
            if (response.status === 200) {
              onSubmissionSuccess(parsedRating);
            } else {
              onSubmissionError(`${response.status} ${response.statusText} ${response.body}`);
            }
          })
          .catch((error) => onSubmissionError(error));
      }
    },
    [successCallback, isDisabled]
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

  const handleRatingInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (!isDisabled) {
        setSelectedStarIndex(parseInt(e.target.value, 10));
      }
    },
    [setSelectedStarIndex, isDisabled]
  );

  return (
    <>
      <form
        ref={formRef}
        name={FORM_NAME}
        method={FORM_METHOD}
        action={FORM_ACTION}
        data-netlify="true"
        data-netlify-honeypot={FIELD_NAMES.BOT}
        // data-netlify-recaptcha="true"
        data-testid="rating-form"
        onSubmit={handleSubmit}
        className="flex flex-col xsm:flex-row items-center justify-center"
        onMouseLeave={(): void => handleStarMouseLeave()}
      >
        {/* Form name (for netlify) */}
        <input type="hidden" name={FIELD_NAMES.FORM_NAME} value={FORM_NAME} />

        {/* Honeypot field (anti-spam) */}
        <p hidden>
          <label>
            {COPY.BOT_LABEL}
            <input name={FIELD_NAMES.BOT} type="text" />
          </label>
        </p>

        <input type="hidden" name={FIELD_NAMES.DOCUMENT_ID} value={documentId || ''} />

        {/* Stars */}
        <div className="flex py-1 px-2 rounded bg-gray-white bg-opacity-0 hover:bg-opacity-15 focus-within:bg-opacity-15">
          {[1, 2, 3, 4, 5].map((i) => {
            const StarElement = solidStarIndex >= i ? StarFullIcon : StarEmptyIcon;
            const highlightStars = (): void => handleStarMouseEnter(i);
            return (
              <label
                key={`rating-${i}`}
                onMouseEnter={highlightStars}
                onMouseLeave={handleStarMouseLeave}
              >
                <span className="sr-only">{i} out of 5</span>
                <input
                  className="sr-only pointer-events-none"
                  name={FIELD_NAMES.RATING}
                  type="radio"
                  value={i}
                  onChange={handleRatingInputChange}
                  disabled={isDisabled}
                  required
                />
                <StarElement className={starClassName} />
              </label>
            );
          })}
        </div>

        {/* Submit button */}
        <ButtonTransparent
          className="justify-center flex-shrink-0 flex-grow-0 mt-4 xsm:mt-0 xsm:ml-6 pt-px border-gray-white"
          type="submit"
          disabled={isSubmitting || isDisabled}
        >
          {isSubmitting ? COPY.SUBMITTING_LABEL : COPY.SUBMIT_LABEL}
        </ButtonTransparent>
      </form>
      {showErrorMessage && (
        <p className="type-footnote italic text-center mt-2">{COPY.ERROR_MESSAGE}</p>
      )}
    </>
  );
};

export default RatingForm;
