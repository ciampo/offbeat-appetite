// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import preloadAll from 'jest-next-dynamic';

import {
  beforeLogo as beforeLogoLinks,
  logo as logoLinks,
  afterLogo as afterLogoLinks,
} from '../../../data/navLinks.json';

import { useRouter as mockUseRouter } from 'next/router';

import React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent } from 'offbeat-appetite-render';

import Nav from '../Nav';

import { UiLink } from '../../../typings';

jest.mock('next/router');

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

// To test for:
// - solid variant
// - scroll

describe('Nav', () => {
  test('renders with valid configuration', async () => {
    await preloadAll();

    (mockUseRouter as jest.Mock).mockReturnValue({
      asPath: '/test-before-logo-2',
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    });

    const {
      getByRole,
      getAllByRole,
      getByTestId,
      getAllByTestId,
      getByText,
      getAllByText,
      container,
    } = render(<Nav />);

    const allLinks: UiLink[] = [...beforeLogoLinks, ...logoLinks, ...afterLogoLinks];

    expect(getByTestId('header-nav-wrapper')).toBeInTheDocument();
    expect(getAllByTestId('layout-page-container')).toHaveLength(2);

    expect(getByRole('navigation')).toBeInTheDocument();
    expect(getByRole('list')).toBeInTheDocument();
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByRole('button')).toHaveTextContent('Menu');
    // + 1 For the menu button
    expect(getAllByRole('listitem')).toHaveLength(allLinks.length + 1);
    // + 1 For the skip to content link
    expect(getAllByRole('link')).toHaveLength(allLinks.length + 1);

    expect(getByText('Skip to content')).toBeInTheDocument();
    expect(getByText('Skip to content')).toHaveAttribute('href', '#content');

    // debug();

    for (const link of [...beforeLogoLinks, ...afterLogoLinks] as UiLink[]) {
      for (const linkEl of getAllByText(link.label)) {
        expect(linkEl).toBeInTheDocument();
        expect(linkEl).toHaveAttribute('href', link.as || link.href);

        if (link.href === '/test-before-logo-2') {
          expect(linkEl).toHaveClass('underline');
        }
      }
    }
    for (const link of logoLinks as UiLink[]) {
      for (const linkEl of getAllByText(link.label)) {
        expect(linkEl).toBeInTheDocument();
        expect(linkEl.parentElement).toHaveAttribute('href', link.as || link.href);
      }
    }

    expect(await axe(container)).toHaveNoViolations();

    // Scroll events
    fireEvent.scroll(window);

    // Open menu
    fireEvent.click(getByText('Menu'));

    expect(getByTestId('drawer-menu-wrapper')).toHaveFocus();

    expect(getAllByRole('navigation')).toHaveLength(2);
    expect(getAllByRole('list')).toHaveLength(2);
    expect(getAllByRole('button')).toHaveLength(2);
    expect(getAllByRole('button')[0]).toHaveTextContent('Menu');
    expect(getAllByRole('button')[1]).toHaveTextContent('Close');

    // + 1 For the menu button
    expect(getAllByRole('listitem')).toHaveLength(2 * allLinks.length + 1);
    // + 2 For the skip to content link + repeated home link in the drawer
    expect(getAllByRole('link')).toHaveLength(2 * allLinks.length + 2);

    expect(await axe(container)).toHaveNoViolations();

    getByText('Close').focus();

    fireEvent.keyDown(getByTestId('drawer-menu-wrapper'), {
      key: 'tab',
      code: 'Tab',
      shiftKey: true,
    });
    expect(getAllByText(allLinks[allLinks.length - 1].label)[1]).toHaveFocus();
    fireEvent.keyDown(getByTestId('drawer-menu-wrapper'), {
      key: 'tab',
      code: 'Tab',
      shiftKey: false,
    });
    expect(getByText('Close')).toHaveFocus();

    // Close menu
    fireEvent.keyDown(getByTestId('drawer-menu-wrapper'), {
      key: 'esc',
      code: 'Esc',
    });

    expect(getAllByRole('navigation')).toHaveLength(1);
    expect(getAllByRole('list')).toHaveLength(1);
    expect(getAllByRole('button')).toHaveLength(1);
    // + 1 For the menu button
    expect(getAllByRole('listitem')).toHaveLength(allLinks.length + 1);
    // + 1 For the skip to content link
    expect(getAllByRole('link')).toHaveLength(allLinks.length + 1);
  }, 15000);

  test('drawer shows subscribe link if the subscribe form is in the page', async () => {
    await preloadAll();

    (mockUseRouter as jest.Mock).mockReturnValue({
      asPath: '/test-before-logo-2',
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    });

    const { getAllByRole, getByText, container } = render(
      <>
        <Nav />
        <div id="subscribe" />
      </>
    );

    fireEvent.click(getByText('Menu'));

    const allLinks: UiLink[] = [...beforeLogoLinks, ...logoLinks, ...afterLogoLinks];

    // + 2 For the menu button + subscribe link
    expect(getAllByRole('listitem')).toHaveLength(2 * allLinks.length + 2);
    // + 3 For the skip to content link + subscribe link + repeated home link in the drawer
    expect(getAllByRole('link')).toHaveLength(2 * allLinks.length + 3);

    expect(getByText('Subscribe')).toBeInTheDocument();
    expect(getByText('Subscribe')).toHaveAttribute('href', '#subscribe');

    expect(await axe(container)).toHaveNoViolations();
  }, 15000);
});
