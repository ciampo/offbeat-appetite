import React from 'react';

const HONEYPOT_FIELD_NAME = 'bot-bait';
const FORM_NAME = 'newsletter';

const NewsletterSubcribe = (): JSX.Element => {
  return (
    <form name={FORM_NAME} method="POST" data-netlify="true" netlify-honeypot={HONEYPOT_FIELD_NAME}>
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <div hidden aria-hidden="true">
        <label>
          Don’t fill this out if you&apos;re human:
          <input name={HONEYPOT_FIELD_NAME} />
        </label>
      </div>
      <input id="name" type="text" name="name" placeholder="Name" required />
      <input id="email" type="email" name="email" placeholder="Email Address" required />
      <button type="submit">Subscribe</button>
    </form>
  );
};

export default NewsletterSubcribe;
