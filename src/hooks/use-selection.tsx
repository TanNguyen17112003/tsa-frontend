import { useCallback, useEffect, useState } from 'react';

export interface Selection<T> {
  handleDeselectAll: () => void;
  handleDeselectOne: (item: T) => void;
  handleSelectAll: () => void;
  handleSelectOne: (item: T) => void;
  setSelected: (items: T[]) => void;
  selected: T[];
}

export const useSelection = <T extends { id: any }>(items: T[] = []): Selection<T> => {
  const [selected, setSelected] = useState<T[]>([]);

  const handleSelectAll = useCallback((): void => {
    setSelected((prevState) => {
      const newSelected = [...prevState];
      items.forEach((item) => {
        if (!newSelected.some((selectedItem) => selectedItem.id === item.id)) {
          newSelected.push(item);
        }
      });
      return newSelected;
    });
  }, [items]);

  const handleSelectOne = useCallback((item: T): void => {
    setSelected((prevState) => {
      if (!prevState.some((selectedItem) => selectedItem.id === item.id)) {
        return [...prevState, item];
      }
      return prevState;
    });
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelected([]);
  }, []);

  const handleDeselectOne = useCallback((item: T): void => {
    setSelected((prevState) => {
      return prevState.filter((selectedItem) => selectedItem.id !== item.id);
    });
  }, []);

  return {
    handleDeselectAll,
    handleDeselectOne,
    handleSelectAll,
    handleSelectOne,
    setSelected,
    selected
  };
};
