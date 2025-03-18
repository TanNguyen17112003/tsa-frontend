import { Box, Stack, TableCell, TableCellProps } from '@mui/material';
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useDrag } from 'src/hooks/use-drag';
import { useDebounce } from '@hooks';

export const CardTableResizableCell = ({
  log,
  onResized,
  forceAuto,
  disableResize,
  ...props
}: TableCellProps & {
  log?: boolean;
  onResized?: () => void;
  forceAuto?: boolean;
  disableResize?: boolean;
}) => {
  const ref = useRef<HTMLElement | null>();
  const originWidth = useRef<number>();
  const [width, setWidth] = useState<number>();
  const debouncedWidth = useDebounce(width, 200);

  const { position, isDragging, dragHandlers } = useDrag();

  useEffect(() => {
    window.addEventListener('mousemove', dragHandlers.onMouseMove);
    return () => window.removeEventListener('mousemove', dragHandlers.onMouseMove);
  }, [dragHandlers.onMouseMove]);

  useEffect(() => {
    window.addEventListener('mouseup', dragHandlers.onMouseUp);
    return () => window.removeEventListener('mouseup', dragHandlers.onMouseUp);
  }, [dragHandlers.onMouseUp]);

  const handleMouseDown = useCallback<MouseEventHandler>(
    (e) => {
      if (ref.current) {
        originWidth.current = ref.current.getBoundingClientRect().width;
        dragHandlers.onMouseDown(e);
      }
    },
    [dragHandlers]
  );

  useEffect(() => {
    onResized?.();
  }, [debouncedWidth, onResized]);

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isDragging]);

  useEffect(() => {
    if (ref.current) {
      setWidth(Math.max(40, (originWidth.current || 0) + position.x));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  useEffect(() => {
    if (log) {
      console.log('ref.current', ref.current);
    }
    if (ref.current) {
      if (log) {
        console.log(
          'ref.current.getBoundingClientRect().width',
          ref.current.getBoundingClientRect().width
        );
      }
      originWidth.current = ref.current.getBoundingClientRect().width;
      setWidth(originWidth.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.children]);

  return (
    <TableCell
      ref={ref}
      width={width || 'auto'}
      {...props}
      sx={{
        ...props.sx,
        px: 2,
        overflow: 'visible',
        position: 'relative'
      }}
    >
      {props.children}
      {!disableResize && (
        <Box
          sx={{
            width: 16,
            borderColor: 'divider',
            height: '100%',
            position: 'absolute',
            top: 0,
            right: -8,
            cursor: 'col-resize',
            px: isDragging ? '6px' : '8px',
            py: 1,
            zIndex: 1,
            '&:hover': {
              px: '6px',
              '& > div': {
                bgcolor: 'neutral.500'
              }
            }
          }}
          onMouseDown={handleMouseDown}
        >
          <Stack
            sx={{
              bgcolor: isDragging ? 'neutral.500' : 'neutral.400',
              borderRadius: 2,
              height: '100%',
              width: '100%'
            }}
          ></Stack>
        </Box>
      )}
    </TableCell>
  );
};
