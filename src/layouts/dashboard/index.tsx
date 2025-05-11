import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { useSections } from './config/config';
import VerticalLayout from './vertical-layout';
import { withAuthGuard } from '@hocs';
import { withAuthAndBannedGuard } from 'src/hocs/with-banned-guard';
import { useTheme, useMediaQuery } from '@mui/material';
import MobileLayout from './mobile-layout';
import TabletLayout from './tablet-layout';

interface LayoutProps {
  children?: ReactNode;
  pagePermission?: string;
}

export const Layout: FC<LayoutProps> = withAuthAndBannedGuard((props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const sections = useSections();
  return isMobile ? (
    <MobileLayout sections={sections} {...props} />
  ) : isTablet ? (
    <TabletLayout sections={sections} {...props} />
  ) : (
    <VerticalLayout sections={sections} {...props} />
  );
});

Layout.propTypes = {
  children: PropTypes.any
};
