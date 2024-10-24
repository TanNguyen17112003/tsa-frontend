// src/components/advanced-filter.tsx
import React from 'react';
import { Button } from '@mui/material';
import { Setting4 } from 'iconsax-react';
import { useDialog } from '@hooks';
import AdvancedFilterDialog from './advanced-filter-dialog';
import { Filter } from 'src/types/filter';

interface AdvancedFilterProps {
  filters: Filter[];
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({ filters }) => {
  const advancedFilterDialog = useDialog();

  return (
    <>
      <Button
        variant='outlined'
        startIcon={<Setting4 size={24} />}
        sx={{ width: '250px' }}
        onClick={advancedFilterDialog.handleOpen}
      >
        Bộ lọc nâng cao
      </Button>
      <AdvancedFilterDialog
        open={advancedFilterDialog.open}
        onClose={advancedFilterDialog.handleClose}
        filters={filters}
      />
    </>
  );
};

export default AdvancedFilter;
