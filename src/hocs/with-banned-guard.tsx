import type { FC } from 'react';
import { BannedGuard } from 'src/guards/banned-guard';
import { withAuthGuard } from '@hocs';
import { AuthGuard } from '@guards';

export const withBannedGuard =
  <P extends object>(Component: FC<P>): FC<P> =>
  (props: P) => (
    <BannedGuard>
      <Component {...props} />
    </BannedGuard>
  );

export const withAuthAndBannedGuard = <P extends object>(Component: FC<P>): FC<P> => {
  // const WrappedComponent = withAuthGuard((props: P) => (
  //   <BannedGuard>
  //     <Component {...props} />
  //   </BannedGuard>
  // ));
  // return WrappedComponent;

  // I want to reverse the above logic
  const WrappedComponent = withBannedGuard((props: P) => (
    <AuthGuard>
      <Component {...props} />
    </AuthGuard>
  ));
  return WrappedComponent;
};
