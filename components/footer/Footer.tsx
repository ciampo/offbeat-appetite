import React, { memo } from 'react';

import Link from 'next/link';

import { PageContentContainer } from '../layouts/Containers';
import { OALogoFull, FacebookIcon, PinterestIcon, MailIcon, InstagramIcon } from '../icons';

import {
  beforeLogo as beforeLogoLinks,
  logo as logoLinks,
  afterLogo as afterLogoLinks,
} from '../../data/navLinks.json';

import { socialLinks } from '../../data/siteMiscContent.json';

import { UiLink } from '../../typings';

type FooterSiteLinkProps = {
  link: UiLink;
};
const FooterSiteLink: React.FC<FooterSiteLinkProps> = memo(({ link: { href, label, as } }) => (
  <li className={['contain-l-p'].filter(Boolean).join(' ')}>
    <Link href={href} scroll={false} as={as}>
      <a
        className={[
          'block text-gray-white type-body py-2 px-4 rounded underline-under',
          'hover:underline hover:bg-olive-dark',
          'focus:underline focus:bg-olive-dark',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </a>
    </Link>
  </li>
));
FooterSiteLink.displayName = 'memo(FooterSiteLink)';

type FooterSocialLinkLink = {
  _key: string;
  label: string;
  platform: 'facebook' | 'instagram' | 'pinterest' | 'email';
  url: string;
};
type FooterSocialLinkProps = {
  link: FooterSocialLinkLink;
  emptySpaceBelow?: boolean;
};
const FooterSocialLink: React.FC<FooterSocialLinkProps> = memo(
  ({ link: { platform, label, url } }) => (
    <li className={['contain-l-p'].filter(Boolean).join(' ')}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          'block text-gray-white p-2 rounded underline-under',
          'hover:underline hover:bg-olive-dark',
          'focus:underline focus:bg-olive-dark',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="sr-only">{label}</span>
        {platform === 'facebook' && (
          <FacebookIcon idPrefix="footer-social" className="w-6 md:w-8" />
        )}
        {platform === 'pinterest' && (
          <PinterestIcon idPrefix="footer-social" className="w-6 md:w-8" />
        )}
        {platform === 'instagram' && (
          <InstagramIcon idPrefix="footer-social" className="w-6 md:w-8" />
        )}
        {platform === 'email' && <MailIcon idPrefix="footer-social" className="w-6 md:w-8" />}
      </a>
    </li>
  )
);
FooterSocialLink.displayName = 'memo(FooterSocialLink)';

const Footer: React.FC<{}> = () => (
  <footer data-testid="site-footer-wrapper" className="md:sticky md:bottom-0 z-0 bg-olive-darker">
    <PageContentContainer className="pb-8 pt-10 sm:pt-12 md:pt-16 xl:pt-20 xl:pb-12 flex flex-col items-center sm:flex-wrap sm:flex-row sm:justify-center">
      {/* logo */}
      <OALogoFull
        idPrefix="footer-logo-full"
        className="order-1 w-48 xsm:w-56 xl:w-64 text-gray-white sm:-mt-2 sm:mr-4"
      />

      {/* site links */}
      <nav className="order-3 sm:order-2 self-stretch mt-4 sm:mt-0 sm:w-56 xl:w-64">
        <ul className="flex flex-col flex-wrap items-start justify-start content-center sm:content-end h-40 xl:h-48">
          {([...logoLinks, ...afterLogoLinks] as UiLink[]).map((link, index) => (
            <FooterSiteLink key={`${index}-${link.as || link.href}`} link={link} />
          ))}
          <li aria-hidden="true" className="flex-break-column"></li>
          {(beforeLogoLinks as UiLink[]).map((link, index) => (
            <FooterSiteLink key={`${index}-${link.as || link.href}`} link={link} />
          ))}
        </ul>
      </nav>

      {/* Line break */}
      <span aria-hidden="true" className="hidden sm:block order-2 flex-break-row"></span>

      {/* social links */}
      <ul className="order-2 sm:order-3 sm:flex-1 sm:justify-center flex space-x-1 sm:space-x-2 xl:space-x-4 mt-6 sm:mt-8 md:mt-10 xl:mt-16">
        {(socialLinks as FooterSocialLinkLink[]).map((link) => (
          <FooterSocialLink key={link._key} link={link} />
        ))}
      </ul>
    </PageContentContainer>
    <PageContentContainer className="border-t border-olive-dark py-6 flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
      <p className="type-footnote text-olive-light self-start">
        ©{new Date().getFullYear()} The Offbeat Appetite.
        <br className="2xsm:hidden" /> All rights Reserved.
        {/* TODO: Add privacy policy */}
      </p>
      <p className="type-footnote text-olive-light self-end">
        Website by{' '}
        <a
          href="https://marcociampini.io?utm_source=offbeatappetite"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Marco Ciampini
        </a>
      </p>
    </PageContentContainer>
  </footer>
);

export default Footer;
