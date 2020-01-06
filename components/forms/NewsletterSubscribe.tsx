import React, { useState } from 'react';

const FORM_NAME = 'newsletter';
const FORM_METHOD = 'POST';
const FORM_ACTION = '/thanks';

const FIELD_NAMES = {
  BOT: 'full-name',
  NAME: 'name',
  EMAIL: 'email',
};

const ERROR_MESSAGES = {
  PREVIEW_DISABLED: 'Form submissions are disabled on preview sites.',
  GENERIC: 'There was an issue with your submission.',
};

const isPreview = process.env.IS_PREVIEW_SITE === 'true';

function encode(data: { [key: string]: string }): string {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

export default function NewsletterSubcribe(): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    isPreview ? ERROR_MESSAGES.PREVIEW_DISABLED : ''
  );
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

    if (isPreview) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    console.log(formData);

    fetch('/', {
      method: FORM_METHOD,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': FORM_NAME,
        ...formData,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.body);
        } else {
          setErrorMessage(ERROR_MESSAGES.GENERIC);
          console.error(response);
        }
      })
      .catch((error) => {
        setErrorMessage(ERROR_MESSAGES.GENERIC);
        console.error(error);
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <form
      className="m-4 p-4 border border-gray-700"
      name={FORM_NAME}
      method={FORM_METHOD}
      action={FORM_ACTION}
      data-netlify="true"
      data-netlify-honeypot={FIELD_NAMES.BOT}
      onSubmit={handleSubmit}
      // noValidate={process.browser}
    >
      {/* Form name (for netlify) */}
      <input type="hidden" name="form-name" value={FORM_NAME} />

      {/* Honeypot field (anti-spam) */}
      <div hidden aria-hidden="true">
        <label>
          Don’t fill this out if you&apos;re human:
          <input name={FIELD_NAMES.BOT} onChange={handleChange} />
        </label>
      </div>

      {/* Name field */}
      <input
        type="text"
        required
        name={FIELD_NAMES.NAME}
        onChange={handleChange}
        placeholder="Name"
      />

      {/* Email field */}
      <input
        type="email"
        pattern="^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$"
        required
        name={FIELD_NAMES.EMAIL}
        onChange={handleChange}
        placeholder="Email Address"
      />

      {/* Submit button */}
      <button type="submit" disabled={isSubmitting || isPreview}>
        Join the list!
      </button>

      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}
