import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Refresh } from 'iconsax-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from 'src/hooks/use-auth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import type { Page as PageType } from 'src/types/page';

const Page: PageType = () => {
  const [all, setAll] = useState(false);
  const [okAll, setOkAll] = useState(false);

  const { user } = useAuth();

  return (
    <Box>
      <Stack
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'white',
          mt: 3
        }}
        direction='row'
      >
        <div>
          <Paper
            sx={{
              width: '300px'
            }}
            elevation={16}
          ></Paper>
        </div>
      </Stack>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
