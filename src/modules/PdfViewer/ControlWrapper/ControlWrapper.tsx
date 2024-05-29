import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
} from "react";
import { ControlState, initialControlState } from "./type";
import clsx from "clsx";

interface ControlWrapperProps {
  className?: string;
  children: ReactNode;
}

const ControlWrapper: FC<ControlWrapperProps> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [controlState, setControlState] =
    useState<ControlState>(initialControlState);

  const handleZoomIn = useCallback(() => {
    setControlState({ ...controlState, zoom: controlState.zoom + 0.1 });
  }, [controlState]);

  const handleZoomOut = useCallback(() => {
    setControlState({
      ...controlState,
      zoom: Math.max(1, controlState.zoom - 0.1),
    });
  }, [controlState]);

  const handleWheelZoom = useCallback(
    (e: React.WheelEvent) => {
      // e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    },
    [handleZoomIn, handleZoomOut]
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setControlState({
        ...controlState,
        dragging: true,
        dragStartX: e.clientX,
        dragStartY: e.clientY,
      });
    },
    [controlState]
  );

  const handleDragMove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { dragging, dragStartX, dragStartY, dragOffsetX, dragOffsetY } =
      controlState;
    if (dragging) {
      const offsetX = e.clientX - dragStartX;
      const offsetY = e.clientY - dragStartY;

      setControlState({
        ...controlState,
        dragOffsetX: dragOffsetX + offsetX,
        dragOffsetY: dragOffsetY + offsetY,
        dragStartX: e.clientX,
        dragStartY: e.clientY,
      });
    }
  };

  const handleDragEnd = () => {
    setControlState({ ...controlState, dragging: false });
  };

  useEffect(() => {
    setControlState(initialControlState);
  }, [children]);

  return (
    <div
      ref={ref}
      className={clsx("relative touch-none", className)}
      onWheel={handleWheelZoom}
      style={{
        position: "absolute",
        top: controlState.dragOffsetY,
        left: controlState.dragOffsetX,
        transform: `scale(${controlState.zoom})`,
      }}
      onMouseLeave={handleDragEnd}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
    >
      {children}
    </div>
  );
};

export default ControlWrapper;
