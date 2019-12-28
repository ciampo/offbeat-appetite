import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextComponentType } from 'next';

import { slugify } from './utils/utils';
import { UiLink } from '../typings';

type NavProps = {
  links: UiLink[];
};

const Nav: NextComponentType<{}, NavProps, NavProps> = ({ links }) => {
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

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-12 flex items-center bg-gray-200 shadow text-center contain-layout-paint">
        {links && links.length && (
          <ul className="flex justify-between w-full py-1 px-4">
            {links.map(({ href, label }, index) => (
              <li key={`${index}-${slugify(label)}`} className="flex py-1 px-2">
                <Link href={href} scroll={false}>
                  <a
                    className={`outline-none no-underline text-sm text-primary focus:border-primary  contain-layout-paint nav-link ${
                      router.route === href ? 'nav-link--selected' : ''
                    } ${loadingRoute === href ? 'nav-link--loading' : ''}`}
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
