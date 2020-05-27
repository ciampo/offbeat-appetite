import React, { memo, useCallback } from 'react';

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

type BasicSharingLinkProps = {
  label: string;
  iconComponent: React.FC<IconProps>;
  className: string;
  href?: string;
  useButton?: boolean;
  onClick?: (event: React.MouseEvent) => void;
};

export type SharingLinkWithMessageProps = {
  link: string;
  message: string;
  className?: string;
};

const BasicSharingLink: React.FC<BasicSharingLinkProps> = memo(
  ({ href, label, iconComponent: Icon, className, useButton = false, onClick }) => (
    <ButtonSharing
      sizeClassName=""
      paddingClassName="p-2"
      className={className}
      onClick={onClick}
      component={
        useButton
          ? undefined
          : (props: { [key: string]: unknown }): JSX.Element => (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
            )
      }
    >
      <span className="sr-only">{label}</span>
      <Icon role="presentation" className="w-5 h-5 sm:w-6 sm:h-6" />
    </ButtonSharing>
  )
);
BasicSharingLink.displayName = 'memo(BasicSharingLink)';

export const FacebookSharingButton: React.FC<SharingLinkWithMessageProps> = ({
  link,
  className,
}) => (
  <BasicSharingLink
    label={socialShareLabel.replace(':platformName', 'Facebook')}
    href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&display=page`}
    iconComponent={FacebookIcon}
    className={['hover:bg-share-facebook focus:bg-share-facebook', className]
      .filter(Boolean)
      .join(' ')}
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
    className={['hover:bg-share-twitter focus:bg-share-twitter', className]
      .filter(Boolean)
      .join(' ')}
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
      className={[
        'hover:bg-share-pinterest focus:bg-share-pinterest focus:border-pinterest',
        className,
      ]
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
    className={['hover:bg-share-whatsapp focus:bg-share-whatsapp', className]
      .filter(Boolean)
      .join(' ')}
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
    className={['hover:bg-share-mail focus:bg-share-mail', className].filter(Boolean).join(' ')}
  />
);

export const PocketSharingButton: React.FC<SharingLinkWithMessageProps> = ({ link, className }) => (
  <BasicSharingLink
    label={socialShareLabel.replace(':platformName', 'Pocket')}
    href={`https://getpocket.com/edit?url=${encodeURIComponent(link)}`}
    iconComponent={PocketIcon}
    className={['hover:bg-share-pocket focus:bg-share-pocket', className].filter(Boolean).join(' ')}
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
      className={['hover:bg-share-mail focus:bg-share-mail', className].filter(Boolean).join(' ')}
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
