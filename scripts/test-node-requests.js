/* eslint-disable @typescript-eslint/no-var-requires */
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Read env variables.
require('dotenv').config();
const { NEWSLETTER_API_KEY, NEWSLETTER_SUBSCRIBERS_GROUP_ID, SLACK_WEBHOOK_URL } = process.env;

const test = async () => {
  // First, send to MailerLite
  const result = await fetch(
    `https://api.mailerlite.com/api/v2/groups/${NEWSLETTER_SUBSCRIBERS_GROUP_ID}/subscribers`,
    {
      method: 'GET',
      headers: {
        'X-MailerLite-ApiKey': NEWSLETTER_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (!Array.isArray(data) && 'error' in data) {
        throw new Error(`Mailerlite: ${data.error.message}`);
      }
      return data;
    })

    // Success: notify via slack and return HTTP 200
    .then(() =>
      fetch(SLACK_WEBHOOK_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ text: `It's me again` }),
      }).then(() => ({
        statusCode: 200,
        body: 'success',
      }))
    )

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
    });

  console.log(result);
};

test();
