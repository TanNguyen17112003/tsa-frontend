export const paths = {
  index: '/',
  auth: {
    login: '/auth',
    register: '/auth/register',
    'forgot-password': '/auth/forgot-password',
    'reset-password': '/auth/reset-password',
    logout: '/auth/logout'
  },
  dashboard: {
    index: '/dashboard',
    collections: '/dashboard/collections',
    accounts: '/dashboard/accounts',
    categories: '/dashboard/categories',
    reports: '/dashboard/reports',
    'add-report': '/dashboard/add-report'
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
  landing: {
    index: '/landing'
  },
  401: '/401',
  404: '/404',
  500: '/500'
};
