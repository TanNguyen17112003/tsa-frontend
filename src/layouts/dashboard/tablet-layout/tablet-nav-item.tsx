import React, { FC, ReactNode, useState, useCallback } from 'react';
import Link from 'next/link';
import { Collapse } from 'src/components/ui/Collapse';
import clsx from 'clsx';
import { Button } from 'src/components/shadcn/ui/button';
import { Tooltip } from '@mui/material';

interface TabletNavItemProps {
  active?: boolean;
  children?: ReactNode;
  depth?: number;
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
  open?: boolean;
  path?: string;
  title: string;
}

export const TabletNavItem: FC<TabletNavItemProps> = (props) => {
  const { active, children, depth = 0, disabled, icon, open: openProp, path } = props;
  const [open, setOpen] = useState<boolean>(!!openProp);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  let startIcon: ReactNode;

  if (depth === 0) {
    startIcon = icon;
  } else {
    startIcon = (
      <span className='inline-flex items-center justify-center h-20 w-20'>
        <span
          className={`bg-nav-item-icon-color rounded-full h-4 w-4 ${
            active && 'bg-nav-item-icon-active-color h-6 w-6'
          }`}
        />
      </span>
    );
  }

  if (children) {
    return (
      <li>
        <Tooltip title={props.title} placement='right'>
          <Button
            disabled={disabled}
            onClick={handleToggle}
            className={clsx('w-full justify-center text-text-secondary')}
          >
            {startIcon && <div>{startIcon}</div>}
          </Button>
        </Tooltip>
      </li>
    );
  }

  return (
    <li>
      <Link href={path || '#'}>
        <Tooltip title={props.title} placement='right'>
          <Button
            variant={active ? 'default' : 'ghost'}
            disabled={disabled}
            className={clsx('w-full justify-center rounded-xl')}
          >
            {startIcon && <span className='mr-2'>{startIcon}</span>}
          </Button>
        </Tooltip>
      </Link>
    </li>
  );
};
