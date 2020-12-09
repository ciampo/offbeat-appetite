import React from 'react';

import AccessibleImage from '../../components/media/AccessibleImage';
import { fullBleedImageResponsiveConfig } from '../../components/media/image-responsive-configurations';
import { SanityAccessibleImage } from '../../typings';

type PageHeroProps = {
  className?: string;
  backgroundImage?: SanityAccessibleImage;
  variant?: 'standard' | 'short';
};
const PageHero: React.FC<PageHeroProps> = ({
  children,
  variant = 'standard',
  className = '',
  backgroundImage,
}) => (
  <header
    className={[
      'relative contain-l-p flex flex-col',
      'pt-32 md:pt-40 xl:pt-48',
      variant === 'standard'
        ? 'h-screen min-h-hero-m sm:min-h-hero-t xl:min-h-hero-d'
        : 'min-h-hero-m-short sm:min-h-hero-t-short xl:min-h-hero-d-short',
      className,
    ].join(' ')}
  >
    <div className="z-10 w-full flex-1 flex items-center pt-12 sm:pt-16 md:pt-20 xl:pt-24 pb-24 sm:pb-28 md:pb-32 xl:pb-40">
      {children}
    </div>

    {backgroundImage && (
      <AccessibleImage
        image={backgroundImage}
        responsiveConfig={fullBleedImageResponsiveConfig}
        className="z-0 absolute inset-0 w-full h-full"
        darker={true}
        style={{
          paddingBottom: '0',
        }}
      />
    )}
  </header>
);

export default PageHero;
