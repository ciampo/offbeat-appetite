import * as React from 'react';
import { useLocalStorage } from 'react-use';
import ReactGA from 'react-ga4';

import { DISMISS_TOAST_MS_KEY } from './local-storage';

const buttonCommonClassName = [
  'type-tag bg-gray-white bg-opacity-0 text-gray-white rounded outline-none',
  'inline-block px-4 py-2 xl:px-5 py-3',
  'hover:bg-opacity-15',
  'focus:bg-opacity-15',
];

const SHOW_TOAST_TIMEOUT_MS = 20000;
const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;

const SubscribeToast: React.FC = () => {
  const [hideStillWaiting, setHideStillWaiting] = React.useState(true);
  const [hideUserInteraction, setHideUserInteraction] = React.useState(false);
  const [dismissToastMs, setDismissToastMs] = useLocalStorage(DISMISS_TOAST_MS_KEY, 0);

  const enoughTimeSinceLastDismissed = dismissToastMs + ONE_WEEK_MS < Date.now();
  const userPrefShowToast = enoughTimeSinceLastDismissed && !hideUserInteraction;

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
    setDismissToastMs(Date.now());
  };

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    if (userPrefShowToast) {
      timeoutId = setTimeout(() => {
        ReactGA.event({
          category: 'Promotion',
          action: 'Displayed Subscribe Toast',
          nonInteraction: true,
        });
        setHideStillWaiting(false);
      }, SHOW_TOAST_TIMEOUT_MS);
    }

    return (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [userPrefShowToast]);

  return hideStillWaiting || !userPrefShowToast ? null : (
    <div
      className={[
        'bg-olive-darker fixed z-30 left-0 bottom-0 w-full sm:w-auto shadow-top-right-md sm:rounded-tr',
        'px-6 sm:px-8 xl:px-10',
        'py-5 sm:py-6 xl:py-8',
        'space-y-4 sm:space-y-5 xl:space-y-6',
        'animation-fade-in-up animation-ease-out animation-.5s animation-once animation-fill-both',
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
          Remind me later
        </button>
      </p>
    </div>
  );
};

export default SubscribeToast;
