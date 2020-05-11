import React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import {
  FacebookIcon,
  InstagramIcon,
  GenericShareIcon,
  MailIcon,
  PinterestIcon,
  PocketIcon,
  TwitterIcon,
  WhatsappIcon,
  OALogoFull,
  OALogoShort,
} from '../';

const sampleClassName = 'test-classname test-classname-two';

const config = [
  { name: 'FacebookIcon', Component: FacebookIcon, title: 'Facebook' },
  { name: 'GenericShareIcon', Component: GenericShareIcon, title: 'Share' },
  { name: 'MailIcon', Component: MailIcon, title: 'Email' },
  { name: 'PinterestIcon', Component: PinterestIcon, title: 'Pinterest' },
  { name: 'PocketIcon', Component: PocketIcon, title: 'Pocket' },
  { name: 'TwitterIcon', Component: TwitterIcon, title: 'Twitter' },
  { name: 'WhatsappIcon', Component: WhatsappIcon, title: 'Whatsapp' },
  { name: 'InstagramIcon', Component: InstagramIcon, title: 'Instagram' },
  { name: 'OALogoFull', Component: OALogoFull, title: 'The Offbeat Appetite' },
  { name: 'OALogoShort', Component: OALogoShort, title: 'The Offbeat Appetite' },
];

config.forEach(({ Component, name, title }) => {
  describe(name, () => {
    test('renders with a valid configuration', async () => {
      const { getByTitle, container } = render(
        <Component idPrefix="test-icon" className={sampleClassName} />
      );

      expect(getByTitle(title)).toBeInTheDocument();
      expect(getByTitle(title).parentElement).toHaveClass(sampleClassName);

      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe('OALogoShort', () => {
  test('`shadow` prop', async () => {
    const { getByTestId, container } = render(<OALogoShort shadow={true} />);

    expect(getByTestId('oa-logo-short-path')).toBeInTheDocument();
    expect(getByTestId('oa-logo-short-path')).toHaveStyle({
      filter: 'url(#offbeatAppetite-logo-short-shadow)',
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
