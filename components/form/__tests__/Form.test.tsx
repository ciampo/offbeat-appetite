// @ts-ignore
import preloadAll from 'jest-next-dynamic';

import * as React from 'react';
import { axe } from 'jest-axe';
import { render, act, waitFor } from '../../../test/offbeat-appetite-render';
import userEvent from '@testing-library/user-event';

import NewsletterSubscribe from '../NewsletterSubscribe';

import {
  subscribeFormTitle,
  subscribeFormNameInputLabel,
  subscribeFormEmailInputLabel,
  subscribeFormSubmitButtonLabel,
  subscribeFormSubmitButtonLabelSubmitting,
  subscribeFormMessageDisabled,
  subscribeFormMessageSuccess,
  subscribeFormMessageError,
} from '../../../data/siteMiscContent.json';

const mockRecaptchaResponse = 'mock-recaptcha-response';

jest.mock('../../../data/siteMiscContent.json', () => ({
  subscribeFormTitle: 'Test title',
  subscribeFormNameInputLabel: 'Test name label',
  subscribeFormEmailInputLabel: 'Test email label',
  subscribeFormSubmitButtonLabel: 'Test submit label',
  subscribeFormSubmitButtonLabelSubmitting: 'Test submitting label',
  subscribeFormMessageDisabled: 'Test disabled message',
  subscribeFormMessageSuccess: 'Test success message',
  subscribeFormMessageError: 'Test error message',
}));

const testValidName = 'Test Name';
const testValidEmail = 'test@email.com';
const testValidRequest = {
  body: `form-name=newsletter&name=Test%20Name&email=test%40email.com&g-recaptcha-response=${mockRecaptchaResponse}`,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  method: 'POST',
};

// Spy on console.warn
let spiedConsoleWarn: jest.SpyInstance;
let mockFetch: jest.SpyInstance;

beforeAll(async () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  spiedConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  mockFetch = jest.fn();
  // @ts-ignore
  global.fetch = mockFetch;

  let onVeriy: (token: string) => void;
  // @ts-ignore
  global.grecaptcha = {
    render: (wrapper: HTMLElement, config: { callback: (token: string) => void }): string => {
      onVeriy = config.callback;
      return 'test-widget-id';
    },
    execute: (): void => {
      setTimeout(() => onVeriy(mockRecaptchaResponse), 100);
    },
    reset: (): void => {
      // empty
    },
    ready: (): void => {
      // empty
    },
  };

  Object.defineProperty(process, 'browser', {
    value: true,
  });

  await preloadAll();
});

afterAll(() => {
  spiedConsoleWarn.mockRestore();

  // @ts-ignore
  delete global.fetch;

  // @ts-ignore
  delete global.recaptcha;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('NewsletterSubscribe', () => {
  test('renders with valid configuration', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ status: 200 }));

    const honeypotInputName = 'bot-field';
    const { getByLabelText, getByText, getByTestId, getByRole, container } = render(
      <NewsletterSubscribe formInstance="test" />
    );

    expect(getByText(subscribeFormTitle)).toBeInTheDocument();
    expect(getByLabelText(subscribeFormNameInputLabel)).toBeInTheDocument();
    expect(getByLabelText(subscribeFormNameInputLabel)).toHaveAttribute('type', 'text');
    expect(getByLabelText(subscribeFormEmailInputLabel)).toBeInTheDocument();
    expect(getByLabelText(subscribeFormEmailInputLabel)).toHaveAttribute('type', 'email');
    expect(getByText(subscribeFormSubmitButtonLabel)).toBeInTheDocument();
    expect(getByText(subscribeFormSubmitButtonLabel)).toHaveAttribute('type', 'submit');

    expect(getByTestId('subscribe-form-section-wrapper')).toBeInTheDocument();
    expect(getByTestId('subscribe-form-section-wrapper')).toHaveAttribute('id', 'subscribe');
    expect(getByTestId('newsletter-form')).toBeInTheDocument();
    expect(getByTestId('newsletter-form')).toHaveAttribute('method', 'POST');
    expect(getByTestId('newsletter-form')).toHaveAttribute('action', '/thank-you');
    expect(getByTestId('newsletter-form')).toHaveAttribute('data-netlify', 'true');
    expect(getByTestId('newsletter-form')).toHaveAttribute(
      'data-netlify-honeypot',
      honeypotInputName
    );
    expect(getByTestId('newsletter-form')).toHaveAttribute('data-netlify-recaptcha', 'true');

    expect(getByLabelText(/human/i)).toHaveAttribute('name', honeypotInputName);

    expect(getByRole('alert')).toBeInTheDocument();
    expect(getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    expect(getByRole('alert')).toHaveTextContent('');

    expect(await axe(container)).toHaveNoViolations();

    // Kick in form validation
    await act(async () => {
      await userEvent.click(getByText(subscribeFormSubmitButtonLabel));
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(spiedConsoleWarn).not.toHaveBeenCalled();

    // Type valid info
    await act(async () => {
      await userEvent.type(getByLabelText(subscribeFormNameInputLabel), testValidName);
    });

    await act(async () => {
      await userEvent.type(getByLabelText(subscribeFormEmailInputLabel), testValidEmail);
    });

    // Click submit
    await act(async () => {
      await userEvent.click(getByText(subscribeFormSubmitButtonLabel));
    });

    // Submitting (async because of recaptcha)
    await waitFor(() => expect(getByText(subscribeFormSubmitButtonLabelSubmitting)).toBeDisabled());

    // Submission went through
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/thank-you', testValidRequest);
    expect(spiedConsoleWarn).not.toHaveBeenCalled();

    expect(getByText(subscribeFormSubmitButtonLabel)).toBeInTheDocument();
    expect(getByText(subscribeFormSubmitButtonLabel)).not.toBeDisabled();

    expect(getByRole('alert')).toHaveTextContent(subscribeFormMessageSuccess);

    expect(await axe(container)).toHaveNoViolations();
  });

  test('handles a network error', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ status: 500 }));

    const { getByLabelText, getByText, getByRole, container } = render(
      <NewsletterSubscribe formInstance="test" />
    );

    // Type valid info
    await act(async () => {
      await userEvent.type(getByLabelText(subscribeFormNameInputLabel), testValidName);
    });

    await act(async () => {
      await userEvent.type(getByLabelText(subscribeFormEmailInputLabel), testValidEmail);
    });

    // Click submit
    await act(async () => {
      await userEvent.click(getByText(subscribeFormSubmitButtonLabel));
    });

    // Submitting
    await waitFor(() => expect(getByText(subscribeFormSubmitButtonLabelSubmitting)).toBeDisabled());

    // Submission went through
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/thank-you', testValidRequest);
    expect(spiedConsoleWarn).toHaveBeenCalled();

    expect(getByText(subscribeFormSubmitButtonLabel)).toBeInTheDocument();
    expect(getByText(subscribeFormSubmitButtonLabel)).not.toBeDisabled();

    expect(getByRole('alert')).toHaveTextContent(subscribeFormMessageError);

    expect(await axe(container)).toHaveNoViolations();
  });

  test('handles a fetch rejection', async () => {
    const testError = { error: 'Test error' };
    mockFetch.mockRejectedValueOnce(testError);

    const { getByLabelText, getByText, getByRole, container } = render(
      <NewsletterSubscribe formInstance="test" />
    );

    // Type valid info
    await act(async () => {
      await userEvent.type(getByLabelText(subscribeFormNameInputLabel), testValidName);
    });

    await act(async () => {
      await userEvent.type(getByLabelText(subscribeFormEmailInputLabel), testValidEmail);
    });

    // Click submit
    await act(async () => {
      await userEvent.click(getByText(subscribeFormSubmitButtonLabel));
    });

    // Submitting
    await waitFor(() => expect(getByText(subscribeFormSubmitButtonLabelSubmitting)).toBeDisabled());

    // Submission went through
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/thank-you', testValidRequest);
    expect(spiedConsoleWarn).toHaveBeenCalled();

    expect(getByText(subscribeFormSubmitButtonLabel)).toBeInTheDocument();
    expect(getByText(subscribeFormSubmitButtonLabel)).not.toBeDisabled();

    expect(getByRole('alert')).toHaveTextContent(
      `${subscribeFormMessageError} [${JSON.stringify(testError)}]`
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  test('can be disabled via env variables', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ status: 200 }));

    const oldIsSubmitFormEnalbled = process.env.NEXT_PUBLIC_IS_SUBMIT_FORM_ENABLED;
    process.env.NEXT_PUBLIC_IS_SUBMIT_FORM_ENABLED = 'false';

    const { getByText, getByRole, getByTestId, container } = render(
      <NewsletterSubscribe formInstance="test" />
    );

    expect(getByText(subscribeFormSubmitButtonLabel)).toBeDisabled();
    expect(getByRole('alert')).toHaveTextContent(subscribeFormMessageDisabled);

    expect(await axe(container)).toHaveNoViolations();

    await act(async () => {
      await (getByTestId('newsletter-form') as HTMLFormElement).submit();
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(spiedConsoleWarn).not.toHaveBeenCalled();

    process.env.NEXT_PUBLIC_IS_SUBMIT_FORM_ENABLED = oldIsSubmitFormEnalbled;
  });
});
