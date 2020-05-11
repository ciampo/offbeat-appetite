import React, { memo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

import { PageContentContainer } from '../layouts/Containers';
import { ButtonOliveInverted, ButtonTransparent } from '../button/Button';
import { OALogoShort } from '../icons';

import { UiLink } from '../../typings';

type MenuButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
export const MenuButton: React.FC<MenuButtonProps> = memo(({ onClick }) => (
  <li className="md:hidden -mx-4">
    <ButtonTransparent onClick={onClick} aria-label="Open the navigation menu">
      Menu
    </ButtonTransparent>
  </li>
));
MenuButton.displayName = 'memo(MenuButton)';

type DrawerNavLinkProps = {
  link: UiLink;
  selected: boolean;
  open: boolean;
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  className?: string;
};
const DrawerNavLink: React.FC<DrawerNavLinkProps> = memo(
  ({ link: { href, label, as }, selected, onClick, open, className }) => (
    <motion.li
      variants={{
        exit: {
          y: -10,
          opacity: 0,
        },
        enter: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.4,
            ease: 'easeOut',
          },
        },
      }}
    >
      <Link href={href} scroll={false} as={as}>
        <a
          className={[
            'inline-block text-olive-darker type-heading-4 p-2 xl:px-4 rounded outline-none',
            'transform transition-transform duration-150 ease-out',
            'hover:-translate-y-1',
            'focus:-translate-y-1 focus:bg-olive-light',
            selected ? 'bg-olive-light' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={onClick}
          tabIndex={open ? undefined : -1}
        >
          {label}
        </a>
      </Link>
    </motion.li>
  )
);
DrawerNavLink.displayName = 'memo(DrawerNavLink)';

// TODO:
// - trap focus
type DrawerNavProps = {
  links: UiLink[];
  open: boolean;
  currentRouterPath: string;
  onLinkClick: (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  onCloseButtonClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
export const DrawerNav: React.FC<DrawerNavProps> = ({
  links,
  open,
  onLinkClick,
  onCloseButtonClick,
}) => {
  const router = useRouter();
  const drawerWrapper = useRef<HTMLElement>(null);

  // ESC key closes the menu
  useEffect(() => {
    function closeMenuOnEsc(e: KeyboardEvent): void {
      if (/^esc/i.test(e.key)) {
        onCloseButtonClick();
      }
    }

    if (open) {
      window.addEventListener('keydown', closeMenuOnEsc);
    } else {
      window.removeEventListener('keydown', closeMenuOnEsc);
    }

    return (): void => {
      window.removeEventListener('keydown', closeMenuOnEsc);
    };
  }, [open, onCloseButtonClick]);

  // Focus management
  useEffect(() => {
    if (open && drawerWrapper.current) {
      drawerWrapper.current.focus();
    }

    function wrapFocusOnTabPressed(e: KeyboardEvent): void {
      if (/^tab/i.test(e.key) && drawerWrapper.current) {
        const focusableEls: (HTMLAnchorElement | HTMLButtonElement)[] = Array.prototype.slice.call(
          drawerWrapper.current.querySelectorAll('button, a')
        );

        if (e.shiftKey && document.activeElement === focusableEls[0]) {
          e.preventDefault();
          focusableEls[focusableEls.length - 1].focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === focusableEls[focusableEls.length - 1]
        ) {
          e.preventDefault();
          focusableEls[0].focus();
        }
      }
    }

    if (open) {
      window.addEventListener('keydown', wrapFocusOnTabPressed);
    } else {
      window.removeEventListener('keydown', wrapFocusOnTabPressed);
    }

    return (): void => {
      window.removeEventListener('keydown', wrapFocusOnTabPressed);
    };
  }, [open]);

  return (
    <aside
      tabIndex={-1}
      ref={drawerWrapper}
      className={[
        'fixed z-50 inset-0 w-full h-full bg-gray-white outline-none md:hidden',
        'transition-opacity ease-out',
        open
          ? 'duration-300 opacity-100 pointer-events-auto'
          : 'duration-500 opacity-0 pointer-events-none',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={open ? 'false' : 'true'}
    >
      <PageContentContainer className="relative h-full flex flex-col">
        <div className="relative w-full h-16 flex items-center flex-shrink-0">
          <ButtonOliveInverted
            className="-mx-4 hover:shadow-none focus:shadow-none"
            onClick={onCloseButtonClick}
            tabIndex={open ? undefined : -1}
            aria-label="Close the navigation menu"
          >
            Close
          </ButtonOliveInverted>

          <Link href={links[0].href} scroll={false} as={links[0].as}>
            <a
              className={[
                'block text-olive-darker outline-none border-l-4 border-r-4 rounded border-transparent',
                'absolute transform-translate-center',
                'focus:border-olive-light focus:bg-olive-light',
              ].join(' ')}
              onClick={onLinkClick}
              tabIndex={open ? undefined : -1}
            >
              <span className="sr-only">{links[0].label}</span>
              <OALogoShort className="h-12 md:h-16 xl:h-20" idPrefix="oa-logo-short-drawer" />
            </a>
          </Link>
        </div>

        {open ? (
          <motion.nav
            className="flex flex-col items-center w-full my-auto overflow-y-auto"
            initial="exit"
            animate="enter"
            exit="exit"
            variants={{
              enter: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.3,
                },
              },
            }}
          >
            <ul className="flex flex-col items-center py-2 space-y-1 xsm:space-y-2 sm:space-y-3">
              {links.map((link, index) => (
                <DrawerNavLink
                  key={`${link.as || link.href}-${index}`}
                  selected={router.asPath === (link.as || link.href)}
                  link={link}
                  onClick={onLinkClick}
                  open={open}
                />
              ))}
              <DrawerNavLink
                selected={false}
                link={{ href: '#subscribe-form', label: 'Subscribe' }}
                onClick={onLinkClick}
                open={open}
                className="mt-2 xsm:mt-4 sm:mt-6 border border-current"
              />
            </ul>
          </motion.nav>
        ) : null}
      </PageContentContainer>
    </aside>
  );
};
