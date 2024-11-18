import { Personalcard, LogoutCurve, Box1, NotificationStatus } from 'iconsax-react';
import { paths } from 'src/paths';
import { Section } from './config';

export const dashboardStudentConfigs: Section[] = [
  {
    subheader: 'Quản lý',
    items: [
      {
        title: 'Thông tin đơn hàng',
        path: paths.student.order.index,
        icon: <Box1 size='20px' variant='Bold' />
      },
      {
        title: 'Lịch sử khiếu nại',
        path: paths.student.report.index,
        icon: <NotificationStatus size='20px' variant='Bold' />
      }
    ]
  },
  {
    subheader: 'Tài khoản',
    items: [
      {
        title: 'Thông tin tài khoản',
        path: paths.student.account.index,
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
