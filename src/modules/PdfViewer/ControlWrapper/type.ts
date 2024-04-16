export interface ControlState {
  zoom: number;
  dragging: boolean;
  dragStartX: number;
  dragStartY: number;
  dragOffsetX: number;
  dragOffsetY: number;
}

export const initialControlState: ControlState = {
  zoom: 1,
  dragging: false,
  dragStartX: 0,
  dragStartY: 0,
  dragOffsetX: 0,
  dragOffsetY: 0,
};
