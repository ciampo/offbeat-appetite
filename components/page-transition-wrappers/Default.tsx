import React from 'react';

import { motion } from 'framer-motion';
import { customEaseOut } from '../../scripts/utils';

// Inspired from
// https://reacttricks.com/animating-next-page-transitions-with-framer-motion/
// and https://github.com/kheruc/rt-next-motion
const fadeInTransitionUp = {
  opacity: 1,
  y: 0,
  transition: { duration: 0.4, delay: 0.2, ease: customEaseOut },
};
const transparent = {
  opacity: 0,
  y: 0,
};
const fadeOutTransitionDown = {
  opacity: 0,
  y: 30,
  transition: { duration: 0.6, delay: 0.1, ease: customEaseOut },
};

type CustomPageTransitionProps = React.PropsWithChildren<{
  onComplete?: () => void;
}>;

const DefaultPageTransitionWrapper: React.FC<CustomPageTransitionProps> = ({
  children,
  onComplete,
}) => (
  <motion.div
    initial="transparent"
    animate="enter"
    exit="exit"
    variants={{
      enter: fadeInTransitionUp,
      transparent,
      exit: fadeOutTransitionDown,
    }}
    onAnimationComplete={onComplete}
  >
    {children}
  </motion.div>
);

export default DefaultPageTransitionWrapper;
