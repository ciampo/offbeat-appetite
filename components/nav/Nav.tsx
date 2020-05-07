import React, { memo, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { PageContentContainer } from '../layouts/Containers';
import { OALogoShort } from '../icons';

import {
  beforeLogo as beforeLogoLinks,
  logo as logoLinks,
  afterLogo as afterLogoLinks,
} from '../../data/navLinks.json';

import { UiLink } from '../../typings';

const PageLoadingBar = dynamic(() => import('./PageLoadingBar'), { ssr: false });

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const DrawerNav = dynamic(() => import('./DrawerMenu').then((mod) => mod.DrawerNav), {
  ssr: false,
});
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const MenuButton = dynamic(() => import('./DrawerMenu').then((mod) => mod.MenuButton), {
  ssr: false,
});

export type NavVariant = 'solid' | 'transparent';

type HeaderNavLinkProps = {
  shadow?: boolean;
  beforeLogo: boolean;
  last: boolean;
  selected: boolean;
  link: UiLink;
};
const HeaderNavLink: React.FC<HeaderNavLinkProps> = memo(
  ({ link: { href, label, as }, beforeLogo, last, selected, shadow = false }) => (
    <li
      className={[
        'hidden md:inline-block',
        beforeLogo
          ? last
            ? '-ml-2 xl:-ml-4 mr-auto'
            : '-ml-2 mr-1 lg:mr-2 xl:-ml-4 xl:mr-4'
          : '-mr-2 ml-1 lg:ml-2 xl:-mr-4 xl:ml-4',
      ].join(' ')}
    >
      <Link href={href} scroll={false} as={as}>
        <a
          className={[
            'block text-gray-white type-heading-4 p-2 xl:px-4 rounded outline-none',
            shadow ? 'text-shadow' : false,
            'transform transition-transform duration-150 ease-out',
            'hover:-translate-y-1',
            'focus:-translate-y-1 focus:bg-olive-dark',
            selected ? 'bg-olive-dark' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </a>
      </Link>
    </li>
  )
);
HeaderNavLink.displayName = 'memo(HeaderNavLink)';

type HeaderLogoLinkProps = {
  shadow?: boolean;
  link: UiLink;
};
const HeaderLogoLink: React.FC<HeaderLogoLinkProps> = ({
  link: { href, label, as },
  shadow = false,
}) => (
  <li className="absolute transform-translate-center">
    <Link href={href} scroll={false} as={as}>
      <a
        className={[
          'block text-gray-white outline-none border-l-4 border-r-4 rounded border-transparent',
          'transform transition-transform duration-150 ease-out',
          'hover:scale-105',
          'focus:scale-105 focus:border-olive-dark focus:bg-olive-dark',
        ].join(' ')}
      >
        <span className="sr-only">{label}</span>
        <OALogoShort className="h-12 md:h-16 xl:h-20" shadow={shadow} />
      </a>
    </Link>
  </li>
);

const HeaderNav: React.FC = () => {
  const [variant] = useState<NavVariant>('transparent');
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <>
      <div
        className={[
          'z-50 fixed top-0 left-0 w-full contain-l transition-all duration-300 ease-out',
          variant === 'solid' ? 'bg-olive-darker shadow-md' : 'bg-transparent',
        ].join(' ')}
      >
        <a
          className={[
            'z-50 sr-only',
            'bg-olive-dark text-gray-white type-heading-4 rounded-br outline-none',
            'focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:mt-16 md:focus:mt-20 xl:focus:mt-24 focus:px-4 focus:py-3 xl:focus:px-6 xl:focus:py-4',
          ].join(' ')}
          href="#content"
        >
          Skip to content
        </a>

        <PageContentContainer
          component={(props: { [key: string]: unknown }): JSX.Element => <nav {...props} />}
          className="relative h-16 md:h-20 xl:h-24 overflow-hidden flex items-center"
        >
          <ul className="flex items-center h-full w-full">
            <MenuButton onClick={openDrawer} />

            {(beforeLogoLinks as UiLink[]).map((link, index, array) => (
              <HeaderNavLink
                key={`${index}-${link.href}`}
                link={link}
                beforeLogo={true}
                shadow={variant === 'transparent'}
                last={index === array.length - 1}
                selected={router.asPath === (link.as || link.href)}
              />
            ))}

            <HeaderLogoLink link={logoLinks[0] as UiLink} shadow={variant === 'transparent'} />

            {(afterLogoLinks as UiLink[]).map((link, index, array) => (
              <HeaderNavLink
                key={`${index}-${link.href}`}
                link={link}
                beforeLogo={false}
                shadow={variant === 'transparent'}
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
