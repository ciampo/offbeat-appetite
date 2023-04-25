import * as React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent } from '../../../test/offbeat-appetite-render';
import userEvent from '@testing-library/user-event';

import { TextInputPink, EmailInputPink } from '../Input';

const testLabel = 'Test input label';
const testName = 'test-name';
const testTextValue = 'Test input value';
const testValidEmailValue = 'email@test.com';
const testInvalidEmailValue = 'notanemail.com';
const testPlaceholder = 'Test input placeholder';
const testClassName = 'test-classname test-classname-two';

const textInputs = [{ name: 'TextInputPink', Component: TextInputPink }];

const emailInputs = [{ name: 'EmailInputPink', Component: EmailInputPink }];

const LabelWrapper: React.FC = ({ children }) => (
  <label>
    {testLabel}
    {children}
  </label>
);

let mockOnInvalid: jest.Mock;
let mockOnInput: jest.Mock;
let mockOnChange: jest.Mock;

beforeAll(() => {
  mockOnInvalid = jest.fn();
  mockOnInput = jest.fn();
  mockOnChange = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
});

textInputs.forEach(({ Component, name }) => {
  describe(name, () => {
    test('renders with a valid configuration', async () => {
      const { getByLabelText, getByRole, container, rerender } = render(
        <Component
          name={testName}
          placeholder={testPlaceholder}
          onInvalid={mockOnInvalid}
          onInput={mockOnInput}
          onChange={mockOnChange}
        />,
        {
          wrapper: LabelWrapper,
        }
      );

      expect(getByLabelText(testLabel)).toBeInTheDocument();
      expect(getByRole('textbox')).toBeInTheDocument();

      expect(getByRole('textbox')).toHaveAttribute('name', testName);
      expect(getByRole('textbox')).toHaveAttribute('placeholder', testPlaceholder);
      expect(getByRole('textbox')).toHaveAttribute('type', 'text');
      expect(getByRole('textbox')).toHaveValue('');

      (getByRole('textbox') as HTMLInputElement).checkValidity();
      expect(mockOnInvalid).not.toHaveBeenCalled();

      expect(await axe(container)).toHaveNoViolations();

      await userEvent.type(getByRole('textbox'), testTextValue);

      expect(getByRole('textbox')).toHaveValue(testTextValue);
      expect(mockOnInput).toHaveBeenCalled();
      expect(mockOnInput).toHaveBeenCalledTimes(testTextValue.length);
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledTimes(testTextValue.length);
      expect(mockOnInvalid).not.toHaveBeenCalled();

      (getByRole('textbox') as HTMLInputElement).checkValidity();
      expect(mockOnInvalid).not.toHaveBeenCalled();

      rerender(
        <Component
          name={testName}
          placeholder={testPlaceholder}
          onInvalid={mockOnInvalid}
          onInput={mockOnInput}
          onChange={mockOnChange}
          required={true}
        />
      );

      expect(getByRole('textbox')).toHaveAttribute('required');

      (getByRole('textbox') as HTMLInputElement).checkValidity();
      expect(mockOnInvalid).not.toHaveBeenCalled();

      // TODO: tmp fix while waiting for https://github.com/testing-library/user-event/pull/250
      // @ts-ignore
      await userEvent.clear(getByRole('textbox'));

      expect(getByRole('textbox')).toHaveValue('');
      expect(mockOnInvalid).not.toHaveBeenCalled();

      (getByRole('textbox') as HTMLInputElement).checkValidity();
      expect(mockOnInvalid).toHaveBeenCalled();
      expect(mockOnInvalid).toHaveBeenCalledTimes(1);
    });
  });
});

emailInputs.forEach(({ Component, name }) => {
  describe(name, () => {
    test('renders with a valid configuration', async () => {
      const { getByLabelText, getByRole, container, rerender } = render(
        <Component
          name={testName}
          placeholder={testPlaceholder}
          onInvalid={mockOnInvalid}
          onInput={mockOnInput}
          onChange={mockOnChange}
        />,
        {
          wrapper: LabelWrapper,
        }
      );

      expect(getByLabelText(testLabel)).toBeInTheDocument();
      expect(getByRole('textbox')).toBeInTheDocument();

      expect(getByRole('textbox')).toHaveAttribute('name', testName);
      expect(getByRole('textbox')).toHaveAttribute('placeholder', testPlaceholder);
      expect(getByRole('textbox')).toHaveAttribute('type', 'email');
      expect(getByRole('textbox')).toHaveValue('');

      (getByRole('textbox') as HTMLInputElement).checkValidity();
      expect(mockOnInvalid).not.toHaveBeenCalled();

      expect(await axe(container)).toHaveNoViolations();

      await userEvent.type(getByRole('textbox'), testInvalidEmailValue);

      expect(getByRole('textbox')).toHaveValue(testInvalidEmailValue);
      expect(mockOnInput).toHaveBeenCalled();
      expect(mockOnInput).toHaveBeenCalledTimes(testInvalidEmailValue.length);
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledTimes(testInvalidEmailValue.length);
      expect(mockOnInvalid).not.toHaveBeenCalled();

      (getByRole('textbox') as HTMLInputElement).checkValidity();
      expect(mockOnInvalid).toHaveBeenCalled();
      expect(mockOnInvalid).toHaveBeenCalledTimes(1);

      // For some reason, JSDom doesn not allow text selection on
      // input[type="email"], and therefore userEvent.clear() can't be used
      fireEvent.change(getByRole('textbox'), { target: { value: '' } });

      expect(getByRole('textbox')).toHaveValue('');

      (getByRole('textbox') as HTMLInputElement).checkValidity();
      expect(mockOnInvalid).toHaveBeenCalled();
      expect(mockOnInvalid).toHaveBeenCalledTimes(1);

      mockOnInput.mockClear();
      mockOnChange.mockClear();
      mockOnInvalid.mockClear();

      rerender(
        <Component
          name={testName}
          placeholder={testPlaceholder}
          onInvalid={mockOnInvalid}
          onInput={mockOnInput}
          onChange={mockOnChange}
          required={true}
        />
      );

      expect(getByRole('textbox')).toHaveAttribute('required');

      (getByRole('textbox') as HTMLInputElement).checkValidity();
      expect(mockOnInvalid).toHaveBeenCalled();
      expect(mockOnInvalid).toHaveBeenCalledTimes(1);

      await userEvent.type(getByRole('textbox'), testValidEmailValue);

      expect(getByRole('textbox')).toHaveValue(testValidEmailValue);
      expect(mockOnInput).toHaveBeenCalled();
      expect(mockOnInput).toHaveBeenCalledTimes(testValidEmailValue.length);
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledTimes(testValidEmailValue.length);

      (getByRole('textbox') as HTMLInputElement).checkValidity();
      expect(mockOnInvalid).toHaveBeenCalled();
      expect(mockOnInvalid).toHaveBeenCalledTimes(1);
    });
  });
});

[...textInputs, ...emailInputs].forEach(({ Component, name }) => {
  describe(name, () => {
    test('correctly adds an aria-label', async () => {
      const { container, rerender } = render(
        <Component
          name={testName}
          placeholder={testPlaceholder}
          onInvalid={mockOnInvalid}
          onInput={mockOnInput}
          onChange={mockOnChange}
        />
      );

      expect(await axe(container)).not.toHaveNoViolations();

      rerender(
        <Component
          name={testName}
          placeholder={testPlaceholder}
          onInvalid={mockOnInvalid}
          onInput={mockOnInput}
          onChange={mockOnChange}
          aria-label={testLabel}
        />
      );

      expect(await axe(container)).toHaveNoViolations();
    });

    test('correctly adds custom classnames', async () => {
      const { getByLabelText, container } = render(
        <Component
          name={testName}
          placeholder={testPlaceholder}
          onInvalid={mockOnInvalid}
          onInput={mockOnInput}
          onChange={mockOnChange}
          aria-label={testLabel}
          className={testClassName}
        />
      );

      expect(getByLabelText(testLabel).className).toMatch(testClassName);

      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
