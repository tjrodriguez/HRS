declare module '@base-ui/react-scroll-area' {
  import type * as React from 'react';

  export const Root: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;

  export const Viewport: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;

  export const Scrollbar: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> &
      React.RefAttributes<HTMLDivElement> & {
        orientation?: 'vertical' | 'horizontal';
      }
  >;

  export const Thumb: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;

  export const Corner: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
}
