/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */

const fetch = require('node-fetch');

// Read env variables.
require('dotenv').config();
const { NEWSLETTER_API_KEY, NEWSLETTER_SUBSCRIBERS_GROUP_ID, SLACK_WEBHOOK_URL } = process.env;

exports.handler = async (event) => {
  const { payload, site } = JSON.parse(event.body);

  console.log(`NEW SUBMISSION FOR ${payload.form_name}:`, payload.data);

  if (payload.form_name === 'newsletter') {
    const email = (payload.data.email || '').trim();
    const name = (payload.data.name || '').trim();

    if (email.length === 0 || name.length === 0) {
      const msg = 'Validation Error: `name` and `email` are mandatory fields';

      console.log(msg);

      return {
        statusCode: 422,
        body: msg,
      };
    }

    const slackCommonBlocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: [`*Name*: ${name}`, `*Email*: ${email}`].join('\n'),
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: [
              `Submitted to the *${payload.form_name}* (_${
                payload.data['form-instance']
              }_) form on the *${site.name}* site`,
              `on the *${new Date(payload.created_at).toLocaleString('en-GB', {
                dateStyle: 'long',
                timeStyle: 'long',
                timeZone: 'Europe/Rome',
              })}*`,
              `on the page ${payload.data.referrer}`,
            ].join('\n'),
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*<https://app.netlify.com/sites/${site.name}/forms/${payload.form_id}|See all ${site.name} submissions>*  |  *<https://app.mailerlite.com/subscribers/view|See MailerLite subscribers>*`,
        },
      },
      {
        type: 'divider',
      },
    ];

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

          const slackSuccessMessage = `New submission for the *${payload.form_name}* form:`;

          return fetch(SLACK_WEBHOOK_URL, {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              text: slackSuccessMessage,
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: slackSuccessMessage,
                  },
                },
                ...slackCommonBlocks,
              ],
            }),
          })
            .then(() => ({
              statusCode: 200,
              body: 'success',
            }))
            .catch((error) => {
              throw new Error(`Slack: ${error}`);
            });
        })

        // Error: send slack error notification, then return an error code
        .catch((error) => {
          const consoleMessage = `Oops! Something went wrong:\n${error}`;
          console.log(consoleMessage);

          const slackMessage = `Error during a submission for the *${payload.form_name}* form:`;

          return fetch(SLACK_WEBHOOK_URL, {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              text: slackMessage,
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `${slackMessage}\n_${error}_`,
                  },
                },
                ...slackCommonBlocks,
              ],
            }),
          })
            .then(() => ({
              statusCode: 422,
              body: consoleMessage,
            }))
            .catch((error) => {
              console.log(`Slack: ${error}`);
            });
        })
    );
  }
};
