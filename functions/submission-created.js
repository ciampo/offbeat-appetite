/* eslint-disable @typescript-eslint/no-var-requires */

const fetch = require('node-fetch');

// Read env variables.
require('dotenv').config();
const { NEWSLETTER_API_KEY, NEWSLETTER_SUBSCRIBERS_GROUP_ID } = process.env;

exports.handler = (event, context) => {
  console.log(event);
  console.log(context);
  console.log(NEWSLETTER_API_KEY);

  const email = JSON.parse(event.body).payload.email;
  console.log(`Recieved a submission: ${email}`);

  return fetch(
    `https://api.mailerlite.com/api/v2/groups/${NEWSLETTER_SUBSCRIBERS_GROUP_ID}/subscribers`,
    {
      method: 'GET',
      headers: {
        'X-MailerLite-ApiKey': NEWSLETTER_API_KEY,
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ email }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(`Response from mailer lite:\n ${data}`);
    })
    .catch((error) => ({ statusCode: 422, body: String(error) }));
};
