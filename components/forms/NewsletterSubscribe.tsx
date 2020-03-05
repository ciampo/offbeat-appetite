import React, { useState } from 'react';

const FORM_NAME = 'newsletter';
const FORM_METHOD = 'POST';
const FORM_ACTION = '/thanks';

const FIELD_NAMES = {
  BOT: 'full-name',
  NAME: 'name',
  EMAIL: 'email',
  INSTANCE: 'form-instance',
};

// TODO: get from Contentful
const FEEDBACK_MESSAGES = {
  ERROR_PREVIEW_DISABLED: 'Forms are disabled on preview sites.',
  ERROR_GENERIC: 'There was an issue with your submission.',
  SUCCESS_THANK_YOU: 'Thank you for subscribing! You should receive an email from us shortly.',
};

export enum NewsletterSubcribeVariant {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

type NewsletterSubcribeClassNames = {
  form: string;
  fields: string;
  name: string;
  email: string;
  submit: string;
};

type NewletterSubscriveVariantClassNames = {
  [x in NewsletterSubcribeVariant]: NewsletterSubcribeClassNames;
};

const VARIANT_CLASSNAMES: NewletterSubscriveVariantClassNames = {
  [NewsletterSubcribeVariant.horizontal]: {
    form: 'border-purple-700',
    fields: 'flex flex-row items-center justify-center',
    name: '',
    email: 'ml-2',
    submit: 'ml-4 bg-purple-200',
  },
  [NewsletterSubcribeVariant.vertical]: {
    form: 'border-orange-700',
    fields: 'flex flex-col items-center justify-center',
    name: '',
    email: 'mt-2',
    submit: 'mt-4 bg-orange-300',
  },
};

const isSubmitFormEnabled = process.env.IS_SUBMIT_FORM_ENABLED !== 'true';
console.log(process.env.IS_SUBMIT_FORM_ENABLED);

function encode(data: { [key: string]: string }): string {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

type NewsletterSubcribeProps = {
  variant: NewsletterSubcribeVariant;
  formInstance: string;
};

export default function NewsletterSubcribe({
  variant,
  formInstance,
}: NewsletterSubcribeProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setfeedbackMessage] = useState({
    isError: isSubmitFormEnabled ? true : false,
    message: isSubmitFormEnabled ? FEEDBACK_MESSAGES.ERROR_PREVIEW_DISABLED : '',
  });
  const [formData, setFormData] = useState({
    [FIELD_NAMES.BOT]: '',
    [FIELD_NAMES.NAME]: '',
    [FIELD_NAMES.EMAIL]: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (isSubmitFormEnabled) {
      return;
    }

    const formEl = e.target as HTMLFormElement;

    function onSubmissionError(error: string | object): void {
      const nameField = formEl.querySelector(`input[name="${FIELD_NAMES.NAME}"]`);
      if (nameField) {
        (nameField as HTMLInputElement).focus();
      }

      setfeedbackMessage({ isError: true, message: FEEDBACK_MESSAGES.ERROR_GENERIC });
      console.error(error);
    }

    function onSubmissionSuccess(): void {
      formEl.reset();
      setfeedbackMessage({ isError: false, message: FEEDBACK_MESSAGES.SUCCESS_THANK_YOU });
    }

    setIsSubmitting(true);
    setfeedbackMessage({ isError: false, message: '' });

    setTimeout(
      () =>
        fetch('/', {
          method: FORM_METHOD,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode({
            'form-name': FORM_NAME,
            [FIELD_NAMES.INSTANCE]: formInstance,
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
          .finally(() => setIsSubmitting(false)),
      1000
    );
  }

  function onInputInvalid(e: React.FormEvent<HTMLInputElement>): void {
    const inputEl = e.target as HTMLInputElement;
    inputEl.setCustomValidity(`Enter a valid ${inputEl.placeholder.toLowerCase()}`);
  }

  function onInputInput(e: React.FormEvent<HTMLInputElement>): void {
    (e.target as HTMLInputElement).setCustomValidity('');
  }

  return (
    <form
      className={`relative m-4 px-4 py-16 bg-white border ${VARIANT_CLASSNAMES[variant].form}`}
      name={FORM_NAME}
      method={FORM_METHOD}
      action={FORM_ACTION}
      data-netlify="true"
      data-netlify-honeypot={FIELD_NAMES.BOT}
      onSubmit={handleSubmit}
      // noValidate={process.browser}
    >
      <div className={`${VARIANT_CLASSNAMES[variant].fields}`}>
        {/* Form name (for netlify) */}
        <input type="hidden" name="form-name" value={FORM_NAME} />

        {/* Form instance (useful for analytics) */}
        <input type="hidden" name={FIELD_NAMES.INSTANCE} value={formInstance} />

        {/* Honeypot field (anti-spam) */}
        <div hidden aria-hidden="true">
          <label>
            Don’t fill this out if you&apos;re human:
            <input name={FIELD_NAMES.BOT} onChange={handleChange} />
          </label>
        </div>

        {/* Name field */}
        <input
          className={`p-2 bg-gray-200 ${VARIANT_CLASSNAMES[variant].name}`}
          type="text"
          required
          name={FIELD_NAMES.NAME}
          onChange={handleChange}
          placeholder="Name"
          onInvalid={onInputInvalid}
          onInput={onInputInput}
        />

        {/* Email field */}
        <input
          className={`p-2 bg-gray-200 ${VARIANT_CLASSNAMES[variant].email}`}
          type="email"
          pattern="^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$"
          required
          name={FIELD_NAMES.EMAIL}
          onChange={handleChange}
          placeholder="Email"
          onInvalid={onInputInvalid}
          onInput={onInputInput}
        />

        {/* Submit button */}
        <button
          className={`ao-form__submit p-2 flex-shrink-0 ${VARIANT_CLASSNAMES[variant].submit}`}
          type="submit"
          disabled={isSubmitting || isSubmitFormEnabled}
        >
          Join the list!
        </button>
      </div>

      <div
        role="alert"
        aria-live="assertive"
        className={`absolute bottom-0 left-0 w-full h-16 px-4 flex items-center justify-center leading-tight text-sm text-center ${
          feedbackMessage.isError ? 'text-red-700' : 'text-green-800'
        }`}
      >
        {feedbackMessage.message}
      </div>
    </form>
  );
}
