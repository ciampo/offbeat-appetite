import React, { memo } from 'react';

import Link from 'next/link';

import { PageContentContainer } from '../layouts/Containers';
import { ButtonTransparent } from '../button/Button';
import { OALogoFull, FacebookIcon, PinterestIcon, InstagramIcon, IconProps } from '../icons';

import {
  beforeLogo as beforeLogoLinks,
  logo as logoLinks,
  afterLogo as afterLogoLinks,
} from '../../data/navLinks.json';

import { socialLinks } from '../../data/siteMiscContent.json';

import { UiLink, SanitySocialLink } from '../../typings';

const BasicLinkEl: React.FC<{ href: string; as: string }> = memo(
  ({ href, as, ...props }): JSX.Element => (
    <Link href={href} as={as}>
      <a {...props} />
    </Link>
  )
);
BasicLinkEl.displayName = 'memo(BasicLinkEl)';

const BasicExternalAnchorEl: React.FC<{ href: string }> = memo(({ href, ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
));
BasicExternalAnchorEl.displayName = 'memo(BasicExternalAnchorEl)';

type FooterSiteLinkProps = {
  link: UiLink;
};
const FooterSiteLink: React.FC<FooterSiteLinkProps> = ({ link: { href, label, as } }) => (
  <li>
    <ButtonTransparent
      component={BasicLinkEl}
      additionalHover="underline"
      typeClassName="type-body"
      paddingClassName="py-2 px-4"
      sizeClassName=""
      href={href}
      as={as}
    >
      {label}
    </ButtonTransparent>
  </li>
);

type FooterSocialLinkProps = {
  link: SanitySocialLink;
  emptySpaceBelow?: boolean;
};

const platformIcons = {
  facebook: FacebookIcon,
  pinterest: PinterestIcon,
  instagram: InstagramIcon,
};

const FooterSocialLink: React.FC<FooterSocialLinkProps> = ({ link: { platform, label, url } }) => {
  const Icon = (platformIcons[platform] as React.FC<IconProps>) || null;

  return (
    <li>
      <ButtonTransparent
        component={BasicExternalAnchorEl}
        paddingClassName="p-2 md:p-3"
        sizeClassName=""
        href={url}
      >
        <span className="sr-only">{label}</span>
        <Icon idPrefix="footer-social" className="w-6 md:w-8" />
      </ButtonTransparent>
    </li>
  );
};

const Footer: React.FC = memo(() => (
  <footer className="bg-olive-darker" data-testid="site-footer-wrapper" id="site-footer">
    <PageContentContainer className="py-12 sm:py-16 md:py-20 xl:py-24 -mb-4 flex flex-col items-center sm:flex-wrap sm:flex-row sm:justify-center">
      {/* logo */}
      <OALogoFull
        idPrefix="footer-logo-full"
        className="order-1 w-48 xsm:w-56 sm:w-64 text-gray-white sm:-mt-2 sm:mr-4"
      />

      {/* site links */}
      <nav className="order-3 sm:order-2 self-stretch mt-4 sm:mt-0 sm:w-56 xl:w-64">
        <ul className="flex flex-col flex-wrap items-start justify-start content-center sm:content-end h-48">
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
        {(socialLinks as SanitySocialLink[]).map((link) => (
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
));
Footer.displayName = 'memo(Footer)';

export default Footer;
