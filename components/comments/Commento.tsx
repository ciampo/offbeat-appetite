import React, { useEffect, useState } from 'react';

const insertScript = (src: string): Promise<HTMLScriptElement> =>
  new Promise((resolve) => {
    const script = window.document.createElement('script');

    script.async = true;
    script.src = src;
    script.id = 'commento-script';
    script.addEventListener('load', () => resolve(script));
    document.body.appendChild(script);
  });

const removeScript = (id: string): void => {
  const script = window.document.getElementById(id);

  if (script) {
    document.body.removeChild(script);
  }
};

const Commento: React.FC<{ host?: string }> = ({ host = 'https://cdn.commento.io' }) => {
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      insertScript(`${host}/js/commento.js`).then(() => setLoaded(true));
    }

    return (): void => removeScript('commento-script');
  }, []);

  return <div id="commento" />;
};

export default Commento;
