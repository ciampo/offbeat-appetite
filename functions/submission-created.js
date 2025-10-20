/* eslint-disable @typescript-eslint/no-var-requires */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const sanityClient = require('@sanity/client');

// Read env variables.
require('dotenv').config();
const { NEWSLETTER_API_KEY, NEWSLETTER_SUBSCRIBERS_GROUP_ID, SLACK_WEBHOOK_URL } = process.env;

exports.handler = async (event) => {
  const { payload, site } = JSON.parse(event.body);

  const formName = payload.form_name || payload.data['form-name'];
  const siteName = site.name || '[SITE_NAME]';

  console.log(`NEW SUBMISSION FOR ${formName}:`, payload.data);

  if (formName === 'newsletter') {
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
              `Submitted to the *${formName}* form on the *${siteName}* site`,
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
          text: `*<https://app.netlify.com/sites/${siteName}/forms/${payload.form_id}|See all ${siteName} submissions>*  |  *<https://dashboard.mailerlite.com/subscribers?status=active|See MailerLite subscribers>*`,
        },
      },
      {
        type: 'divider',
      },
    ];

    return (
      // First, send user information to MailerLite
      fetch(`https://connect.mailerlite.com/api/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${NEWSLETTER_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          fields: { name },
          groups: [NEWSLETTER_SUBSCRIBERS_GROUP_ID],
        }),
      })
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

          const slackSuccessMessage = `New submission for the *${formName}* form:`;

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

          const slackMessage = `Error during a submission for the *${formName}* form:`;

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

  if (formName === 'review-rating') {
    const ratingAsString = (payload.data.rating || '').trim();
    const sanityDocumentId = (payload.data['document-id'] || '').trim();

    if (
      isNaN(ratingAsString) ||
      parseInt(ratingAsString, 10) < 1 ||
      parseInt(ratingAsString, 10) > 5
    ) {
      const message = `Invalid rating: ${ratingAsString}`;
      console.log(message);
      return {
        statusCode: 422,
        body: message,
      };
    }

    if (!sanityDocumentId || /^draft/.test(sanityDocumentId)) {
      const msg = `Invalid document ID: ${sanityDocumentId}`;
      console.error(msg);
      return {
        statusCode: 422,
        body: msg,
      };
    }

    const client = sanityClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: 'production',
      token: process.env.SANITY_WRITE_TOKEN || '',
      // Always use the freshest data (as we're going to save it to disk)
      useCdn: false,
    });

    try {
      const doc = {
        _type: 'blogPostRating',
        post: {
          _ref: sanityDocumentId,
          _type: 'reference',
        },
        rating: parseInt(ratingAsString, 10),
      };

      const result = await client.create(doc);
      console.log('New document created', result._id);

      await fetch(SLACK_WEBHOOK_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          text: 'New recipe rating:',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'New recipe rating:',
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: [`*Post ID*: ${sanityDocumentId}`, `*Rating*: ${ratingAsString}`].join('\n'),
              },
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: [
                    `Submitted to the *${formName}* form on the *${siteName}* site`,
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
                text: `*<https://app.netlify.com/sites/${siteName}/forms/${payload.form_id}|See all ${siteName} submissions>*  |  *<https://studio.offbeatappetite.com/desk/blogPost|See all Blog Posts on the CMS>*`,
              },
            },
            {
              type: 'divider',
            },
          ],
        }),
      });

      return {
        statusCode: 200,
        body: 'success',
      };
    } catch (e) {
      console.log(e);
      return {
        statusCode: 422,
        body: `Error while pushing rating to Sanity: ${e}`,
      };
    }
  }
};
