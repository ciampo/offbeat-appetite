import React, { useState, useRef, useCallback } from 'react';

import dynamic from 'next/dynamic';

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

type ReaptchaRef = {
  renderExplicitly: () => Promise<void>;
  reset: () => Promise<void>;
  execute: () => Promise<void>;
  getResponse: () => Promise<string>;
};

const Reaptcha = dynamic(() => import('reaptcha'), { ssr: false });

const FIELD_NAMES = {
  BOT: 'bot-field',
  NAME: 'name',
  EMAIL: 'email',
  FORM_NAME: 'form-name',
};

function encode(data: { [key: string]: string }): string {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

type NewsletterSubscribeProps = {
  formInstance: string;
};
const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({ formInstance }) => {
  const forceDisabled = process.env.NEXT_PUBLIC_IS_SUBMIT_FORM_ENABLED !== 'true';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setfeedbackMessage] = useState({
    isError: forceDisabled ? true : false,
    message: forceDisabled ? subscribeFormMessageDisabled : '',
  });
  const [formData, setFormData] = useState({
    [FIELD_NAMES.NAME]: '',
    [FIELD_NAMES.EMAIL]: '',
  });
  const reaptchaRef = useRef<ReaptchaRef>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    },
    [setFormData, formData]
  );

  // Send form data on recaptcha change
  const onRecapchaSuccessfullResponse = useCallback(
    (recaptchaValue: string): void => {
      function onSubmissionError(error: string | object): void {
        setIsSubmitting(false);

        if (reaptchaRef.current) {
          reaptchaRef.current.reset();
        }

        setfeedbackMessage({
          isError: true,
          message: `${subscribeFormMessageError} [${JSON.stringify(error)}]`,
        });
        console.warn(JSON.stringify(error));
      }

      function onSubmissionSuccess(): void {
        setIsSubmitting(false);

        if (formRef.current) {
          formRef.current.reset();
        }
        if (reaptchaRef.current) {
          reaptchaRef.current.reset();
        }

        setfeedbackMessage({ isError: false, message: subscribeFormMessageSuccess });
      }

      if (formRef.current) {
        setIsSubmitting(true);
        setfeedbackMessage({ isError: false, message: '' });

        fetch(FORM_ACTION, {
          method: FORM_METHOD,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode({
            [FIELD_NAMES.FORM_NAME]: FORM_NAME,
            'g-recaptcha-response': recaptchaValue,
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
    },
    [formData]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();

      if (forceDisabled) {
        return;
      }

      if (e.currentTarget.checkValidity() && reaptchaRef.current) {
        reaptchaRef.current.execute();
      }
    },
    [forceDisabled]
  );

  const onInputInvalid = useCallback((e: React.FormEvent<HTMLInputElement>): void => {
    const inputEl = e.target as HTMLInputElement;
    inputEl.setCustomValidity(`Enter a valid ${inputEl.placeholder.toLowerCase()}`);
  }, []);

  const onInputInput = useCallback((e: React.FormEvent<HTMLInputElement>): void => {
    (e.target as HTMLInputElement).setCustomValidity('');
  }, []);

  return (
    <section
      className="relative z-10 pt-12 pb-32 sm:pt-20 sm:pb-20 md:pt-24 md:pb-24 xl:pt-32 xl:pb-32 bg-pink-light md:shadow-lg translate-z-0 overflow-hidden"
      id="subscribe"
      data-testid="subscribe-form-section-wrapper"
    >
      <ArticleContentContainer>
        <h2 className="type-display-2 text-pink-darker text-center">{subscribeFormTitle}</h2>

        <form
          ref={formRef}
          id={`subscribe-form-${formInstance}`}
          className={[
            'relative',
            'self-stretch flex flex-col items-stretch md:flex-row md:flex-wrap',
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

          {/* Recaptcha */}
          <Reaptcha
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            ref={reaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_SITE_RECAPTCHA_KEY as string}
            onVerify={onRecapchaSuccessfullResponse}
            size="invisible"
          />

          <noscript className="w-full mb-6">
            <iframe
              src="https://www.google.com/recaptcha/api/fallback?k=6LdAvUIUAAAAAHjrjmjtNTcXyKm0WKwefLp-dQv9"
              frameBorder="0"
              scrolling="no"
              className="w-full mx-auto border-none"
              style={{
                maxWidth: '302px',
                height: '422px',
              }}
              title="recaptcha"
            ></iframe>
            <div
              className="w-full mx-auto border border-pink-dark rounded h-16 my-0 bg-pink-light flex items-center justify-center"
              style={{
                maxWidth: '300px',
              }}
            >
              <textarea
                id="g-recaptcha-response"
                name="g-recaptcha-response"
                className="g-recaptcha-response w-64 h-10 border border-pink-dark rounded p-0 resize-none"
                placeholder="reCAPTCHA code"
                aria-label="reCaptcha response"
              ></textarea>
            </div>
          </noscript>

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
              placeholder={subscribeFormNameInputLabel}
              aria-label={subscribeFormNameInputLabel}
              onChange={onInputChange}
              onInvalid={onInputInvalid}
              onInput={onInputInput}
            />

            {/* Email field */}
            <EmailInputPink
              className="sm:flex-1"
              required
              name={FIELD_NAMES.EMAIL}
              placeholder={subscribeFormEmailInputLabel}
              aria-label={subscribeFormEmailInputLabel}
              onChange={onInputChange}
              onInvalid={onInputInvalid}
              onInput={onInputInput}
            />
          </div>

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
