/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */

const fetch = require('node-fetch');

// Read env variables.
require('dotenv').config();
const { NEWSLETTER_API_KEY, NEWSLETTER_SUBSCRIBERS_GROUP_ID, SLACK_WEBHOOK_URL } = process.env;

exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body);
  console.log('FORM NAME:', payload.form_name);

  if (payload.form_name === 'newsletter') {
    const email = (payload.email || '').trim();
    const name = (payload.name || '').trim();

    if (email.length === 0 || name.length === 0) {
      const msg = 'Name and Email are mandatory fields';

      console.log(`Error: ${msg}`);

      return {
        statusCode: 422,
        body: msg,
      };
    }

    console.log(`NEWSLETTER SUBMISSION: [${name}] ${email}`);

    return (
      // First, send user information to MailerLite
      fetch(
        `https://api.mailerlite.com/api/v2/groups/${NEWSLETTER_SUBSCRIBERS_GROUP_ID}/subscribers`,
        {
          method: 'POST',
          headers: {
            'X-MailerLite-ApiKey': NEWSLETTER_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, name }),
        }
      )
        .then((response) => response.json())
        // Catch any errors returned by MailerLite
        .then((data) => {
          if (!Array.isArray(data) && 'error' in data) {
            throw new Error(`Mailerlite: ${data.error.message}`);
          }
          return data;
        })

        // Success: notify via slack and return HTTP 200
        .then(() => {
          console.log('Success!');

          return fetch(SLACK_WEBHOOK_URL, {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              text: `New submission for the newsletter form: ${name}, ${email}`,
            }),
          }).then(() => ({
            statusCode: 200,
            body: 'success',
          }));
        })

        // Error:
        .catch((error) => {
          const msg = `Oops! Something went wrong:\n${error}`;

          return fetch(SLACK_WEBHOOK_URL, {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ text: msg }),
          }).then(() => ({
            statusCode: 422,
            body: msg,
          }));
        })
    );
  }
};
