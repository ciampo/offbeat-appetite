import * as React from 'react';
import ReactGA from 'react-ga4';

import { useSharingImageState } from '../meta/sharing-image-context';

import { ButtonSharing } from '../button/Button';

import {
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
  WhatsappIcon,
  MailIcon,
  GenericShareIcon,
  PocketIcon,
  IconProps,
} from '../icons';
import { socialShareLabel } from '../../data/siteMiscContent.json';

const BasicExternalAnchorEl: React.FC<{ href: string }> = React.memo(({ href, ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
));
BasicExternalAnchorEl.displayName = 'memo(BasicExternalAnchorEl)';

type BasicSharingLinkProps = {
  iconPrefix: string;
  platformName: string;
  iconComponent: React.FC<IconProps>;
  className: string;
  href?: string;
  useButton?: boolean;
  onClick?: (event: React.MouseEvent) => void;
};

export type SharingLinkWithMessageProps = {
  link: string;
  message: string;
  iconPrefix: string;
  className?: string;
};

const BasicSharingLink: React.FC<BasicSharingLinkProps> = React.memo(
  ({
    iconPrefix,
    href,
    platformName,
    iconComponent: Icon,
    className,
    useButton = false,
    onClick,
  }) => (
    <ButtonSharing
      sizeClassName=""
      paddingClassName="p-2"
      className={className}
      onClick={(e): void => {
        ReactGA.event({
          category: 'User',
          action: `Interacted with "${platformName}" Share button`,
          label: href ?? '[No url]',
        });
        if (onClick) {
          onClick(e);
        }
      }}
      component={useButton ? undefined : BasicExternalAnchorEl}
      href={href}
    >
      <span className="sr-only">{socialShareLabel.replace(':platformName', platformName)}</span>
      <Icon idPrefix={iconPrefix} role="presentation" className="w-5 h-5 sm:w-6 sm:h-6" />
    </ButtonSharing>
  )
);
BasicSharingLink.displayName = 'memo(BasicSharingLink)';

export const FacebookSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  className,
  iconPrefix,
}) => (
  <BasicSharingLink
    platformName="Facebook"
    href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&display=page`}
    iconComponent={FacebookIcon}
    className={['hover:bg-share-facebook focus:bg-share-facebook', className]
      .filter(Boolean)
      .join(' ')}
    iconPrefix={iconPrefix}
  />
);

export const TwitterSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  message,
  className,
  iconPrefix,
}) => (
  <BasicSharingLink
    platformName="Twitter"
    href={`https://twitter.com/intent/tweet/?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(link)}`}
    iconComponent={TwitterIcon}
    className={['hover:bg-share-twitter focus:bg-share-twitter', className]
      .filter(Boolean)
      .join(' ')}
    iconPrefix={iconPrefix}
  />
);

export const PinterestSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  message,
  className,
  iconPrefix,
}) => {
  const { image } = useSharingImageState();

  return (
    <BasicSharingLink
      platformName="Pinterest"
      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(link)}${
        image ? `&media=${encodeURIComponent(image)}` : ''
      }&description=${encodeURIComponent(message)}`}
      iconComponent={PinterestIcon}
      className={[
        'hover:bg-share-pinterest focus:bg-share-pinterest focus:border-pinterest',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      iconPrefix={iconPrefix}
    />
  );
};

export const WhatsappSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  message,
  className,
  iconPrefix,
}) => (
  <BasicSharingLink
    platformName="Whatsapp"
    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}%20${encodeURIComponent(
      link
    )}`}
    iconComponent={WhatsappIcon}
    className={['hover:bg-share-whatsapp focus:bg-share-whatsapp', className]
      .filter(Boolean)
      .join(' ')}
    iconPrefix={iconPrefix}
  />
);

export const MailSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  message,
  className,
  iconPrefix,
}) => (
  <BasicSharingLink
    platformName="Email"
    href={`mailto:?subject=${encodeURIComponent(message)}&body=${encodeURIComponent(link)}`}
    iconComponent={MailIcon}
    className={['hover:bg-share-mail focus:bg-share-mail', className].filter(Boolean).join(' ')}
    iconPrefix={iconPrefix}
  />
);

export const PocketSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  className,
  iconPrefix,
}) => (
  <BasicSharingLink
    platformName="Pocket"
    href={`https://getpocket.com/edit?url=${encodeURIComponent(link)}`}
    iconComponent={PocketIcon}
    className={['hover:bg-share-pocket focus:bg-share-pocket', className].filter(Boolean).join(' ')}
    iconPrefix={iconPrefix}
  />
);

export const NativeSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  message,
  className,
  iconPrefix,
}) => {
  const onNativeShareButtonClick = React.useCallback(async () => {
    try {
      await (navigator.share as unknown as NavigatorShare)({
        title: message,
        text: message,
        url: link,
      });
    } catch (err) {
      console.error('Error using Native Web Sharing\n\n', err);
    }
  }, [link, message]);

  return navigator.share ? (
    <BasicSharingLink
      platformName="all platforms"
      iconComponent={GenericShareIcon}
      className={['hover:bg-share-mail focus:bg-share-mail', className].filter(Boolean).join(' ')}
      useButton={true}
      onClick={onNativeShareButtonClick}
      iconPrefix={iconPrefix}
    />
  ) : null;
};

export const AllSharingButtons: React.FC<SharingLinkWithMessageProps> = (props) => (
  <>
    <FacebookSharingButton {...props} />
    <PinterestSharingButton {...props} />
    <TwitterSharingButton {...props} />
    <PocketSharingButton {...props} />
    <WhatsappSharingButton {...props} />
    <MailSharingButton {...props} />
    {process.browser && <NativeSharingButton {...props} />}
  </>
);
