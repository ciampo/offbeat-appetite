import * as React from 'react';

const COMMENTO_SCRIPT_PATH = '/js/commento.js';
const COMMENTO_ORIGIN_LOCAL = 'http://localhost:8080';
const COMMENTO_ORIGIN_REMOTE = 'https://cdn.commento.io';

const COMMENTO_SCRIPT_ID = 'commento-script';

const insertCommentoScript = (pageId: string): void => {
  const script = window.document.createElement('script');

  script.defer = true;
  script.src = `${
    /localhost/.test(window?.origin) ? COMMENTO_ORIGIN_LOCAL : COMMENTO_ORIGIN_REMOTE
  }${COMMENTO_SCRIPT_PATH}`;
  script.id = COMMENTO_SCRIPT_ID;

  // Optional data attributes
  script.dataset.noFonts = 'true';
  script.dataset.pageId = pageId;

  document.body.appendChild(script);
};

const removeCommentoScript = (): void => {
  const script = window?.document?.getElementById(COMMENTO_SCRIPT_ID);

  if (script) {
    document.body.removeChild(script);
  }
};

const Commento: React.FC<{ pageId: string }> = ({ pageId }) => {
  React.useEffect(() => {
    insertCommentoScript(pageId);

    return (): void => removeCommentoScript();
  }, [pageId]);

  return <div id="commento" />;
};

export default Commento;
