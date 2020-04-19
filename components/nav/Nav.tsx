import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextComponentType } from 'next';

import { UiLink } from '../../typings';
import { beforeLogo, logo, afterLogo } from '../../data/navLinks.json';

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
                    className={[
                      'relative no-underline text-sm text-primary contain-layout-paint',
                      'after:empty-content after:opacity-0 after:absolute after:z-10 after:w-full after:h-px after:left-0 after:bottom-0 after:bg-current after:origin-top-left after:transition-opacity after:duration-300 after:ease-out',
                      router.asPath === (as ? as : href) ? 'after:delay-100 after:opacity-100' : '',
                      loadingRoute === href
                        ? 'after:opacity-100 after:animation-loadinglink after:animation-2s after:animation-infinite after:animation-ease-out'
                        : '',
                    ]
                      .join(' ')
                      .trim()}
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
