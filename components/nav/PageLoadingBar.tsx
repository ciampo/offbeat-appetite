import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

type PageLoadingBarProps = {
  className?: string;
};
const PageLoadingBar: React.FC<PageLoadingBarProps> = ({ className }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    function handleRouteChange(): void {
      setLoading(true);
    }

    function handleRouteComplete(): void {
      setLoading(false);
    }

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    router.events.on('routeChangeError', handleRouteComplete);

    return (): void => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
      router.events.off('routeChangeError', handleRouteComplete);
    };
  }, [router.events]);

  return (
    <span
      aria-hidden={true}
      className={[
        'h-1 bg-gray-white will-change-transform-opacity shadow contain-s',
        'origin-top-left',
        // This ensures that when the animation is removes (ie. when loading is finished),
        // the loading bar jumps to 100%
        isLoading ? 'scale-x-0' : 'scale-x-100',
        // The animation takes care of filling the loading bar from 0 to 90%.
        // The animation has a delay of 1s — this is to avoid showing the bar
        // at all when there are short loading times.
        isLoading
          ? 'animation-loading-bar animation-2s animation-delay-1s animation-linear animation-fill-both animation-once'
          : '',
        // The transition takes care of showing/hiding the bar (via opacity).
        // Fade in delay is 0.7s (vs animation delay of 1s), so that the bar
        // can animate when fully visible. Fade out delay is 0.5s, so that the bar
        // stays on screen for a bit before being removed.
        'transition-opacity duration-300 ease-out',
        isLoading ? 'opacity-100 delay-700' : 'opacity-0 delay-500',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    ></span>
  );
};

export default PageLoadingBar;
