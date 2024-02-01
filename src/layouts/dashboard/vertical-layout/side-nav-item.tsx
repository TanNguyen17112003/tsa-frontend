import React, { FC, ReactNode, useState, useCallback } from "react";
import Link from "next/link";
import { Collapse } from "src/components/ui/Collapse";
import clsx from "clsx";

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
        <button
          disabled={disabled}
          onClick={handleToggle}
          className={clsx("btn w-full justify-start text-text-secondary")}
        >
          {startIcon && <div>{startIcon}</div>}

          {title}
          <div className="text-nav-item-chevron-color text-sm ml-2">
            {open ? "▼" : "▶"}
          </div>
        </button>
        <Collapse in={open} className="mt-2">
          {children}
        </Collapse>
      </li>
    );
  }

  return (
    <li>
      <Link href={path || "#"}>
        <button
          disabled={disabled}
          className={clsx(
            "btn w-full justify-start rounded-xl",
            active
              ? "btn-primary bg-orange-400 border-orange-400 text-white"
              : "btn-ghost text-text-secondary"
          )}
        >
          {startIcon && <span>{startIcon}</span>}
          <div className={clsx("prose-sm prose")}>{title}</div>
          {label && <span className="ml-2">{label}</span>}
        </button>
      </Link>
    </li>
  );
};
