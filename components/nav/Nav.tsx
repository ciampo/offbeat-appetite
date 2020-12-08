import React, { memo, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { useNavVariantState } from './nav-variant-context';
import { PageContentContainer } from '../layouts/Containers';
import { ButtonOlive, ButtonTransparent } from '../button/Button';
import { /*OALogoShort,*/ OALogoFull } from '../icons';

import {
  beforeLogo as beforeLogoLinks,
  logo as logoLinks,
  afterLogo as afterLogoLinks,
} from '../../data/navLinks.json';

import { UiLink } from '../../typings';

const PageLoadingBar = dynamic(() => import('./PageLoadingBar'), { ssr: false });

// @ts-ignore
const DrawerNav = dynamic(() => import('./DrawerMenu').then((mod) => mod.DrawerNav), {
  ssr: false,
});
// @ts-ignore
const MenuButton = dynamic(() => import('./DrawerMenu').then((mod) => mod.MenuButton), {
  ssr: false,
});

const BasicAnchorEl: React.FC = memo((props) => <a {...props} href="#site-content" />);
BasicAnchorEl.displayName = 'memo(BasicAnchorEl)';

const BasicLinkEl: React.FC<{ href: string; as: string }> = memo(
  ({ href, as, ...props }): JSX.Element => (
    <Link href={href} as={as}>
      <a {...props} />
    </Link>
  )
);
BasicLinkEl.displayName = 'memo(BasicLinkEl)';

const BasicNavEl: React.FC = memo((props) => <nav {...props} aria-label="Header navigation" />);
BasicNavEl.displayName = 'memo(BasicNavEl)';

type HeaderNavLinkProps = {
  solid: boolean;
  first: boolean;
  selected: boolean;
  link: UiLink;
};
const HeaderNavLink: React.FC<HeaderNavLinkProps> = ({
  link: { href, label, as },
  first,
  selected,
  solid,
}) => (
  <li
    className={[
      'hidden md:inline-block -mr-2 xl:-mr-4 -mb-4',
      first ? 'ml-auto' : 'ml-6 lg:ml-8 xl:ml-6',
    ].join(' ')}
  >
    <ButtonTransparent
      component={BasicLinkEl}
      additionalHover="underline"
      paddingClassName="p-2 xl:px-4"
      sizeClassName=""
      typeClassName="type-body-large"
      className={[selected && 'underline', !solid && 'text-shadow'].filter(Boolean).join(' ')}
      href={href}
      as={as}
    >
      {label}
    </ButtonTransparent>
  </li>
);

type HeaderLogoLinkProps = {
  solid: boolean;
  link: UiLink;
};
const HeaderLogoLink: React.FC<HeaderLogoLinkProps> = memo(
  ({ link: { href, label, as }, solid }) => (
    <li className="mr-auto">
      <ButtonTransparent
        component={BasicLinkEl}
        sizeClassName=""
        paddingClassName="p-2"
        className="-ml-2 -mb-2 border-none"
        href={href}
        as={as}
      >
        <span className="sr-only">{label}</span>
        {/* <OALogoShort
          className="h-12 md:h-16 xl:h-20"
          idPrefix="oa-logo-short-header"
          shadow={!solid}
        /> */}
        <OALogoFull
          className="h-24 md:h-28 xl:h-32"
          idPrefix="oa-logo-full-header"
          shadow={!solid}
        />
      </ButtonTransparent>
    </li>
  )
);
HeaderLogoLink.displayName = 'memo(HeaderLogoLink)';

const HeaderNav: React.FC = () => {
  const variant = useNavVariantState();
  const [isPageScrolled, setPageScrolled] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  useEffect(() => {
    function onScroll(): void {
      const isPageBelowScrollThreshold = window.scrollY >= 10;

      if (isPageScrolled && !isPageBelowScrollThreshold) {
        setPageScrolled(false);
      } else if (!isPageScrolled && isPageBelowScrollThreshold) {
        setPageScrolled(true);
      }
    }

    window.addEventListener('scroll', onScroll);

    // Check scroll position when component it mounted
    // e.g. in case the page is already scrolled down
    onScroll();

    return (): void => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isPageScrolled, setPageScrolled]);

  const isSolid = variant === 'solid' || isPageScrolled;

  return (
    <>
      <div
        className={[
          'z-50 fixed top-0 left-0 w-full contain-l will-change-transform transition-bg-color-transform duration-300 ease-out',
          isSolid ? 'bg-olive-darker shadow-md' : 'bg-transparent',
        ].join(' ')}
        data-testid="header-nav-wrapper"
        id="site-header"
      >
        <ButtonOlive
          component={BasicAnchorEl}
          additionalHover="underline"
          paddingClassName=""
          sizeClassName=""
          disableTransitions={true}
          className={[
            'z-50 sr-only',
            'focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:px-4 focus:py-3 xl:focus:px-6 xl:focus:py-4',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          Skip to content
        </ButtonOlive>

        <PageContentContainer
          component={BasicNavEl}
          className="relative h-32 md:h-40 xl:h-48 overflow-hidden flex items-center contain-s"
        >
          <ul className="flex items-end h-full w-full pb-5 md:pb-7 xl:pb-8">
            <HeaderLogoLink link={logoLinks[0] as UiLink} solid={isSolid} />

            <MenuButton onClick={openDrawer} />

            {([...beforeLogoLinks, ...afterLogoLinks] as UiLink[]).map((link, index) => (
              <HeaderNavLink
                key={`${index}-${link.as || link.href}`}
                link={link}
                solid={isSolid}
                first={index === 0}
                selected={router.asPath === (link.as || link.href)}
              />
            ))}
          </ul>
        </PageContentContainer>
        <PageLoadingBar className="z50 absolute top-0 inset-0" />
      </div>

      {/* Drawer */}
      <DrawerNav
        open={isDrawerOpen}
        onLinkClick={(): void => {
          setTimeout(closeDrawer, 300);
        }}
        onCloseButtonClick={closeDrawer}
        links={[...logoLinks, ...beforeLogoLinks, ...afterLogoLinks] as UiLink[]}
      />
    </>
  );
};

export default HeaderNav;
