import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { useSections } from './config/config';
import VerticalLayout from './vertical-layout';
import { withAuthGuard } from '@hocs';
import { useTheme, useMediaQuery } from '@mui/material';
import MobileLayout from './mobile-layout';

interface LayoutProps {
  children?: ReactNode;
  pagePermission?: string;
}

export const Layout: FC<LayoutProps> = withAuthGuard((props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const sections = useSections();
  return isMobile ? (
    <MobileLayout sections={sections} {...props} />
  ) : (
    <VerticalLayout sections={sections} {...props} />
  );
});

Layout.propTypes = {
  children: PropTypes.any
};
