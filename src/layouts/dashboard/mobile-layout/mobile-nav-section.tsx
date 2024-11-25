import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack } from '@mui/material';
import { MobileNavItem } from './mobile-nav-item';

interface DashboardItem {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: DashboardItem[];
  label?: ReactNode;
  path?: string;
  title: string;
}

const renderItems = ({
  depth = 0,
  items,
  pathname,
  onClose
}: {
  depth?: number;
  items: DashboardItem[];
  pathname?: string | null;
  onClose?: () => void;
}): JSX.Element[] =>
  items.reduce(
    (acc: JSX.Element[], item) =>
      reduceChildRoutes({
        acc,
        depth,
        item,
        pathname,
        onClose
      }),
    []
  );

const reduceChildRoutes = ({
  acc,
  depth,
  item,
  pathname,
  onClose
}: {
  acc: JSX.Element[];
  depth: number;
  item: DashboardItem;
  pathname?: string | null;
  onClose?: () => void;
}): Array<JSX.Element> => {
  const checkPath = !!(item.path && pathname);
  const partialMatch = checkPath ? pathname.includes(item.path!) : false;
  const exactMatch = checkPath ? pathname === item.path : false;

  if (item.items) {
    acc.push(
      <MobileNavItem
        active={partialMatch}
        depth={depth}
        disabled={item.disabled}
        icon={item.icon}
        key={item.title}
        label={item.label}
        open={partialMatch}
        title={item.title}
        onClose={onClose}
      >
        <Stack
          component='ul'
          spacing={0.5}
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            width: '100%'
          }}
        >
          {renderItems({
            depth: depth + 1,
            items: item.items,
            pathname,
            onClose
          })}
        </Stack>
      </MobileNavItem>
    );
  } else {
    acc.push(
      <MobileNavItem
        active={partialMatch}
        depth={depth}
        disabled={item.disabled}
        external={item.external}
        icon={item.icon}
        key={item.title}
        label={item.label}
        path={item.path}
        title={item.title}
        onClose={onClose}
      />
    );
  }

  return acc;
};

interface MobileNavSectionProps {
  items?: DashboardItem[];
  pathname?: string | null;
  subheader?: string;
  onClose?: () => void;
}

export const MobileNavSection: FC<MobileNavSectionProps> = (props) => {
  const { items = [], pathname, subheader = '', onClose, ...other } = props;

  return (
    <Stack
      component='ul'
      spacing={0.5}
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
        width: '100%'
      }}
      {...other}
    >
      {subheader && (
        <Box
          component='li'
          sx={{
            color: 'black',
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.66,
            mb: 1,
            ml: 1,
            textTransform: 'uppercase'
          }}
        >
          {subheader}
        </Box>
      )}
      {renderItems({ items, pathname, onClose })}
    </Stack>
  );
};

MobileNavSection.propTypes = {
  items: PropTypes.array,
  pathname: PropTypes.string,
  subheader: PropTypes.string,
  onClose: PropTypes.func
};
