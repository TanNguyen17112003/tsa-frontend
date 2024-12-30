import { Box, Stack, Typography, Divider } from '@mui/material';
import React from 'react';
import { useResponsive } from 'src/utils/use-responsive';

interface PriceSectionProps {
  title: string;
  items: { label: string; price: string }[];
}

const PriceSection: React.FC<PriceSectionProps> = ({ title, items }) => {
  const { isMobile, isTablet } = useResponsive();

  return (
    <Stack
      bgcolor={'#f5f5f5'}
      width={isTablet ? '100%' : '50%'}
      display={isTablet ? 'flex' : ''}
      flexDirection={isTablet ? 'row' : 'column'}
      flex={isTablet ? 1 : ''}
    >
      <Stack padding={2} className='rounded-t-lg bg-green-400' width={isTablet ? '15%' : 'auto'}>
        <Typography variant={isTablet ? 'h6' : 'h5'} textAlign={'center'} color='white'>
          {title}
        </Typography>
      </Stack>
      <Stack padding={2} spacing={isTablet ? 1.5 : 3} width={isTablet ? '100%' : '100%'}>
        {items.map((item, index) => (
          <>
            <Box key={index} display={'flex'} justifyContent={'space-between'}>
              <Typography variant='body1'>{item.label}</Typography>
              <Typography variant='body1' fontWeight={'bold'} color='error'>
                {item.price}
              </Typography>
            </Box>
            {index !== items.length - 1 && <Divider className='border-1 border-blue-700' />}
          </>
        ))}
      </Stack>
    </Stack>
  );
};

const dormitoryItems = [
  { label: 'A4, A7, A8, A9', price: '0đ' },
  {
    label: 'A1, A2, A3, A5, A6, A10, A11, A12, A13, A14, A15, A16, A17, A18, A19, A20',
    price: '+2.000đ'
  },
  { label: 'AH1, AH2, AG3, AG4', price: '+4.000đ' },
  { label: 'D2, D3, D4, D5, D6', price: '0đ' },
  { label: 'C1, C2, C3, C4, C5, C6, BE1, BE2, BE3, BE4', price: '+2.000đ' },
  { label: 'A1, A2, A3, A4, A5, B1, B2, B3, B4, B5', price: '+4.000đ' }
];

export const LandingPrice = () => {
  const { isMobile, isTablet } = useResponsive();
  return (
    <Box
      color={'black'}
      paddingY={5}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      height={'100vh'}
      bgcolor={'white'}
    >
      <Typography variant='h4' textAlign={'center'} marginBottom={1} marginTop={5}>
        Bảng giá vận chuyển TSA
      </Typography>
      {!isMobile && (
        <Typography>
          Đối với mỗi loại hàng hóa, và nơi giao hàng chúng tôi sẽ có mức giá khác nhau.
        </Typography>
      )}
      {isMobile && (
        <p>
          Vui lòng xem chi tiết{' '}
          <a
            target='_blank'
            href='https://drive.google.com/file/d/18Xr3P7kBUlomNNPPf8Y_3eNThIb_XYJ2/view?usp=drive_link'
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            tại đây
          </a>
        </p>
      )}
      {!isMobile && (
        <Box
          display={'flex'}
          flexDirection={isTablet ? 'column' : 'row'}
          gap={isTablet ? 3 : 5}
          justifyContent={'center'}
          alignItems={'stretch'}
          mt={1}
          width={'70%'}
        >
          <PriceSection
            title='Theo khối lượng'
            items={[
              { label: 'Dưới 1kg', price: '5.000đ' },
              { label: 'Từ 1kg đến 3kg', price: '8.000đ' },
              { label: 'Trên 3kg', price: '12.000đ' }
            ]}
          />
          <PriceSection
            title='Theo Tầng'
            items={[
              { label: 'Từ tầng 1-4', price: '0đ' },
              { label: 'Từ tầng 4-6', price: '+1.000đ' },
              { label: 'Trên tầng 6', price: '+2.000đ' }
            ]}
          />
          <Stack
            bgcolor={'#f5f5f5'}
            width={isTablet ? '100%' : '50%'}
            display={isTablet ? 'flex' : ''}
            flexDirection={isTablet ? 'row' : 'column'}
            flex={isTablet ? 1 : ''}
          >
            <Stack
              padding={2}
              className='rounded-t-lg bg-green-400'
              width={isTablet ? '15%' : 'auto'}
            >
              <Typography variant={isTablet ? 'h6' : 'h5'} textAlign={'center'} color='white'>
                Theo Kí túc xá
              </Typography>
            </Stack>
            <Stack padding={2} spacing={1.5}>
              <Stack flexDirection={isTablet ? 'row' : 'column'} gap={2}>
                <Stack width={isTablet ? '50%' : '100%'}>
                  <Typography variant='h5'>Khu A</Typography>
                  {dormitoryItems.slice(0, 3).map((item, index) => (
                    <Box key={index} display={'flex'} justifyContent={'space-between'}>
                      <Typography variant='body1'>{item.label}</Typography>
                      <Typography variant='body1' fontWeight={'bold'} color='error'>
                        {item.price}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                <Divider
                  orientation={isTablet ? 'vertical' : 'horizontal'}
                  className='border-1 border-blue-700'
                />
                <Stack width={isTablet ? '50%' : '100%'}>
                  <Typography variant='h5'>Khu B</Typography>
                  {dormitoryItems.slice(3).map((item, index) => (
                    <Box key={index} display={'flex'} justifyContent={'space-between'}>
                      <Typography variant='body1'>{item.label}</Typography>
                      <Typography variant='body1' fontWeight={'bold'} color='error'>
                        {item.price}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
