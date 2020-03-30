import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextComponentType } from 'next';

import { UiLink } from '../../typings';
import { beforeLogo, logo, afterLogo } from '../../data/navLinks.json';

import styles from './nav.module.css';

const Nav: NextComponentType = () => {
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleRouteChange(url: string): void {
      setLoadingRoute(url);
    }

    function handleRouteComplete(): void {
      setLoadingRoute(null);
    }

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);

    return (): void => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
  }, [router.events]);

  const navLinks: UiLink[] = [...beforeLogo, ...logo, ...afterLogo];

  return (
    <>
      <nav className="z-50 fixed top-0 left-0 w-full h-12 flex items-center bg-gray-200 shadow text-center contain-layout-paint">
        {navLinks && navLinks.length && (
          <ul className="flex justify-between w-full py-1 px-4">
            {navLinks.map(({ href, label, as }, index) => (
              <li key={`${index}-${href}`} className="flex py-1 px-2">
                <Link href={href} scroll={false} as={as}>
                  <a
                    className={`outline-none no-underline text-sm text-primary focus:border-primary  contain-layout-paint ${
                      styles.navLink
                    } ${router.asPath === (as ? as : href) ? styles.navLinkSelected : ''} ${
                      loadingRoute === href ? styles.navLinkLoading : ''
                    }`}
                  >
                    {label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </>
  );
};

export default Nav;