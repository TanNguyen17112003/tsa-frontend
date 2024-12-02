import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { useFirebaseAuth } from 'src/hooks/use-auth';
import { getDashboardAdminConfigs } from './dashboard-admin-configs';
import { dashboardStudentConfigs } from './dashboard-student-configs';
import { getDashboardStaffConfigs } from './dashboard-staff-configs';

export interface DashboardItem {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: DashboardItem[];
  label?: ReactNode;
  path?: string;
  title: string;
}

export interface Section {
  items: DashboardItem[];
  subheader?: string;
}

export const useSections = () => {
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();

  return useMemo(() => {
    if (user?.role == 'ADMIN' || firebaseUser?.role == 'ADMIN') {
      return getDashboardAdminConfigs();
    } else if (user?.role == 'STUDENT' || firebaseUser?.role == 'STUDENT') {
      return dashboardStudentConfigs;
    } else {
      return getDashboardStaffConfigs();
    }
  }, [user?.role]);
};
