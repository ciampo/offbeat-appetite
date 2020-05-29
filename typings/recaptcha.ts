export type RecaptchaConfig = {
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

export type GRecaptcha = {
  ready: (callback: () => void) => Promise<void>;
  render: (container?: HTMLElement, config?: RecaptchaConfig) => number;
  execute: (id?: number) => void;
  reset: (id?: number) => void;
  getResponse: (id?: number) => string;
};
