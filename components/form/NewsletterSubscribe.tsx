import React, { useState } from 'react';

import { TextInputPink, EmailInputPink } from '../inputs/Input';
import { ButtonPink } from '../button/Button';
import { ArticleContentContainer } from '../layouts/Containers';

const FORM_NAME = 'newsletter';
const FORM_METHOD = 'POST';
const FORM_ACTION = '/thank-you';

const FIELD_NAMES = {
  BOT: 'bot-field',
  NAME: 'name',
  EMAIL: 'email',
  FORM_NAME: 'form-name',
};

// TODO: move text to Sanity:
// - section title
// - form placeholders / labels
// - submit button
// - error messages
const FEEDBACK_MESSAGES = {
  ERROR_PREVIEW_DISABLED: 'Forms are disabled on preview sites.',
  ERROR_GENERIC: 'There was an issue with your submission. Please retry later.',
  SUCCESS_THANK_YOU:
    "Thank you for subscribing! You should receive a confirmation email shortly — please contact us at offbeatappetite@gmail.com if you don't",
};
const INPUT_LABELS = {
  NAME: 'Name',
  EMAIL: 'Email',
  SUBMIT: 'Submit',
};
const SECTION_TITLE = 'Never miss an update';

const FORCE_FORM_DISABLED = process.env.IS_SUBMIT_FORM_ENABLED !== 'true';

function encode(data: { [key: string]: string }): string {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

type NewsletterSubscribeProps = {
  formInstance: string;
};
const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({ formInstance }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setfeedbackMessage] = useState({
    isError: FORCE_FORM_DISABLED ? true : false,
    message: FORCE_FORM_DISABLED ? FEEDBACK_MESSAGES.ERROR_PREVIEW_DISABLED : '',
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

    if (FORCE_FORM_DISABLED) {
      return;
    }

    const formEl = e.target as HTMLFormElement;

    function onSubmissionError(error: string | object): void {
      const nameField = formEl.querySelector(`input[name="${FIELD_NAMES.NAME}"]`);
      if (nameField) {
        (nameField as HTMLInputElement).focus();
      }

      setfeedbackMessage({
        isError: true,
        message: `${FEEDBACK_MESSAGES.ERROR_GENERIC} [${error}]`,
      });
      console.error(error);
    }

    function onSubmissionSuccess(): void {
      formEl.reset();
      setfeedbackMessage({ isError: false, message: FEEDBACK_MESSAGES.SUCCESS_THANK_YOU });
    }

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
      .catch((error) => onSubmissionError(error))
      .finally(() => setIsSubmitting(false));
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
        <h2 className="type-display-2 text-pink-darker text-center">{SECTION_TITLE}</h2>

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
              placeholder={INPUT_LABELS.NAME}
              aria-label={INPUT_LABELS.NAME}
              onInvalid={onInputInvalid}
              onInput={onInputInput}
            />

            {/* Email field */}
            <EmailInputPink
              className="sm:flex-1"
              required
              name={FIELD_NAMES.EMAIL}
              onChange={handleChange}
              placeholder={INPUT_LABELS.EMAIL}
              aria-label={INPUT_LABELS.EMAIL}
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
            disabled={isSubmitting || FORCE_FORM_DISABLED}
          >
            {isSubmitting ? 'Sending...' : INPUT_LABELS.SUBMIT}
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
