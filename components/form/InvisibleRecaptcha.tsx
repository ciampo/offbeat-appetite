import React, { useRef, useEffect, useState, MutableRefObject } from 'react';
import { useIntersection } from 'react-use';

const isRecaptchaReady = (): boolean =>
  Boolean(process.browser && window && window.grecaptcha && window.grecaptcha.ready);

const isIoSupported =
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window &&
  'intersectionRatio' in window.IntersectionObserverEntry.prototype;

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

  const [allowInit, setAllowInit] = useState<boolean>(!isIoSupported);
  const ioResults = useIntersection(containerRef, {});

  useEffect(() => {
    if (ioResults && ioResults.intersectionRatio > 0) {
      setAllowInit(true);
    }
  }, [ioResults]);

  useEffect(() => {
    const checkIsReady = (): boolean => {
      const readyCheck = isRecaptchaReady();
      if (readyCheck) {
        setReady(true);
        if (isReadyIntervalRef.current) {
          clearInterval(isReadyIntervalRef.current);
          isReadyIntervalRef.current = undefined;
        }
      }

      return readyCheck;
    };

    if (!checkIsReady()) {
      isReadyIntervalRef.current = setInterval(checkIsReady, 50);
    }

    return (): void => {
      if (isReadyIntervalRef.current) {
        clearInterval(isReadyIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // When everything is ready (and only if recaptcha hasn't been initialised yet),
    // init recaptcha and set the ref
    if (isReady && allowInit && containerRef.current && window.grecaptcha && !widgetId.current) {
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
  }, [isReady, siteKey, forwardedRef, onVerify, onError, allowInit]);

  return <div ref={containerRef} {...props}></div>;
};

export default InvisibleRecaptcha;
