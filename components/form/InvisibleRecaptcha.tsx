import React, { useRef, useEffect, useState, MutableRefObject } from 'react';

const isRecaptchaReady = (): boolean =>
  Boolean(process.browser && window && window.grecaptcha && window.grecaptcha.ready);

export type InvisibleRecaptchaRef = {
  execute: (id?: number) => void;
  reset: (id?: number) => void;
  getResponse: (id?: number) => string;
};

export type InvisibleRecaptchaProps = {
  siteKey: string;
  onVerify: (token: string) => void;
};

type InvisibleRecaptchaPropsWithRef = InvisibleRecaptchaProps & {
  forwardedRef: MutableRefObject<InvisibleRecaptchaRef | null>;
};
const InvisibleRecaptcha: React.FC<InvisibleRecaptchaPropsWithRef> = ({
  siteKey,
  onVerify,
  forwardedRef,
  ...props
}) => {
  const isReadyIntervalRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const [isReady, setReady] = useState(false);

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
    if (isReady && containerRef.current && window.grecaptcha && !widgetId.current) {
      widgetId.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        size: 'invisible',
        callback: onVerify,
      });
      forwardedRef.current = {
        execute: window.grecaptcha.execute,
        reset: window.grecaptcha.reset,
        getResponse: window.grecaptcha.getResponse,
      };
    }
  }, [isReady, siteKey, forwardedRef, onVerify]);

  return <div ref={containerRef} {...props}></div>;
};

export default InvisibleRecaptcha;
