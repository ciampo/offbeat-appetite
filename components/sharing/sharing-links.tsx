import React, { useCallback } from 'react';

import { useSharingImageState } from '../meta/sharing-image-context';

import {
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
  WhatsappIcon,
  MailIcon,
  GenericShareIcon,
  PocketIcon,
  SocialIconProps,
} from './icons';
import { socialShareLabel } from '../../data/siteMiscContent.json';

type BasicSharingLinkProps = {
  label: string;
  iconComponent: React.FC<SocialIconProps>;
  className: string;
  href?: string;
  useButton?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => void;
};

export type SharingLinkWithMessageProps = {
  link: string;
  message: string;
  className?: string;
};

const BasicSharingLink: React.FC<BasicSharingLinkProps> = ({
  href,
  label,
  iconComponent: Icon,
  className,
  useButton = false,
  onClick,
}) => {
  const sharingLinkClassName = [
    'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center',
    'text-gray-darker rounded-sm',
    'hover:text-white focus:text-white',
    className,
  ].join(' ');

  const SharingLinkContent: React.FC = () => (
    <>
      <span className="sr-only">{label}</span>
      <Icon role="presentation" className="w-5 h-5 sm:w-6 sm:h-6" />
    </>
  );

  return useButton ? (
    <button className={sharingLinkClassName} onClick={onClick}>
      <SharingLinkContent />
    </button>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={sharingLinkClassName}
      onClick={onClick}
    >
      <SharingLinkContent />
    </a>
  );
};

export const FacebookSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  className,
}) => (
  <BasicSharingLink
    label={socialShareLabel.replace(':platformName', 'Facebook')}
    href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&display=page`}
    iconComponent={FacebookIcon}
    className={['hover:bg-facebook focus:bg-facebook', className].filter(Boolean).join(' ')}
  />
);

export const TwitterSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  message,
  className,
}) => (
  <BasicSharingLink
    label={socialShareLabel.replace(':platformName', 'Twitter')}
    href={`https://twitter.com/intent/tweet/?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(link)}`}
    iconComponent={TwitterIcon}
    className={['hover:bg-twitter focus:bg-twitter', className].filter(Boolean).join(' ')}
  />
);

export const PinterestSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  message,
  className,
}) => {
  const { image } = useSharingImageState();

  return (
    <BasicSharingLink
      label={socialShareLabel.replace(':platformName', 'Pinterest')}
      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(link)}${
        image ? `&media=${encodeURIComponent(image)}` : ''
      }&description=${encodeURIComponent(message)}`}
      iconComponent={PinterestIcon}
      className={['hover:bg-pinterest focus:bg-pinterest focus:border-pinterest', className]
        .filter(Boolean)
        .join(' ')}
    />
  );
};

export const WhatsappSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  message,
  className,
}) => (
  <BasicSharingLink
    label={socialShareLabel.replace(':platformName', 'Whatsapp')}
    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}%20${encodeURIComponent(
      link
    )}`}
    iconComponent={WhatsappIcon}
    className={['hover:bg-whatsapp focus:bg-whatsapp', className].filter(Boolean).join(' ')}
  />
);

export const MailSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  message,
  className,
}) => (
  <BasicSharingLink
    label={socialShareLabel.replace(':platformName', 'Email')}
    href={`mailto:?subject=${encodeURIComponent(message)}&body=${encodeURIComponent(link)}`}
    iconComponent={MailIcon}
    className={['hover:bg-mail focus:bg-mail', className].filter(Boolean).join(' ')}
  />
);

export const PocketSharingButton: React.FC<SharingLinkWithMessageProps> = ({ link, className }) => (
  <BasicSharingLink
    label={socialShareLabel.replace(':platformName', 'Pocket')}
    href={`https://getpocket.com/edit?url=${encodeURIComponent(link)}`}
    iconComponent={PocketIcon}
    className={['hover:bg-pocket focus:bg-pocket', className].filter(Boolean).join(' ')}
  />
);

export const NativeSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  message,
  className,
}) => {
  const onNativeShareButtonClick = useCallback(async () => {
    try {
      await (navigator.share as NavigatorShare)({
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
      label={socialShareLabel.replace(':platformName', 'all platforms')}
      iconComponent={GenericShareIcon}
      className={['hover:bg-mail focus:bg-mail', className].filter(Boolean).join(' ')}
      useButton={true}
      onClick={onNativeShareButtonClick}
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
