import React, { useState, useEffect, useRef, memo } from 'react';
import { useLocalStorage } from 'react-use';
import ReactGA from 'react-ga';

import { ButtonOlive } from '../button/Button';

import { DISMISS_TOAST_MS_KEY, HIDE_TOAST_KEY } from './local-storage';

const SHOW_MODAL_TIMEOUT_MS = 10000;
const HALF_DAY_MS = (1000 * 60 * 60 * 24) / 2;

const ELEMENTS_TO_MAKE_ARIA_HIDDEN_WHEN_MODAL_OPENS = [
  window?.document?.getElementById('site-header'),
  window?.document?.getElementById('site-content'),
  window?.document?.getElementById('site-footer'),
];

const sendModalGaEvent = (label: string): void => {
  ReactGA.event({
    category: 'User',
    action: 'Interacted with Subscribe Modal',
    label,
  });
};

const SubscribeAnchorEl = memo(
  React.forwardRef<HTMLAnchorElement | null, unknown>((props, forwardedRef) => (
    <a {...props} href="#subscribe" ref={forwardedRef} />
  ))
);
SubscribeAnchorEl.displayName = 'memo(forwardRef(SubscribeAnchorEl))';

const SubscribeModal: React.FC = () => {
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const subscribeButtonRef = useRef<HTMLAnchorElement>(null);
  const dismissButtonRef = useRef<HTMLButtonElement>(null);

  const [isWaitingForInitialTimeout, setIsWaitingForInitialTimeout] = useState(true);
  const [hasUserClikedSubscribe, sethasUserClikedSubscribe] = useState(false);
  const [dismissToastMs, setDismissToastMs] = useLocalStorage(DISMISS_TOAST_MS_KEY, 0);
  const userHasAlreadySubscribedOnThisBrowser = useLocalStorage(HIDE_TOAST_KEY, false)[0];

  const enoughTimeSinceLastDismissed = dismissToastMs + HALF_DAY_MS < Date.now();
  const shouldShowBasedOnUserPreferences = enoughTimeSinceLastDismissed && !hasUserClikedSubscribe;
  const shouldRender =
    shouldShowBasedOnUserPreferences &&
    !isWaitingForInitialTimeout &&
    !userHasAlreadySubscribedOnThisBrowser;

  const hasModalBeenFocused = useRef(false);

  // Initial timeout logic
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    if (shouldShowBasedOnUserPreferences) {
      timeoutId = setTimeout(() => {
        ReactGA.event({
          category: 'Promotion',
          action: 'Displayed Subscribe Modal',
          nonInteraction: true,
        });
        setIsWaitingForInitialTimeout(false);
      }, SHOW_MODAL_TIMEOUT_MS);
    }

    return (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [shouldShowBasedOnUserPreferences]);

  // Click events
  const onSubscribeClick = (): void => {
    sendModalGaEvent('Subscribe button');
    sethasUserClikedSubscribe(true);
  };
  const onDismissClick = (): void => {
    sendModalGaEvent('Dismiss button');
    setDismissToastMs(Date.now());
  };
  const onScrimClick = (): void => {
    sendModalGaEvent('Scrim interaction');
    setDismissToastMs(Date.now());
  };

  // Keyboard events: trap focus between subscribe and dismiss buttons
  const onSubscribeKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>): void => {
    if (e.key === 'Tab' && e.shiftKey) {
      dismissButtonRef.current?.focus();
      e.preventDefault();
    }
  };
  const onDismissKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Tab' && !e.shiftKey) {
      subscribeButtonRef.current?.focus();
      e.preventDefault();
    }
  };

  // Keyboard events: press ESC to dismiss modal
  const onModalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Esc') {
      sendModalGaEvent('ESC key');
      setDismissToastMs(Date.now());
      e.preventDefault();
    }
  };

  // Prevent body from scrolling when modal is visible
  useEffect(() => {
    document.body.style.overflow = shouldRender ? 'hidden' : '';
  }, [shouldRender]);

  // Set aria-hidden on other parts of the page to exclude them from the
  // screen reader while the modal is open
  useEffect(() => {
    ELEMENTS_TO_MAKE_ARIA_HIDDEN_WHEN_MODAL_OPENS.map((el) => {
      if (el) {
        el.setAttribute('aria-hidden', shouldRender ? 'true' : 'false');
      }
    });
  }, [shouldRender]);

  // Move focus on the modal when it's shown
  useEffect(() => {
    if (shouldRender && modalContainerRef.current && !hasModalBeenFocused.current) {
      modalContainerRef.current.focus();
      hasModalBeenFocused.current = true;
    }
  }, [shouldRender]);

  return shouldRender ? (
    <>
      <div
        aria-hidden="true"
        className="fixed z-50 left-0 top-0 h-full w-full bg-black opacity-50"
        onClick={onScrimClick}
      />
      <div
        className={[
          'fixed z-50 transform-translate-center max-w-lg xl:max-w-xl',
          'flex flex-col-reverse xsm:flex-row-reverse bg-white focus:outline-none',
        ].join(' ')}
        style={{
          width: 'calc(100% - 3rem)',
        }}
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-descr"
        tabIndex={-1}
        ref={modalContainerRef}
        onKeyDown={onModalKeyDown}
      >
        <div className="p-4 xsm:pt-8 xl:py-12 xl:px-6 xl:pb-6">
          <h2 id="modal-title" className="type-display-3 mb-2 xsm:mb-3 xl:mb-4">
            The 2020 Sustainable Holiday Gift Guide is out!
          </h2>
          <p id="modal-descr" className="type-body mb-4 xsm:mb-6 xl:mb-8">
            Subscribe now to get a copy in your inbox!
          </p>

          <ButtonOlive
            component={SubscribeAnchorEl}
            onClick={onSubscribeClick}
            ref={subscribeButtonRef}
            onKeyDown={onSubscribeKeyDown}
            className="mx-auto w-full justify-center"
          >
            Subscribe
          </ButtonOlive>

          <button
            className="absolute top-0 right-0 p-2"
            onClick={onDismissClick}
            ref={dismissButtonRef}
            onKeyDown={onDismissKeyDown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className="w-6 h-6 xl:w-8 xl:h-8"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className="flex-shrink-0 flex-grow-0 w-full h-20 xsm:w-48 xsm:h-auto xsm:self-stretch xl:w-56 bg-gray-400">
          img
        </div>
      </div>
    </>
  ) : null;
};

export default SubscribeModal;
