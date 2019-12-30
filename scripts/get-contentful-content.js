/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
// const urlParser = require('url');
// const https = require('https');
const del = require('del');
const { promisify } = require('util');
const { createClient } = require('contentful');

const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

require('dotenv').config();

const SPACE = process.env.CONTENTFUL_SPACE;
const TOKEN = process.env.CONTENTFUL_TOKEN;

const client = createClient({
  space: SPACE,
  accessToken: TOKEN,
});

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data');

const cleanDataFolder = async () => {
  if (await existsAsync(DATA_FOLDER)) {
    // Using `del` as fs.rmdir can not delete folders recursively.
    await del(DATA_FOLDER);
  }

  await mkdirAsync(DATA_FOLDER, { recursive: true });
};

// const THUMB_KEY = '__base64Thumb';
// async function downloadBase64ThumbData(url) {
//   return new Promise((resolve) => {
//     https
//       .get(urlParser.parse(`https:${url}?w=20&fit=fill&fm=jpg&q=10`), (response) => {
//         const chunks = [];

//         response
//           .on('data', (chunk) => {
//             chunks.push(chunk);
//           })
//           .on('end', () => {
//             resolve(`data:image/jpeg;base64,${Buffer.concat(chunks).toString('base64')}`);
//           });
//       })
//       .on('error', (err) => {
//         console.error(err);
//       });
//   });
// }

async function addBase64ThumbData(obj) {
  if (Array.isArray(obj)) {
    let i = 0;
    for (const child of obj) {
      // NOTE: this function will not add augmented data to arrays of FIFE urls
      obj[i] = await addBase64ThumbData(child);
      i += 1;
    }
  } else if (obj !== null && typeof obj === 'object') {
    // if ('contentType' in obj && /image/.test(obj.contentType)) {
    //   // eslint-disable-next-line require-atomic-updates
    //   obj[THUMB_KEY] = await downloadBase64ThumbData(obj.url);
    // }

    for (const [key, value] of Object.entries(obj)) {
      // eslint-disable-next-line require-atomic-updates
      obj[key] = await addBase64ThumbData(value, obj);
    }
  }

  return obj;
}

// 'sys' gets replaced by 'just the id'
// all properties in 'fields' are moved up
function flattenContentfulApis(obj) {
  if (Array.isArray(obj)) {
    let i = 0;
    for (const child of obj) {
      obj[i] = flattenContentfulApis(child);
      i += 1;
    }
  } else if (obj !== null && typeof obj === 'object' && obj.nodeType !== 'document') {
    if ('sys' in obj && 'fields' in obj) {
      obj = {
        id: obj.sys.id,
        _updatedAt: obj.sys.updatedAt,
        _contentType: obj.sys.contentType ? obj.sys.contentType.sys.id : null,
        ...obj.fields,
      };
    }

    for (const [key, value] of Object.entries(obj)) {
      obj[key] = flattenContentfulApis(value);
    }
  }

  return obj;
}

async function getEntries(
  type,
  filename,
  isSingleton = false,
  order = 'sys.updatedAt',
  filterFuntion = () => true
) {
  const entries = await client.getEntries({
    // eslint-disable-next-line @typescript-eslint/camelcase
    content_type: type,
    order,
  });

  let contents = flattenContentfulApis(entries.items).filter(filterFuntion);

  if (contents.length === 0) {
    return;
  }

  // When singleton, assume the first entry is the only entry.
  if (isSingleton) {
    contents = contents[0];
  }

  contents = await addBase64ThumbData(contents);

  await writeFileAsync(
    path.join(DATA_FOLDER, `${filename}.json`),
    JSON.stringify(contents, null, 2)
  );

  console.info(`Data saved to disk: ${filename}`);
}

const pullContentfulData = async () => {
  await cleanDataFolder();

  // Pages and global data
  await getEntries('homePage', 'page-home', true);
  await getEntries('aboutPage', 'page-about', true);
  await getEntries('searchPage', 'page-search', true);
  await getEntries('photoGalleryPage', 'page-gallery', true);
  await getEntries('categoryPage', 'page-category', true);
  await getEntries('blogPostPage', 'page-blog-post', true);
  await getEntries('misc', 'site-misc', true);
  await getEntries('structuredDataTemplate', 'structured-data-template', true);

  // Entries
  await getEntries('category', 'categories', false, 'fields.order');
  await getEntries('tag', 'tags', false, 'fields.name');
  await getEntries('author', 'authors', false, 'fields.name');
  await getEntries('blogPost', 'posts', false, '-fields.datePublished');
};

pullContentfulData();
