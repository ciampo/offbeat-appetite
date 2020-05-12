import React from 'react';
import { axe } from 'jest-axe';
import { render, act } from 'offbeat-appetite-render';

import userEvent from '@testing-library/user-event';

import NewsletterSubscribe from '../NewsletterSubscribe';

// Spy on console.warn
let spiedConsoleWarn: jest.SpyInstance;
let mockFetch: jest.SpyInstance;

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  spiedConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  mockFetch = jest.fn();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  global.fetch = mockFetch;
});

afterAll(() => {
  spiedConsoleWarn.mockRestore();

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  delete global.fetch;
});

afterEach(() => {
  jest.clearAllMocks();
});

const testValidName = 'Test Name';
const testValidEmail = 'test@email.com';
const testValidRequest = {
  body: 'form-name=newsletter&name=Test%20Name&email=test%40email.com',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  method: 'POST',
};

describe('NewsletterSubscribe', () => {
  test('renders with valid configuration', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ status: 200 }));

    const honeypotInputName = 'bot-field';
    const { getByLabelText, getByText, getByTestId, getByRole, container } = render(
      <NewsletterSubscribe formInstance="test" />
    );

    expect(getByLabelText(/name/i)).toBeInTheDocument();
    expect(getByLabelText(/name/i)).toHaveAttribute('type', 'text');
    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    expect(getByText(/submit/i)).toBeInTheDocument();
    expect(getByText(/submit/i)).toHaveAttribute('type', 'submit');

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
      await userEvent.click(getByText(/submit/i));
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(spiedConsoleWarn).not.toHaveBeenCalled();

    // Type valid info
    await act(async () => {
      await userEvent.type(getByLabelText(/name/i), testValidName);
    });

    await act(async () => {
      await userEvent.type(getByLabelText(/email/i), testValidEmail);
    });

    act(() => {
      userEvent.click(getByText(/submit/i));
    });

    // Submtiting
    expect(getByText(/sending/i)).toBeDisabled();

    await act(async () => {
      await userEvent.click(getByText(/sending/i));
    });

    // Submitted successfully
    expect(getByText(/submit/i)).toBeInTheDocument();
    expect(getByText(/submit/i)).not.toBeDisabled();

    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/', testValidRequest);
    expect(spiedConsoleWarn).not.toHaveBeenCalled();

    expect(getByRole('alert')).toHaveTextContent(/thank you for subscribing/i);

    expect(await axe(container)).toHaveNoViolations();
  });

  test('handles a network error', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ status: 500 }));

    const { getByLabelText, getByText, getByRole, container } = render(
      <NewsletterSubscribe formInstance="test" />
    );

    // Type valid info
    await act(async () => {
      await userEvent.type(getByLabelText(/name/i), testValidName);
    });

    await act(async () => {
      await userEvent.type(getByLabelText(/email/i), testValidEmail);
    });

    act(() => {
      userEvent.click(getByText(/submit/i));
    });

    // Submtiting
    expect(getByText(/sending/i)).toBeDisabled();

    await act(async () => {
      await userEvent.click(getByText(/sending/i));
    });

    // Submitted successfully
    expect(getByText(/submit/i)).toBeInTheDocument();
    expect(getByText(/submit/i)).not.toBeDisabled();

    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/', testValidRequest);
    expect(spiedConsoleWarn).toHaveBeenCalled();

    expect(getByRole('alert')).toHaveTextContent(/issue with your submission/i);

    expect(await axe(container)).toHaveNoViolations();
  });

  test('handles a fetch rejection', async () => {
    mockFetch.mockRejectedValueOnce({ error: 'Test error' });

    const { getByLabelText, getByText, getByRole, container } = render(
      <NewsletterSubscribe formInstance="test" />
    );

    // Type valid info
    await act(async () => {
      await userEvent.type(getByLabelText(/name/i), testValidName);
    });

    await act(async () => {
      await userEvent.type(getByLabelText(/email/i), testValidEmail);
    });

    act(() => {
      userEvent.click(getByText(/submit/i));
    });

    // Submtiting
    expect(getByText(/sending/i)).toBeDisabled();

    await act(async () => {
      await userEvent.click(getByText(/sending/i));
    });

    // Submitted successfully
    expect(getByText(/submit/i)).toBeInTheDocument();
    expect(getByText(/submit/i)).not.toBeDisabled();

    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/', testValidRequest);
    expect(spiedConsoleWarn).toHaveBeenCalled();

    expect(getByRole('alert')).toHaveTextContent(/issue with your submission.*test error/i);

    expect(await axe(container)).toHaveNoViolations();
  });

  test('can be disabled via env variables', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ status: 200 }));

    const oldIsSubmitFormEnalbled = process.env.IS_SUBMIT_FORM_ENABLED;
    process.env.IS_SUBMIT_FORM_ENABLED = 'false';

    const { getByText, getByRole, getByTestId, container } = render(
      <NewsletterSubscribe formInstance="test" />
    );

    expect(getByText(/submit/i)).toBeDisabled();
    expect(getByRole('alert')).toHaveTextContent(/this form has been disabled/i);

    expect(await axe(container)).toHaveNoViolations();

    act(() => {
      (getByTestId('newsletter-form') as HTMLFormElement).submit();
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(spiedConsoleWarn).not.toHaveBeenCalled();

    process.env.IS_SUBMIT_FORM_ENABLED = oldIsSubmitFormEnalbled;
  });
});
