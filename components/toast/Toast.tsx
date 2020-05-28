import React, { useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import ReactGA from 'react-ga';

import { HIDE_TOAST_KEY } from './subscribe-toast-local-storage';

const buttonCommonClassName = [
  'type-tag bg-gray-white bg-opacity-0 text-gray-white rounded outline-none',
  'inline-block px-4 py-2 xl:px-5 py-3',
  'hover:bg-opacity-15',
  'focus:bg-opacity-15',
];

const SHOW_TOAST_TIMEOUT = 20000;

const SubscribeToast: React.FC = () => {
  const [hideStillWaiting, setHideStillWaiting] = useState(true);
  const [hideUserInteraction, setHideUserInteraction] = useState(false);
  const [hideSavedPref, sethideSavedPref] = useLocalStorage(HIDE_TOAST_KEY, false);

  const onSubscribeClick = (): void => {
    ReactGA.event({
      category: 'User',
      action: 'Interacted with Subscribe toast',
      label: 'Subscribe',
    });
    setHideUserInteraction(true);
  };
  const onDismissClick = (): void => {
    ReactGA.event({
      category: 'User',
      action: 'Interacted with Subscribe toast',
      label: 'Dismiss',
    });
    sethideSavedPref(true);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    if (!hideUserInteraction && !hideSavedPref) {
      timeoutId = setTimeout(() => {
        ReactGA.event({
          category: 'Promotion',
          action: 'Displayed Subscribe Toast',
          nonInteraction: true,
        });
        setHideStillWaiting(false);
      }, SHOW_TOAST_TIMEOUT);
    }

    return (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [hideUserInteraction, hideSavedPref]);

  return hideStillWaiting || hideSavedPref || hideUserInteraction ? null : (
    <div
      className={[
        'bg-olive-darker fixed z-30 left-0 bottom-0 w-full sm:w-auto shadow-top-right-md sm:rounded-tr',
        'px-6 sm:px-8 xl:px-10',
        'py-5 sm:py-6 xl:py-8',
        'space-y-4 sm:space-y-5 xl:space-y-6',
        'animation-toast-in animation-ease-out animation-.5s animation-once',
      ].join(' ')}
    >
      <p className="type-body text-gray-white">
        If you enjoy this website, please support it with your subscription
      </p>
      <p className="space-x-6 flex items-center justify-start">
        <a
          className={[...buttonCommonClassName, 'border border-gray-white'].join(' ')}
          href="#subscribe"
          onClick={onSubscribeClick}
        >
          Subscribe
        </a>
        <button
          className={[...buttonCommonClassName, 'font-medium border-0'].join(' ')}
          onClick={onDismissClick}
        >
          Don&#39;t show again
        </button>
      </p>
    </div>
  );
};

export default SubscribeToast;
