import React, { useState } from 'react';

const FORM_NAME = 'newsletter';
const FORM_METHOD = 'POST';
const FORM_ACTION = '/thanks';

const FIELD_NAMES = {
  BOT: 'bot-field',
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
  const [errorMessages, setErrorMessages] = useState({
    [FIELD_NAMES.NAME]: '',
    [FIELD_NAMES.EMAIL]: '',
    form: isPreview ? ERROR_MESSAGES.PREVIEW_DISABLED : '',
  });
  const [formData, setFormData] = useState({
    [FIELD_NAMES.BOT]: '',
    [FIELD_NAMES.NAME]: '',
    [FIELD_NAMES.EMAIL]: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // TODO: Validate field
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (isPreview) {
      return;
    }

    // TODO: Validate all fields
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
          setErrorMessages({ ...errorMessages, form: ERROR_MESSAGES.GENERIC });
          console.error(response);
        }
      })
      .catch((error) => console.error(error));
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
        required
        name={FIELD_NAMES.EMAIL}
        onChange={handleChange}
        placeholder="Email Address"
      />

      {/* Submit button */}
      <button type="submit" disabled={isPreview}>
        Join the list!
      </button>

      {errorMessages.form && <div>{errorMessages.form}</div>}
    </form>
  );
}
