import React, { useRef, useEffect, useState, MutableRefObject } from 'react';
import { useIntersection } from 'react-use';

const isRecaptchaReady = (): boolean =>
  Boolean(
    process.browser &&
      window &&
      window.grecaptcha &&
      window.grecaptcha.ready &&
      window.grecaptcha.execute
  );

const isIoSupported =
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window &&
  'intersectionRatio' in window.IntersectionObserverEntry.prototype;

const RECAPTCHA_SCRIPT_URL = 'https://recaptcha.net/recaptcha/api.js?render=explicit';

function injectRecaptchaScript(): void {
  const script = document.createElement('script');

  script.async = true;
  script.defer = true;
  script.src = RECAPTCHA_SCRIPT_URL;

  if (document.head) {
    document.head.appendChild(script);
  }
}

export type InvisibleRecaptchaRef = {
  execute: (id?: number) => void;
  reset: (id?: number) => void;
  getResponse: (id?: number) => string;
};

export type InvisibleRecaptchaProps = {
  siteKey: string;
  onVerify: (token: string) => void;
  onError: (errorMessage: string) => void;
};

type InvisibleRecaptchaPropsWithRef = InvisibleRecaptchaProps & {
  forwardedRef: MutableRefObject<InvisibleRecaptchaRef | null>;
};
const InvisibleRecaptcha: React.FC<InvisibleRecaptchaPropsWithRef> = ({
  siteKey,
  onVerify,
  onError,
  forwardedRef,
  ...props
}) => {
  const isReadyIntervalRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [isReady, setReady] = useState(false);
  const [inView, setInView] = useState<boolean>(!isIoSupported);
  const ioResults = useIntersection(containerRef, {});

  // Initially, wait until the component enters the viewport
  useEffect(() => {
    if (ioResults && ioResults.intersectionRatio > 0) {
      setInView(true);
    }
  }, [ioResults]);

  // When the component enters the viewport, check if the recaptcha script
  // needs to be injected in the page.
  useEffect(() => {
    if (
      inView &&
      !document.querySelector(`script[src="${RECAPTCHA_SCRIPT_URL}"]`) &&
      !isRecaptchaReady()
    ) {
      injectRecaptchaScript();
    }
  }, [inView]);

  // In the meantime, as soon as the component enters the viewport, start
  // checking periodically for the recaptcha library to be initialised and ready
  useEffect(() => {
    function checkIsReady(): boolean {
      const readyCheck = isRecaptchaReady();
      if (readyCheck) {
        setReady(true);
        if (isReadyIntervalRef.current) {
          clearInterval(isReadyIntervalRef.current);
          isReadyIntervalRef.current = undefined;
        }
      }

      return readyCheck;
    }

    if (inView && !checkIsReady()) {
      isReadyIntervalRef.current = setInterval(checkIsReady, 500);
    }

    return (): void => {
      if (isReadyIntervalRef.current) {
        clearInterval(isReadyIntervalRef.current);
      }
    };
  }, [inView]);

  // When the recaptcha library is ready, and only if a widget hasn't already been
  // created, create a new recaptcha widget
  useEffect(() => {
    if (isReady && containerRef.current && window.grecaptcha && !widgetId.current) {
      widgetId.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        size: 'invisible',
        callback: onVerify,
        'error-callback': onError,
      });
      forwardedRef.current = {
        execute: window.grecaptcha.execute,
        reset: window.grecaptcha.reset,
        getResponse: window.grecaptcha.getResponse,
      };
    }
  }, [isReady, siteKey, forwardedRef, onVerify, onError]);

  return <div ref={containerRef} {...props}></div>;
};

export default InvisibleRecaptcha;
