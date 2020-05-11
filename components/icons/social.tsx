import React from 'react';

import { IconProps } from './types';

export const FacebookIcon: React.FC<IconProps> = ({ idPrefix = 'icon-social', ...props }) => (
  <svg
    {...props}
    aria-labelledby={`${idPrefix}-facebook`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <title id={`${idPrefix}-facebook`}>Facebook</title>
    <path
      d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"
      fill="currentColor"
    />
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ idPrefix = 'icon-social', ...props }) => (
  <svg
    {...props}
    aria-labelledby={`${idPrefix}-instagram`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <title id={`${idPrefix}-instagram`}>Instagram</title>
    <path
      d="M352 0H160A160 160 0 000 160v192a160 160 0 00160 160h192a160 160 0 00160-160V160A160 160 0 00352 0zm112 352c0 61.8-50.2 112-112 112H160c-61.8 0-112-50.2-112-112V160C48 98.2 98.2 48 160 48h192c61.8 0 112 50.2 112 112v192z"
      fill="currentColor"
    />
    <path
      d="M256 128a128 128 0 100 256 128 128 0 000-256zm0 208a80.1 80.1 0 010-160 80 80 0 010 160z"
      fill="currentColor"
    />
    <circle cx="393.6" cy="118.4" r="17.1" fill="currentColor" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ idPrefix = 'icon-social', ...props }) => (
  <svg
    {...props}
    aria-labelledby={`${idPrefix}-mail`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <title id={`${idPrefix}-mail`}>Email</title>
    <path
      d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z"
      fill="currentColor"
    />
  </svg>
);

export const PinterestIcon: React.FC<IconProps> = ({ idPrefix = 'icon-social', ...props }) => (
  <svg
    {...props}
    aria-labelledby={`${idPrefix}-pinterest`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <title id={`${idPrefix}-pinterest`}>Pinterest</title>
    <path
      d="M12.14.5C5.86.5 2.7 5 2.7 8.75c0 2.27.86 4.3 2.7 5.05.3.12.57 0 .66-.33l.27-1.06c.1-.32.06-.44-.2-.73-.52-.62-.86-1.44-.86-2.6 0-3.33 2.5-6.32 6.5-6.32 3.55 0 5.5 2.17 5.5 5.07 0 3.8-1.7 7.02-4.2 7.02-1.37 0-2.4-1.14-2.07-2.54.4-1.68 1.16-3.48 1.16-4.7 0-1.07-.58-1.98-1.78-1.98-1.4 0-2.55 1.47-2.55 3.42 0 1.25.43 2.1.43 2.1l-1.7 7.2c-.5 2.13-.08 4.75-.04 5 .02.17.22.2.3.1.14-.18 1.82-2.26 2.4-4.33.16-.58.93-3.63.93-3.63.45.88 1.8 1.65 3.22 1.65 4.25 0 7.13-3.87 7.13-9.05C20.5 4.15 17.18.5 12.14.5z"
      fill="currentColor"
    />
  </svg>
);

export const TwitterIcon: React.FC<IconProps> = ({ idPrefix = 'icon-social', ...props }) => (
  <svg
    {...props}
    aria-labelledby={`${idPrefix}-twitter`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <title id={`${idPrefix}-twitter`}>Twitter</title>
    <path
      d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"
      fill="currentColor"
    />
  </svg>
);

export const WhatsappIcon: React.FC<IconProps> = ({ idPrefix = 'icon-social', ...props }) => (
  <svg
    {...props}
    aria-labelledby={`${idPrefix}-whatsapp`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <title id={`${idPrefix}-whatsapp`}>Whatsapp</title>
    <path
      d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z"
      fill="currentColor"
    />
  </svg>
);

export const PocketIcon: React.FC<IconProps> = ({ idPrefix = 'icon-social', ...props }) => (
  <svg
    {...props}
    aria-labelledby={`${idPrefix}-pocket`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <title id={`${idPrefix}-pocket`}>Pocket</title>
    <path
      d="M480 32H32A32 32 0 000 64v176c0 132.4 107.6 240 240 240h32c132.4 0 240-107.6 240-240V64a32 32 0 00-32-32zm-73.4 182.6l-128 128a32 32 0 01-45.2 0l-128-128a32 32 0 1145.2-45.2L256 274.8l105.4-105.4a32 32 0 1145.2 45.2z"
      fill="currentColor"
    />
  </svg>
);

export const GenericShareIcon: React.FC<IconProps> = ({ idPrefix = 'icon-social', ...props }) => (
  <svg
    {...props}
    aria-labelledby={`${idPrefix}-genericshare`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <title id={`${idPrefix}-genericshare`}>Share</title>
    <path
      d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
      fill="currentColor"
    />
  </svg>
);
