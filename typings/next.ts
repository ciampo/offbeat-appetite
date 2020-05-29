import { NextComponentType } from 'next';

export type NextComponentTypeWithLayout<P = Record<string, unknown>> = NextComponentType<
  Record<string, unknown>,
  P,
  P
> & {
  Layout?: React.FC;
};
