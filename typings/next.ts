import { NextComponentType } from 'next';

export type NextComponentTypeWithLayout<P = {}> = NextComponentType<{}, P, P> & {
  Layout?: React.FC;
};
