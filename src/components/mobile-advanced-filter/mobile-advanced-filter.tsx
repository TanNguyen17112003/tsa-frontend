import React from 'react';
import { Button, Box } from '@mui/material';
import { TextalignCenter } from 'iconsax-react';
import { useDialog } from '@hooks';
import MobileAdvancedFilterDialog from './mobile-advanced-filter-dialog';
import { Filter } from 'src/types/filter';

interface MobileAdvancedFilterProps {
  filters: Filter[];
}

const MobileAdvancedFilter: React.FC<MobileAdvancedFilterProps> = ({ filters }) => {
  const mobileAdvancedFilterDialog = useDialog();

  return (
    <Box className='w-[10%]'>
      <Button
        variant='outlined'
        onClick={mobileAdvancedFilterDialog.handleOpen}
        sx={{ justifyContent: 'center' }}
      >
        <TextalignCenter />
      </Button>
      <MobileAdvancedFilterDialog
        open={mobileAdvancedFilterDialog.open}
        onClose={mobileAdvancedFilterDialog.handleClose}
        filters={filters}
      />
    </Box>
  );
};

export default MobileAdvancedFilter;
