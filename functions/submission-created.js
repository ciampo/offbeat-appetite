/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */

const fetch = require('node-fetch');

// Read env variables.
require('dotenv').config();
const { NEWSLETTER_API_KEY, NEWSLETTER_SUBSCRIBERS_GROUP_ID } = process.env;

exports.handler = (event) => {
  const { payload } = JSON.parse(event.body);
  console.log('FORM:', payload.form_name);

  if (payload.form_name === 'newsletter') {
    const { email, name } = payload;
    console.log(`NEWSLETTER SUBMISSION: [${name}] ${email}`);

    return fetch(
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
      .then((data) => {
        console.log('Response from mailer lite');
        console.log(JSON.stringify(data, null, 2));
      })
      .catch((error) => ({ statusCode: 422, body: String(error) }));
  }
};
