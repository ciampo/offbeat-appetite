type RecaptchaConfig = {
  sitekey: string;
  theme?: string;
  size?: string;
  badge?: string;
  tabindex?: number;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (errorMessage: string) => void;
  isolated?: boolean;
  hl?: string;
};

interface Window {
  IS_GA_INIT?: boolean;
  navigator?: { share?: (data?: ShareData) => Promise<void> };
  grecaptcha?: {
    ready: (callback: () => void) => Promise<void>;
    render: (container?: HTMLElement, config: RecaptchaConfig) => number;
    execute: (id?: number) => void;
    reset: (id?: number) => void;
    getResponse: (id?: number) => string;
  };
}

type ShareOptions = { title: string; text: string; url: string };

type NavigatorShare = (options: ShareOptions) => Promise<Record<string, unknown>>;

interface Navigator {
  share?: NavigatorShare;
}
