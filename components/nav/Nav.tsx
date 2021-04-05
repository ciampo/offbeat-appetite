import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { PageContentContainer } from '../layouts/Containers';
import { ButtonOlive, ButtonTransparent } from '../button/Button';
import { OALogoShort, OALogoFull } from '../icons';

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

const BasicAnchorEl: React.FC = React.memo((props) => <a {...props} href="#site-content" />);
BasicAnchorEl.displayName = 'memo(BasicAnchorEl)';

const BasicLinkEl: React.FC<{ href: string; as: string }> = React.memo(
  ({ href, as, ...props }): JSX.Element => (
    <Link href={href} as={as}>
      <a {...props} />
    </Link>
  )
);
BasicLinkEl.displayName = 'memo(BasicLinkEl)';

const BasicNavEl: React.FC = React.memo((props) => (
  <nav {...props} aria-label="Header navigation" />
));
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
      paddingClassName="px-1 py-2 lg:px-2 xl:px-4"
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
  link: UiLink;
  className?: string;
};
const HeaderLogoLink: React.FC<HeaderLogoLinkProps> = React.memo(
  ({ link: { href, label, as }, children, className = '' }) => (
    <li className="mr-auto">
      <ButtonTransparent
        component={BasicLinkEl}
        sizeClassName=""
        paddingClassName="p-2"
        className={['-ml-2 -mb-2 border-none', className].join(' ')}
        href={href}
        as={as}
      >
        <span className="sr-only">{label}</span>
        {children}
      </ButtonTransparent>
    </li>
  )
);
HeaderLogoLink.displayName = 'memo(HeaderLogoLink)';

const HeaderNav: React.FC = () => {
  const [isPageScrolled, setPageScrolled] = React.useState(false);
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const router = useRouter();

  const openDrawer = React.useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const closeDrawer = React.useCallback(() => {
    setDrawerOpen(false);
  }, []);

  React.useEffect(() => {
    function onScroll(): void {
      if (isDrawerOpen) {
        return;
      }

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
  }, [isPageScrolled, setPageScrolled, isDrawerOpen]);

  return (
    <>
      <div
        className={[
          'z-50 fixed top-0 left-0 w-full contain-l transform will-change-transform transition-bg-color-transform duration-300 ease-out',
          isPageScrolled ? 'bg-olive-darker shadow-md' : 'bg-transparent',
          isPageScrolled
            ? '-translate-y-16 md:-translate-y-20 xl:-translate-y-24'
            : 'translate-y-0',
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
          onFocus={(): void => window.scrollTo(0, 0)}
        >
          Skip to content
        </ButtonOlive>

        <PageContentContainer
          component={BasicNavEl}
          className="relative h-32 md:h-40 xl:h-48 overflow-hidden flex items-center contain-s"
        >
          <ul className="flex items-end h-full w-full pb-5 md:pb-7 xl:pb-8">
            {isPageScrolled ? (
              <HeaderLogoLink
                link={logoLinks[0] as UiLink}
                className="transform translate-y-2 md:translate-y-3 xl:translate-y-3"
              >
                <OALogoShort
                  className="h-10 md:h-12 xl:h-14"
                  idPrefix="oa-logo-short-header"
                  shadow={!isPageScrolled}
                />
              </HeaderLogoLink>
            ) : (
              <HeaderLogoLink link={logoLinks[0] as UiLink}>
                <OALogoFull
                  className="h-24 md:h-28 xl:h-32"
                  idPrefix="oa-logo-full-header"
                  shadow={!isPageScrolled}
                />
              </HeaderLogoLink>
            )}

            <MenuButton onClick={openDrawer} />

            {([...beforeLogoLinks, ...afterLogoLinks] as UiLink[]).map((link, index) => (
              <HeaderNavLink
                key={`${index}-${link.as || link.href}`}
                link={link}
                solid={isPageScrolled}
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
        isCompactLayout={isPageScrolled}
      />
    </>
  );
};

export default HeaderNav;
