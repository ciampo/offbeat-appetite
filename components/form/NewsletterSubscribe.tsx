import * as React from 'react';
import { useLocalStorage } from 'react-use';
import ReactGA from 'react-ga4';

import dynamic from 'next/dynamic';

import { TextInputPink, EmailInputPink } from '../inputs/Input';
import { ButtonPink } from '../button/Button';
import { ArticleContentContainer } from '../layouts/Containers';
import { InvisibleRecaptchaRef, InvisibleRecaptchaProps } from './InvisibleRecaptcha';

import { HIDE_TOAST_KEY } from '../subscribe-modal/local-storage';

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

const InvisibleRecaptcha = dynamic(() => import('./InvisibleRecaptcha'), { ssr: false });
const ForwardedInvisibleRecaptcha = React.forwardRef<
  InvisibleRecaptchaRef,
  InvisibleRecaptchaProps
>((props, ref) => (
  <InvisibleRecaptcha
    forwardedRef={ref as React.MutableRefObject<InvisibleRecaptchaRef | null>}
    {...props}
  />
));
ForwardedInvisibleRecaptcha.displayName = 'forwardRef(InvisibleRecaptcha)';

const FIELD_NAMES = {
  BOT: 'bot-field',
  NAME: 'name',
  EMAIL: 'email',
  FORM_NAME: 'form-name',
};

const GA_BASE_EVENT = {
  category: 'User',
  action: 'Interacted with Subscribe form',
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

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMessage, setfeedbackMessage] = React.useState({
    isError: forceDisabled ? true : false,
    message: forceDisabled ? subscribeFormMessageDisabled : '',
  });
  const reaptchaRef = React.useRef<InvisibleRecaptchaRef>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const setHideToastPref = useLocalStorage(HIDE_TOAST_KEY, false)[1];

  const onInputChange = React.useCallback((e: React.FormEvent<HTMLInputElement>): void => {
    (e.target as HTMLInputElement).setCustomValidity('');
  }, []);

  // Show error message from Recatpcha
  const onRecapchaError = React.useCallback((errorMessage: string): void => {
    setIsSubmitting(false);

    reaptchaRef.current?.reset();

    setfeedbackMessage({
      isError: true,
      message: `${subscribeFormMessageError} [${JSON.stringify(errorMessage)}]`,
    });
    console.warn(JSON.stringify(errorMessage));
  }, []);

  // Send form data on recaptcha successfull verification
  const onRecaptchaSuccess = React.useCallback(
    (recaptchaValue: string): void => {
      function onSubmissionError(error: string): void {
        setIsSubmitting(false);

        reaptchaRef.current?.reset();

        const errorMsg = JSON.stringify(error);

        setfeedbackMessage({
          isError: true,
          message: `${subscribeFormMessageError} [${errorMsg}]`,
        });
        console.warn(errorMsg);

        ReactGA.event({
          ...GA_BASE_EVENT,
          label: `Error [${errorMsg}]`,
        });
      }

      function onSubmissionSuccess(): void {
        setIsSubmitting(false);

        formRef.current?.reset();
        reaptchaRef.current?.reset();

        setfeedbackMessage({ isError: false, message: subscribeFormMessageSuccess });

        // Avoid the subscribe toast from showing again on this browser
        setHideToastPref(true);

        ReactGA.event({
          ...GA_BASE_EVENT,
          label: 'Success',
        });
      }

      if (formRef.current) {
        setIsSubmitting(true);
        setfeedbackMessage({ isError: false, message: '' });

        const formData = new FormData(formRef.current);

        fetch(FORM_ACTION, {
          method: FORM_METHOD,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode({
            [FIELD_NAMES.FORM_NAME]: FORM_NAME,
            [FIELD_NAMES.NAME]: formData.get(FIELD_NAMES.NAME) as string,
            [FIELD_NAMES.EMAIL]: formData.get(FIELD_NAMES.EMAIL) as string,
            'g-recaptcha-response': recaptchaValue,
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
    },
    [setHideToastPref]
  );

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();

      if (forceDisabled) {
        return;
      }

      if (!reaptchaRef.current) {
        const errorMsg =
          'Unexpected Google Recaptcha error. Please try again with a different browser, or subscribe by emailing us at offbeatappetite@gmail.com';

        setfeedbackMessage({
          isError: true,
          message: `${subscribeFormMessageError} [${errorMsg}]`,
        });
        console.warn(errorMsg);

        ReactGA.event({
          ...GA_BASE_EVENT,
          label: `Error [${errorMsg}]`,
        });

        return;
      }

      if (e.currentTarget.checkValidity()) {
        ReactGA.event({
          ...GA_BASE_EVENT,
          label: 'Attempt submission',
        });
        reaptchaRef.current.execute();
      }
    },
    [forceDisabled, reaptchaRef]
  );

  const onInputInvalid = React.useCallback((e: React.FormEvent<HTMLInputElement>): void => {
    const inputEl = e.target as HTMLInputElement;
    inputEl.setCustomValidity(`Enter a valid ${inputEl.placeholder.toLowerCase()}`);
  }, []);

  return (
    <section className="bg-pink-light">
      <div
        className="py-16 xsm:py-20 md:py-24 xl:py-32 shadow-inner-pink-section"
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
                Don&apos;t fill this out if you&apos;re human:
                <input name={FIELD_NAMES.BOT} type="text" />
              </label>
            </p>

            <ForwardedInvisibleRecaptcha
              siteKey={process.env.NEXT_PUBLIC_SITE_RECAPTCHA_KEY as string}
              onVerify={onRecaptchaSuccess}
              onError={onRecapchaError}
              ref={reaptchaRef}
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
                onInvalid={onInputInvalid}
                onInput={onInputChange}
              />

              {/* Email field */}
              <EmailInputPink
                className="sm:flex-1"
                required
                name={FIELD_NAMES.EMAIL}
                placeholder={subscribeFormEmailInputLabel}
                aria-label={subscribeFormEmailInputLabel}
                onInvalid={onInputInvalid}
                onInput={onInputChange}
              />
            </div>

            {/* Submit button */}
            <ButtonPink
              className="justify-center flex-shrink-0 flex-grow-0 mt-4 md:mt-0 md:ml-4 md:w-32 xl:w-40"
              type="submit"
              disabled={isSubmitting || forceDisabled}
              shadow={true}
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
      </div>
      <div className="type-footnote text-center text-pink-medium py-2">
        <ArticleContentContainer>
          Protected by reCAPTCHA. Google&#39;s{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://policies.google.com/privacy">
            Privacy&nbsp;Policy
          </a>{' '}
          and{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://policies.google.com/terms">
            Terms&nbsp;of&nbsp;Service
          </a>
          &nbsp;apply.
        </ArticleContentContainer>
      </div>
    </section>
  );
};

export default NewsletterSubscribe;
