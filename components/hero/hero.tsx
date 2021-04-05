import * as React from 'react';

import AccessibleImage from '../../components/media/AccessibleImage';
import { fullBleedImageResponsiveConfig } from '../../components/media/image-responsive-configurations';
import { SanityAccessibleImage } from '../../typings';

type HeroVariant = 'standard' | 'short' | 'shorter';

const variantsToHeightClassname: Record<HeroVariant, string> = {
  standard: 'h-screen min-h-hero-m sm:min-h-hero-t xl:min-h-hero-d',
  short: 'min-h-hero-m-short sm:min-h-hero-t-short xl:min-h-hero-d-short',
  shorter: 'min-h-hero-m-shorter sm:min-h-hero-t-shorter xl:min-h-hero-d-shorter',
} as const;

const variantsToPaddingClassname: Record<HeroVariant, string> = {
  standard: 'pt-12 sm:pt-16 md:pt-20 xl:pt-24 pb-24 sm:pb-28 md:pb-32 xl:pb-40',
  short: 'pt-12 sm:pt-16 md:pt-20 xl:pt-24 pb-24 sm:pb-28 md:pb-32 xl:pb-40',
  shorter: 'pt-12 sm:pt-16 md:pt-20 xl:pt-24 pb-16 sm:pb-24 md:pb-28 xl:pb-32',
} as const;

type PageHeroProps = {
  className?: string;
  backgroundImage?: SanityAccessibleImage;
  variant?: HeroVariant;
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
      variantsToHeightClassname[variant],
      className,
    ].join(' ')}
  >
    <div
      className={['z-10 w-full flex-1 flex items-cente', variantsToPaddingClassname[variant]].join(
        ' '
      )}
    >
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
