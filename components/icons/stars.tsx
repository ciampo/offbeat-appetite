import React from 'react';

type Props = {
  className?: string;
  [key: string]: unknown;
};

export const StarFullIcon: React.FC<Props> = (props) => (
  <svg
    {...props}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M40 57.6L60.6 70l-5.5-23.4 18.2-15.8-24-2L40 6.7l-9.4 22-24 2.1L25 46.6 19.4 70 40 57.6z"
      fill="currentColor"
    />
  </svg>
);

export const StarHalfIcon: React.FC<Props> = (props) => (
  <svg
    {...props}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M73.3 30.8l-24-2L40 6.6l-9.4 22-24 2.1L25 46.6 19.4 70 40 57.6 60.6 70l-5.4-23.4 18.1-15.8zM40 51.3v-31l5.7 13.5 14.6 1.3-11 9.6 3.3 14.2L40 51.3z"
      fill="currentColor"
    />
  </svg>
);

export const StarEmptyIcon: React.FC<Props> = (props) => (
  <svg
    {...props}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M73.3 30.8l-24-2L40 6.6l-9.4 22-24 2.1L25 46.6 19.4 70 40 57.6 60.6 70l-5.4-23.4 18.1-15.8zM40 51.3L27.5 59l3.3-14.3-11-9.6 14.5-1.2L40 20.3l5.7 13.5 14.6 1.3-11 9.6 3.3 14.2L40 51.3z"
      fill="currentColor"
    />
  </svg>
);
