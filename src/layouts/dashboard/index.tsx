import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { useSections } from './config/config';
import VerticalLayout from './vertical-layout';
import { withAuthGuard } from '@hocs';

interface LayoutProps {
  children?: ReactNode;
  pagePermission?: string;
}

export const Layout: FC<LayoutProps> = withAuthGuard((props) => {
  const sections = useSections();
  return <VerticalLayout sections={sections} {...props} />;
});

Layout.propTypes = {
  children: PropTypes.any
};
