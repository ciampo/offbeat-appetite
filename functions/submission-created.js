/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */

const fetch = require('node-fetch');

// Read env variables.
require('dotenv').config();
const { NEWSLETTER_API_KEY, NEWSLETTER_SUBSCRIBERS_GROUP_ID } = process.env;

exports.handler = (event) => {
  const { email, name, form_name } = JSON.parse(event.body).payload;
  console.log(`SUBMISSION: ${email} // ${name} // ${form_name}`);

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
      console.log('Response from mailer lite');
      console.log(JSON.stringify(data, null, 2));
    })
    .catch((error) => ({ statusCode: 422, body: String(error) }));
};
