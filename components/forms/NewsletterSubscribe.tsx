import React from 'react';

const FORM_NAME = 'newsletter';

const NewsletterSubcribe = (): JSX.Element => {
  return (
    <form
      name={FORM_NAME}
      method="POST"
      action="/"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <div hidden aria-hidden="true">
        <label>
          Don’t fill this out if you&apos;re human:
          <input name="bot-field" />
        </label>
      </div>
      <input id="name" type="text" name="name" placeholder="Name" required />
      <input id="email" type="email" name="email" placeholder="Email Address" required />
      <button type="submit">Subscribe</button>
    </form>
  );
};

export default NewsletterSubcribe;
