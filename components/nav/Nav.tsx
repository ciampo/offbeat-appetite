import React, { memo, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { useNavVariantState } from './nav-variant-context';
import { PageContentContainer } from '../layouts/Containers';
import { ButtonOlive, ButtonTransparent } from '../button/Button';
import { OALogoShort } from '../icons';

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
  beforeLogo: boolean;
  last: boolean;
  selected: boolean;
  link: UiLink;
};
const HeaderNavLink: React.FC<HeaderNavLinkProps> = ({
  link: { href, label, as },
  beforeLogo,
  last,
  selected,
  solid,
}) => (
  <li
    className={[
      'hidden md:inline-block',
      beforeLogo
        ? last
          ? '-ml-6 mr-auto'
          : '-ml-6 mr-6 lg:mr-8 xl:mr-6'
        : '-mr-6 ml-6 lg:ml-8 xl:ml-6',
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
    <li className="absolute transform-translate-center">
      <ButtonTransparent
        component={BasicLinkEl}
        sizeClassName=""
        paddingClassName="py-0 px-1"
        additionalHover="scaleUp"
        href={href}
        as={as}
      >
        <span className="sr-only">{label}</span>
        <OALogoShort
          className="h-12 md:h-16 xl:h-20"
          idPrefix="oa-logo-short-haeder"
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
            'focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:mt-16 md:focus:mt-20 xl:focus:mt-24 focus:px-4 focus:py-3 xl:focus:px-6 xl:focus:py-4',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          Skip to content
        </ButtonOlive>

        <PageContentContainer
          component={BasicNavEl}
          className="relative h-16 md:h-20 xl:h-24 overflow-hidden flex items-center contain-s"
        >
          <ul className="flex items-center h-full w-full">
            <MenuButton onClick={openDrawer} />

            {(beforeLogoLinks as UiLink[]).map((link, index, array) => (
              <HeaderNavLink
                key={`${index}-${link.as || link.href}`}
                link={link}
                beforeLogo={true}
                solid={isSolid}
                last={index === array.length - 1}
                selected={router.asPath === (link.as || link.href)}
              />
            ))}

            <HeaderLogoLink link={logoLinks[0] as UiLink} solid={isSolid} />

            {(afterLogoLinks as UiLink[]).map((link, index, array) => (
              <HeaderNavLink
                key={`${index}-${link.href}`}
                link={link}
                beforeLogo={false}
                solid={isSolid}
                last={index === array.length - 1}
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
