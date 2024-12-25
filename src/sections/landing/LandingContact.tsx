import { useTheme, useMediaQuery, Box, Card, Stack, Typography } from '@mui/material';
import React from 'react';
import { MailIcon } from 'lucide-react';
import { Location, Call } from 'iconsax-react';
import ZaloImage from 'public/ui/zalo.png';
import MessageImage from 'public/ui/message.png';
import Image from 'next/image';
import Map, { Marker, NavigationControl } from 'react-map-gl';

interface InfoProps {
  value: string | string[];
  icon?: React.ReactNode;
}

const center = {
  lat: 10.878457010069411,
  lng: 106.8063226820925
};

export const LandingContact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const infoList: InfoProps[] = [
    {
      icon: <Location width={24} color='red' variant='Bold' />,
      value: 'Ký túc xá khu A, Đại học Quốc gia TP.HCM'
    },
    {
      icon: <Call width={24} color='red' variant='Bold' />,
      value: '0862 898 859'
    },
    {
      icon: <MailIcon width={24} color='red' fontVariant={'bold'} />,
      value: 'duytan17112003@gmail.com'
    }
  ];

  return (
    <Box
      color={'black'}
      sx={{
        background: 'linear-gradient(to left, #ffffff 30%, #9FD596 70%)'
      }}
      paddingY={5}
    >
      <Typography variant='h4' textAlign={'center'} marginBottom={3}>
        Liên hệ
      </Typography>

      <Box display={'flex'} gap={2} justifyContent={'center'} alignItems={'center'}>
        <Card sx={{ bgcolor: 'white', padding: 2 }}>
          <Typography variant='h5' textAlign={'center'} marginBottom={2}>
            Hệ thống hỗ trợ vận chuyển hàng hóa
          </Typography>
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            {infoList.map((info, index) => (
              <Stack key={index} direction={'row'} gap={2} alignItems={'center'}>
                {info.icon}
                <Typography fontWeight={'light'} fontSize={14}>
                  {info.value}
                </Typography>
              </Stack>
            ))}
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2} marginTop={2}>
            <Stack alignItems={'center'}>
              <Image src={ZaloImage} alt='zalo' height={180} />
              <Typography fontWeight={'bold'} fontStyle={'italic'} fontSize={12}>
                Mở Zalo bấm nút quét QR để quét kết bạn
              </Typography>
            </Stack>
            <Stack alignItems={'center'}>
              <Image src={MessageImage} alt='message' height={180} />
              <Typography fontWeight={'bold'} fontStyle={'italic'} fontSize={12}>
                Nhắn tin cho chúng tôi
              </Typography>
            </Stack>
          </Box>
        </Card>
        {!isTablet && (
          <Box sx={{ width: '50%', height: '400px' }}>
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              attributionControl={true}
              initialViewState={{
                longitude: center.lng,
                latitude: center.lat,
                zoom: 15,
                pitch: 60,
                bearing: -60
              }}
              style={{ width: '100%', height: '100%', borderRadius: '16px' }}
              mapStyle='mapbox://styles/quancao2310/cm2zqn7lb000a01o25jafeyvq'
            >
              <Marker color='#D20103' longitude={center.lng} latitude={center.lat} />
              <NavigationControl position='bottom-right' />
            </Map>
          </Box>
        )}
      </Box>
    </Box>
  );
};
