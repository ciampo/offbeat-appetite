import React, { useState } from 'react';

import { TextInputPink, EmailInputPink } from '../inputs/Input';
import { ButtonPink } from '../button/Button';
import { ArticleContentContainer } from '../layouts/Containers';

import {
  subscribeFormTitle,
  subscribeFormNameInputLabel,
  subscribeFormEmailInputLabel,
  subscribeFormSubmitButtonLabel,
  subscribeFormSubmitButtonLabelSubmitting,
  subscribeFormMessageDisabled,
  subscribeFormMessageSuccess,
  subscribeFormMessageError,
} from '../../data/siteMiscContent.json';

const FORM_NAME = 'newsletter';
const FORM_METHOD = 'POST';
const FORM_ACTION = '/thank-you';

const FIELD_NAMES = {
  BOT: 'bot-field',
  NAME: 'name',
  EMAIL: 'email',
  FORM_NAME: 'form-name',
};

function encode(data: { [key: string]: string }): string {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

type NewsletterSubscribeProps = {
  formInstance: string;
};
const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({ formInstance }) => {
  const forceDisabled = process.env.IS_SUBMIT_FORM_ENABLED !== 'true';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setfeedbackMessage] = useState({
    isError: forceDisabled ? true : false,
    message: forceDisabled ? subscribeFormMessageDisabled : '',
  });
  const [formData, setFormData] = useState({
    [FIELD_NAMES.NAME]: '',
    [FIELD_NAMES.EMAIL]: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (forceDisabled) {
      return;
    }

    const formEl = e.target as HTMLFormElement;

    function onSubmissionError(error: string | object): void {
      setIsSubmitting(false);

      setfeedbackMessage({
        isError: true,
        message: `${subscribeFormMessageError} [${JSON.stringify(error)}]`,
      });
      console.warn(JSON.stringify(error));
    }

    function onSubmissionSuccess(): void {
      setIsSubmitting(false);

      formEl.reset();
      setfeedbackMessage({ isError: false, message: subscribeFormMessageSuccess });
    }

    if (formEl.checkValidity()) {
      setIsSubmitting(true);
      setfeedbackMessage({ isError: false, message: '' });

      fetch('/', {
        method: FORM_METHOD,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          [FIELD_NAMES.FORM_NAME]: FORM_NAME,
          ...formData,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            onSubmissionSuccess();
          } else {
            onSubmissionError(response);
          }
        })
        .catch((error) => onSubmissionError(error));
    }
  }

  function onInputInvalid(e: React.FormEvent<HTMLInputElement>): void {
    const inputEl = e.target as HTMLInputElement;
    inputEl.setCustomValidity(`Enter a valid ${inputEl.placeholder.toLowerCase()}`);
  }

  function onInputInput(e: React.FormEvent<HTMLInputElement>): void {
    (e.target as HTMLInputElement).setCustomValidity('');
  }

  return (
    <section className="relative z-10 py-12 sm:py-20 md:py-24 xl:py-32 bg-pink-light md:shadow-lg">
      <ArticleContentContainer>
        <h2 className="type-display-2 text-pink-darker text-center">{subscribeFormTitle}</h2>

        <form
          id={`subscribe-form-${formInstance}`}
          className={[
            'relative',
            'self-stretch flex flex-col items-stretch md:flex-row',
            'mt-6 sm:mt-8 md:mt-10 xl:mt-12 pb-3 sm:pb-4 xl:pb-8',
            'mx-auto max-w-sm sm:max-w-none',
          ]
            .filter(Boolean)
            .join(' ')}
          name={FORM_NAME}
          method={FORM_METHOD}
          action={FORM_ACTION}
          data-netlify="true"
          data-netlify-honeypot={FIELD_NAMES.BOT}
          data-netlify-recaptcha="true"
          data-testid="newsletter-form"
          onSubmit={handleSubmit}
        >
          {/* Form name (for netlify) */}
          <input type="hidden" name={FIELD_NAMES.FORM_NAME} value={FORM_NAME} />

          {/* Honeypot field (anti-spam) */}
          <p hidden>
            <label>
              Don’t fill this out if you&apos;re human:
              <input name={FIELD_NAMES.BOT} type="text" />
            </label>
          </p>

          <div
            className={[
              'flex flex-col items-stretch sm:flex-row md:flex-grow',
              'space-y-4 sm:space-y-0 sm:space-x-4',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Name field */}
            <TextInputPink
              className="sm:flex-1"
              required
              name={FIELD_NAMES.NAME}
              onChange={handleChange}
              placeholder={subscribeFormNameInputLabel}
              aria-label={subscribeFormNameInputLabel}
              onInvalid={onInputInvalid}
              onInput={onInputInput}
            />

            {/* Email field */}
            <EmailInputPink
              className="sm:flex-1"
              required
              name={FIELD_NAMES.EMAIL}
              onChange={handleChange}
              placeholder={subscribeFormEmailInputLabel}
              aria-label={subscribeFormEmailInputLabel}
              onInvalid={onInputInvalid}
              onInput={onInputInput}
            />
          </div>

          {/* Recaptcha */}
          <div data-netlify-recaptcha="true"></div>

          {/* Submit button */}
          <ButtonPink
            className="justify-center flex-shrink-0 flex-grow-0 mt-4 md:mt-0 md:ml-4 md:w-32 xl:w-40"
            type="submit"
            disabled={isSubmitting || forceDisabled}
          >
            {isSubmitting
              ? subscribeFormSubmitButtonLabelSubmitting
              : subscribeFormSubmitButtonLabel}
          </ButtonPink>

          <div
            role="alert"
            aria-live="assertive"
            className={[
              'absolute top-full inset-0',
              'text-center type-footnote',
              feedbackMessage.isError ? 'text-red-700' : 'text-olive-darker',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {feedbackMessage.message}
          </div>
        </form>
      </ArticleContentContainer>
    </section>
  );
};

export default NewsletterSubscribe;
