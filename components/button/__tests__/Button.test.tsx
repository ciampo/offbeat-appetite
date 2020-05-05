import React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent } from 'offbeat-appetite-render';

import { ButtonOlive, ButtonPink, ButtonNeutral } from '../Button';

const sampleContent = 'Test button';
const sampleClassName = 'test-classname test-classname-two';

const config = [
  { name: 'ButtonOlive', Component: ButtonOlive },
  { name: 'ButtonPink', Component: ButtonPink },
  { name: 'ButtonNeutral', Component: ButtonNeutral },
];

config.forEach(({ Component, name }) => {
  describe(name, () => {
    test('renders with a valid configuration', async () => {
      const onButtonClick = jest.fn();

      const { getByText, getByRole, container, rerender } = render(
        <Component className={sampleClassName} onClick={onButtonClick}>
          {sampleContent}
        </Component>
      );

      expect(getByRole('button')).toBeInTheDocument();
      expect(getByRole('button').className).toMatch(sampleClassName);
      expect(getByText(sampleContent)).toBeInTheDocument();

      fireEvent.click(getByRole('button'));
      expect(onButtonClick).toHaveBeenCalledTimes(1);

      expect(await axe(container)).toHaveNoViolations();

      onButtonClick.mockClear();
      rerender(<Component disabled={true}>{sampleContent}</Component>);

      expect(getByRole('button')).toHaveAttribute('disabled');

      fireEvent.click(getByRole('button'));
      expect(onButtonClick).not.toHaveBeenCalled();

      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
