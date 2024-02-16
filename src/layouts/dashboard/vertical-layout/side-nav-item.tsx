import React, { FC, ReactNode, useState, useCallback } from "react";
import Link from "next/link";
import { Collapse } from "src/components/ui/Collapse";
import clsx from "clsx";
import { Button } from "src/components/shadcn/ui/button";

interface SideNavItemProps {
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

export const SideNavItem: FC<SideNavItemProps> = (props) => {
  const {
    active,
    children,
    depth = 0,
    disabled,
    external,
    icon,
    label,
    open: openProp,
    path,
    title,
  } = props;
  const [open, setOpen] = useState<boolean>(!!openProp);

  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  // Icons can be defined at top level only, deep levels have bullets instead of actual icons.
  let startIcon: ReactNode;

  if (depth === 0) {
    startIcon = icon;
  } else {
    startIcon = (
      <span className="inline-flex items-center justify-center h-20 w-20">
        <span
          className={`bg-nav-item-icon-color rounded-full h-4 w-4 ${
            active && "bg-nav-item-icon-active-color h-6 w-6"
          }`}
        />
      </span>
    );
  }

  if (children) {
    return (
      <li>
        <Button
          disabled={disabled}
          onClick={handleToggle}
          className={clsx("w-full justify-start text-text-secondary")}
        >
          {startIcon && <div>{startIcon}</div>}

          {title}
          <div className="text-nav-item-chevron-color text-sm ml-2">
            {open ? "▼" : "▶"}
          </div>
        </Button>
        <Collapse in={open} className="mt-2">
          {children}
        </Collapse>
      </li>
    );
  }

  return (
    <li>
      <Link href={path || "#"}>
        <Button
          variant={active ? "default" : "ghost"}
          disabled={disabled}
          className={clsx("w-full justify-start rounded-xl")}
        >
          {startIcon && <span className="mr-2">{startIcon}</span>}
          <div className={clsx("prose-sm prose")}>{title}</div>
          {label && <span className="ml-2">{label}</span>}
        </Button>
      </Link>
    </li>
  );
};
