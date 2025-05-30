export const paths = {
  index: '/',
  auth: {
    login: '/auth',
    register: {
      index: '/auth/register',
      'complete-signup': '/auth/register/complete-signup'
    },
    'forgot-password': '/auth/forgot-password',
    'reset-password': '/auth/reset-password',
    logout: '/auth/logout'
  },
  dashboard: {
    index: '/dashboard',
    delivery: { index: '/dashboard/delivery' },
    order: { index: '/dashboard/order', add: '/dashboard/order/add' },
    accounts: { index: '/dashboard/accounts' },
    report: { index: '/dashboard/report' },
    student: { index: '/dashboard/student' },
    staff: { index: '/dashboard/staff' }
  },
  student: {
    index: '/student',
    order: {
      index: '/student/order',
      add: '/student/order/add'
    },
    account: { index: '/student/account' },
    report: { index: '/student/report' }
  },
  staff: {
    index: '/staff',
    delivery: { index: '/staff/delivery' },
    order: {
      index: '/staff/order'
    },
    account: { index: '/staff/account' }
  },
  notifications: {
    index: '/notifications'
  },
  landing: {
    index: '/landing'
  },
  tickets: {
    index: '/tickets'
  },
  regulations: {
    index: '/regulations'
  },
  banned: {
    index: '/banned'
  },
  401: '/401',
  404: '/404',
  500: '/500'
};
