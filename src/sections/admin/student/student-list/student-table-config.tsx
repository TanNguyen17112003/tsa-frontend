import { Typography, Stack, Chip, Tooltip, Avatar } from '@mui/material';
import { CustomTableConfig } from 'src/components/custom-table';
import { ArrowUp, CloseCircle } from 'iconsax-react';
import { formatDate, formatUnixTimestamp } from 'src/utils/format-time-currency';
import { UserDetail } from 'src/types/user';
import { Trash } from 'lucide-react';
import { Restore } from '@mui/icons-material';
const getStudentTableConfig = ({
  onClickDelete,
  onClickUpgrade,
  onClickRestore
}: {
  onClickDelete: (data: UserDetail) => void;
  onClickUpgrade: (data: UserDetail) => void;
  onClickRestore: (data: UserDetail) => void;
}): CustomTableConfig<UserDetail['id'], UserDetail>[] => [
  {
    key: 'information',
    headerLabel: 'Thông tin cơ bản',
    type: 'string',
    renderCell: (data) => (
      <Stack direction={'row'} alignItems={'center'} gap={1}>
        {data.photoUrl ? (
          <Avatar src={data.photoUrl} />
        ) : data.firstName ? (
          <Avatar>{data.firstName[0]}</Avatar>
        ) : (
          <Avatar />
        )}
        <Stack>
          <Typography fontWeight={'bold'}>{data.lastName + ' ' + data.firstName}</Typography>
          <Typography>{data.email}</Typography>
        </Stack>
      </Stack>
    )
  },
  {
    key: 'address',
    headerLabel: 'Địa chỉ',
    type: 'string',
    renderCell: (data) => (
      <Typography>{`KTX ${data.dormitory} - Tòa ${data.building} - Phòng ${data.room}`}</Typography>
    )
  },
  {
    key: 'createdAt',
    headerLabel: 'Ngày tham gia',
    type: 'string',
    renderCell: (data) => <Typography>{formatDate(formatUnixTimestamp(data.createdAt))}</Typography>
  },
  {
    key: 'status',
    headerLabel: 'Trạng thái',
    type: 'string',
    renderCell: (data) => (
      <Chip
        label={data.status}
        color={
          data.status === 'AVAILABLE' ? 'success' : data.status === 'BUSY' ? 'error' : 'secondary'
        }
      />
    )
  },
  {
    key: 'action',
    headerLabel: 'Hành động',
    type: 'string',
    renderCell: (data) => (
      <Stack direction={'row'} spacing={2}>
        <Tooltip title='NÂNG CẤP VAI TRÒ'>
          <ArrowUp
            fontVariant={'contained'}
            color='blue'
            size={24}
            className='cursor-pointer'
            onClick={(event) => {
              event.stopPropagation();
              onClickUpgrade(data);
            }}
          />
        </Tooltip>
        <Tooltip title='XÓA NGƯỜI DÙNG'>
          <Trash
            fontVariant={'contained'}
            color='red'
            size={24}
            className='cursor-pointer'
            onClick={(event) => {
              event.stopPropagation();
              onClickDelete(data);
            }}
          />
        </Tooltip>
      </Stack>
    )
  },
  {
    key: 'recover',
    headerLabel: 'Khôi phục',
    type: 'string',
    renderCell: (data) =>
      data?.status === 'BANNED' && (
        <Stack
          direction={'row'}
          spacing={2}
          onClick={(event) => {
            event.stopPropagation();
            onClickRestore(data);
          }}
        >
          <Tooltip title='KHÔI PHỤC'>
            <Restore />
          </Tooltip>
        </Stack>
      )
  }
];

export default getStudentTableConfig;
