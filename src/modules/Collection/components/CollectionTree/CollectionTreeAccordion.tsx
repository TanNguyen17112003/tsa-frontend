import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "src/utils/shadcn";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import {
  PiFileTextBold,
  PiFolderFill,
  PiFolderOpen,
  PiFolderOpenFill,
} from "react-icons/pi";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "text-sm text-text-primary flex flex-1 items-center py-2 gap-2 font-medium transition-all hover:underline [&>.chevron]:transition-all [&[data-state=open]>.chevron]:rotate-90 [&[data-state=open]>.icon-open>svg]:fill-amber-500 [&[data-state=open]>.icon-close]:hidden [&[data-state=closed]>.icon-open]:hidden",
        className
      )}
      {...props}
    >
      <div className="chevron">
        <ChevronRightIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </div>
      <div className="icon-open">
        {<PiFolderOpenFill className="w-6 h-6" />}
      </div>
      <div className="icon-close">
        {<PiFolderFill className="w-6 h-6 fill-gray-400" />}
      </div>
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
