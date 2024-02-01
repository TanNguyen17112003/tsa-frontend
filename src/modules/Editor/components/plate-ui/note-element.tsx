import { cn } from "@udecode/cn";
import { withRef, PlateLeaf } from "@udecode/plate-common";

export const NoteElement = withRef<typeof PlateLeaf>(
  ({ className, children, ...props }, ref) => {
    return (
      <PlateLeaf ref={ref} asChild className={cn(className)} {...props}>
        <div className="btn btn-xs btn-square btn-primary text-xs">
          {props.text.text}
        </div>
      </PlateLeaf>
    );
  }
);
