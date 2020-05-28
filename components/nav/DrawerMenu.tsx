import React, { memo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { PageContentContainer } from '../layouts/Containers';
import { ButtonOliveInverted, ButtonTransparent } from '../button/Button';
import { OALogoShort } from '../icons';

import { UiLink } from '../../typings';

const SUBSCRIBE_FORM_ID = 'subscribe';

const BasicLinkEl: React.FC<{ href: string; as: string }> = memo(
  ({ href, as, ...props }): JSX.Element => (
    <Link href={href} as={as}>
      <a {...props} />
    </Link>
  )
);
BasicLinkEl.displayName = 'memo(BasicLinkEl)';

type MenuButtonProps = {
  onClick: (event: React.MouseEvent) => void;
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
  underlineOnHover?: boolean;
  onClick: (event: React.MouseEvent) => void;
  index: number;
  border?: boolean;
  className?: string;
};
const DrawerNavLink: React.FC<DrawerNavLinkProps> = memo(
  ({
    link: { href, label, as },
    selected,
    onClick,
    className,
    index,
    border = false,
    underlineOnHover = false,
  }) => (
    <li>
      <ButtonOliveInverted
        component={BasicLinkEl}
        additionalHover={underlineOnHover ? 'underline' : undefined}
        className={[
          selected && 'underline',
          'will-change-transform-opacity animation-fade-in-down animation-ease-out animation-.5s animation-once animation-fill-both',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          // stagger animation
          animationDelay: `${0.3 + 0.08 * index}s`,
        }}
        onClick={onClick}
        border={border}
        href={href}
        as={as}
      >
        {label}
      </ButtonOliveInverted>
    </li>
  )
);
DrawerNavLink.displayName = 'memo(DrawerNavLink)';

type DrawerNavProps = {
  links: UiLink[];
  open: boolean;
  currentRouterPath: string;
  onLinkClick: (event?: React.MouseEvent) => void;
  onCloseButtonClick: (event?: React.MouseEvent) => void;
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
      data-testid="drawer-menu-wrapper"
    >
      <PageContentContainer className="relative h-full flex flex-col">
        <div className="relative w-full h-16 flex items-center flex-shrink-0">
          {/* CLose button */}
          <ButtonOliveInverted
            className="-mx-4"
            onClick={onCloseButtonClick}
            tabIndex={open ? undefined : -1}
            aria-label="Close the navigation menu"
          >
            Close
          </ButtonOliveInverted>

          {/* OA logo */}
          <ButtonOliveInverted
            component={BasicLinkEl}
            sizeClassName=""
            paddingClassName="py-0 px-1"
            className="absolute transform-translate-center"
            onClick={onLinkClick}
            tabIndex={open ? undefined : -1}
            href={links[0].href}
            as={links[0].as}
          >
            <span className="sr-only">{links[0].label}</span>
            <OALogoShort className="h-12 md:h-16 xl:h-20" idPrefix="oa-logo-short-drawer" />
          </ButtonOliveInverted>
        </div>

        {open ? (
          <nav
            className="flex flex-col items-center w-full my-auto overflow-y-auto"
            aria-label="Drawer navigation"
          >
            <ul className="flex flex-col items-center py-2 space-y-1 xsm:space-y-2 sm:space-y-3">
              {links.map((link, index) => (
                <DrawerNavLink
                  key={`${link.as || link.href}-${index}`}
                  selected={router.asPath === (link.as || link.href)}
                  link={link}
                  onClick={onLinkClick}
                  underlineOnHover={true}
                  index={index}
                />
              ))}
              {document.querySelector(`#${SUBSCRIBE_FORM_ID}`) && (
                <DrawerNavLink
                  selected={false}
                  link={{ href: `#${SUBSCRIBE_FORM_ID}`, label: 'Subscribe' }}
                  onClick={onLinkClick}
                  className="mt-2 xsm:mt-4 sm:mt-6"
                  border={true}
                  index={links.length}
                />
              )}
            </ul>
          </nav>
        ) : null}
      </PageContentContainer>
    </aside>
  );
};
