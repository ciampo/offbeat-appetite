import * as React from 'react';
import { axe } from 'jest-axe';
import { render } from '../../../test/offbeat-appetite-render';

import Footer from '../Footer';

import {
  beforeLogo as beforeLogoLinks,
  logo as logoLinks,
  afterLogo as afterLogoLinks,
} from '../../../data/navLinks.json';

import { socialLinks } from '../../../data/siteMiscContent.json';

import { UiLink } from '../../../typings';

jest.mock('../../../data/navLinks.json', () => ({
  beforeLogo: [
    {
      href: '/test-before-logo-1',
      label: 'Test before logo link 1',
    },
    {
      href: '/test-before-logo-2',
      label: 'Test before logo link 2',
    },
    {
      href: '/[categoryId]',
      as: '/test-category-id',
      label: 'Test category',
    },
  ],
  logo: [
    {
      href: '/test-logo-href',
      label: 'HUZZA',
    },
  ],
  afterLogo: [
    {
      href: '/test-after-logo-link',
      label: 'Test after logo link',
    },
  ],
}));

jest.mock('../../../data/siteMiscContent.json', () => ({
  socialLinks: [
    {
      _key: '41771fe6951d',
      label: 'Test Instagram',
      platform: 'instagram',
      url: 'https://instagram.com/test',
    },
    {
      _key: 'aa1163c589d4',
      label: 'Test Facebook',
      platform: 'facebook',
      url: 'https://www.facebook.com/test/',
    },
    {
      _key: '41947e9ddd32',
      label: 'Test Pinterest',
      platform: 'pinterest',
      url: 'https://pinterest.com/test',
    },
  ],
}));

describe('Footer', () => {
  test('renders with valid configuration', async () => {
    const { getByRole, getAllByRole, getByTestId, getByText, container } = render(<Footer />);

    expect(getByTestId('site-footer-wrapper')).toBeInTheDocument();
    expect(getByRole('navigation')).toBeInTheDocument();

    // +1 because of author's website
    expect(getAllByRole('link')).toHaveLength(
      [...beforeLogoLinks, ...logoLinks, ...afterLogoLinks, ...socialLinks].length + 1
    );

    for (const link of [...beforeLogoLinks, ...logoLinks, ...afterLogoLinks] as UiLink[]) {
      expect(getByText(link.label)).toBeInTheDocument();
      expect(getByText(link.label)).toHaveAttribute('href', link.as || link.href);
    }

    for (const link of socialLinks) {
      expect(getByText(link.label)).toBeInTheDocument();
      expect(getByText(link.label).parentElement).toHaveAttribute('href', link.url);
    }

    expect(await axe(container)).toHaveNoViolations();
  });
});
