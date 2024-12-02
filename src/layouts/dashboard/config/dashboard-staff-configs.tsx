import { paths } from 'src/paths';
import { LogoutCurve, Box1, Personalcard } from 'iconsax-react';
import { PiMotorcycle } from 'react-icons/pi';
export const getDashboardStaffConfigs = () => {
  return [
    {
      subheader: 'Quản lý',
      items: [
        {
          title: 'Thông tin đơn hàng',
          path: paths.staff.order.index,
          icon: <Box1 className='h-6 w-6' />
        },
        {
          title: 'Thông tin chuyến đi',
          path: paths.staff.delivery.index,
          icon: <PiMotorcycle className='h-6 w-6' />
        }
      ]
    },
    {
      subheader: 'Tài khoản',
      items: [
        {
          title: 'Thông tin tài khoản',
          path: paths.staff.account.index,
          icon: <Personalcard size='20px' variant='Bold' />
        },
        {
          title: 'Đăng xuất',
          path: paths.auth.logout,
          icon: <LogoutCurve size='20px' variant='Bold' />
        }
      ]
    }
  ];
};
