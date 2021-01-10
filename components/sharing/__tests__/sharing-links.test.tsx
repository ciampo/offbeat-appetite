import * as React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent, waitFor } from 'offbeat-appetite-render';

import { socialShareLabel } from '../../../data/siteMiscContent.json';

import {
  SharingLinkWithMessageProps,
  FacebookSharingButton,
  TwitterSharingButton,
  MailSharingButton,
  PinterestSharingButton,
  PocketSharingButton,
  WhatsappSharingButton,
  NativeSharingButton,
  AllSharingButtons,
} from '../sharing-links';

const testSharingData: SharingLinkWithMessageProps = {
  link: 'https://test.com',
  message: 'test message',
  className: 'test-classname',
  iconPrefix: 'test-icon-social',
};

const standardSharingLinks = [
  {
    name: 'Facebook',
    Component: FacebookSharingButton,
    generateLink: ({ link }: SharingLinkWithMessageProps): string =>
      `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&display=page`,
    activeBgClassname: 'bg-share-facebook',
  },
  {
    name: 'Twitter',
    Component: TwitterSharingButton,
    generateLink: ({ message, link }: SharingLinkWithMessageProps): string =>
      `https://twitter.com/intent/tweet/?text=${encodeURIComponent(
        message
      )}&url=${encodeURIComponent(link)}`,
    activeBgClassname: 'bg-share-twitter',
  },
  {
    name: 'Pinterest',
    Component: PinterestSharingButton,
    generateLink: ({ message, link }: SharingLinkWithMessageProps): string =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        link
      )}&description=${encodeURIComponent(message)}`,
    activeBgClassname: 'bg-share-pinterest',
  },
  {
    name: 'Pocket',
    Component: PocketSharingButton,
    generateLink: ({ link }: SharingLinkWithMessageProps): string =>
      `https://getpocket.com/edit?url=${encodeURIComponent(link)}`,
    activeBgClassname: 'bg-share-pocket',
  },
  {
    name: 'Whatsapp',
    Component: WhatsappSharingButton,
    generateLink: ({ message, link }: SharingLinkWithMessageProps): string =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}%20${encodeURIComponent(
        link
      )}`,
    activeBgClassname: 'bg-share-whatsapp',
  },
  {
    name: 'Email',
    Component: MailSharingButton,
    generateLink: ({ message, link }: SharingLinkWithMessageProps): string =>
      `mailto:?subject=${encodeURIComponent(message)}&body=${encodeURIComponent(link)}`,
    activeBgClassname: 'bg-share-mail',
  },
];

describe('Classic Sharing Links', () => {
  for (const { name, Component, generateLink, activeBgClassname } of standardSharingLinks) {
    test(`${name} Sharing Link renders correctly`, async () => {
      const { container, getByText, getByRole } = render(<Component {...testSharingData} />);

      const span = getByText(socialShareLabel.replace(':platformName', name));
      const link = span.closest('a');
      const svg = getByRole('presentation');

      expect(link).toHaveAttribute('href', generateLink(testSharingData));
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link?.className).toMatch(`focus:${activeBgClassname}`);
      expect(link?.className).toMatch(`hover:${activeBgClassname}`);

      expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');

      expect(await axe(container)).toHaveNoViolations();
    });
  }
});

describe('Native Web Sharing Button', () => {
  let spiedConsoleError: jest.SpyInstance;
  let navigatorSpy: jest.SpyInstance;
  beforeAll(() => {
    // Create a spy on console (console.log in this case) and provide some mocked implementation
    // In mocking global objects it's usually better than simple `jest.fn()`
    // because you can `unmock` it in clean way doing `mockRestore`
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    spiedConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    navigatorSpy = jest.spyOn(window, 'navigator', 'get');
  });
  afterAll(() => {
    // Restore mock after all tests are done, so it won't affect other test suites
    jest.restoreAllMocks();
  });
  beforeEach(() => {
    // Clear mock (all calls etc) after each test.
    // It's needed when you're using console somewhere in the tests so you have clean mock each time
    jest.clearAllMocks();
  });

  test(`renders correctly when window.navigator.share executes correctly`, async () => {
    const shareMock = jest.fn();
    navigatorSpy.mockImplementation(() => ({
      share: shareMock,
    }));

    const { container, getByText, getByRole } = render(
      <NativeSharingButton {...testSharingData} />
    );

    const span = getByText(socialShareLabel.replace(':platformName', 'all platforms'));
    const button = getByRole('button');
    const svg = getByRole('presentation');

    expect(span).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button.className).toMatch(`focus:bg-share-mail`);
    expect(button.className).toMatch(`hover:bg-share-mail`);

    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');

    expect(await axe(container)).toHaveNoViolations();

    fireEvent.click(button as HTMLButtonElement);

    await waitFor(() =>
      expect(shareMock).toHaveBeenCalledWith({
        title: testSharingData.message,
        text: testSharingData.message,
        url: testSharingData.link,
      })
    );
    expect(shareMock).toHaveBeenCalledTimes(1);
  });

  test(`logs an error when window.navigator.share fails executing`, async () => {
    const shareMockRejecting = jest.fn().mockRejectedValueOnce({});
    navigatorSpy.mockImplementation(() => ({
      share: shareMockRejecting,
    }));

    const { getByRole } = render(<NativeSharingButton {...testSharingData} />);

    const button = getByRole('button');
    fireEvent.click(button as HTMLButtonElement);

    await waitFor(() => expect(spiedConsoleError).toHaveBeenCalledTimes(1));

    expect(shareMockRejecting).toHaveBeenCalledWith({
      title: testSharingData.message,
      text: testSharingData.message,
      url: testSharingData.link,
    });
    expect(shareMockRejecting).toHaveBeenCalledTimes(1);
  });

  test(`doesn't render when window.navigator.share is not supported`, async () => {
    navigatorSpy.mockImplementation(() => ({
      share: undefined,
    }));

    const { queryByText, queryByRole } = render(<NativeSharingButton {...testSharingData} />);

    const span = queryByText(socialShareLabel.replace(':platformName', 'all platforms'));
    const button = queryByRole('button');
    const svg = queryByRole('presentation');

    expect(span).not.toBeInTheDocument();
    expect(button).not.toBeInTheDocument();
    expect(svg).not.toBeInTheDocument();
  });
});

describe('All Sharing Links', () => {
  let shareMock: jest.SpyInstance;

  beforeAll(() => {
    // Create a spy on console (console.log in this case) and provide some mocked implementation
    // In mocking global objects it's usually better than simple `jest.fn()`
    // because you can `unmock` it in clean way doing `mockRestore`
    shareMock = jest.fn().mockResolvedValue({});
    // @ts-ignore
    jest.spyOn(window, 'navigator', 'get').mockImplementation(() => ({
      share: shareMock,
    }));
  });
  afterAll(() => {
    // Restore mock after all tests are done, so it won't affect other test suites
    jest.restoreAllMocks();
  });
  beforeEach(() => {
    // Clear mock (all calls etc) after each test.
    // It's needed when you're using console somewhere in the tests so you have clean mock each time
    jest.clearAllMocks();
  });

  test(`renders all Sharing Links, but doesn't render the Web Native Sharing Button when SSR'ing`, async () => {
    const { getAllByText } = render(<AllSharingButtons {...testSharingData} />);

    const spans = getAllByText(new RegExp(socialShareLabel.replace(':platformName', '')));

    expect(spans).toHaveLength(standardSharingLinks.length);
  });

  test(`renders all Sharing Links including the Web Native Sharing Button when in the browser`, async () => {
    Object.defineProperty(process, 'browser', {
      value: true,
    });

    const { getAllByText } = render(<AllSharingButtons {...testSharingData} />);

    const spans = getAllByText(new RegExp(socialShareLabel.replace(':platformName', '')));

    expect(spans).toHaveLength(standardSharingLinks.length + 1);
  });
});
