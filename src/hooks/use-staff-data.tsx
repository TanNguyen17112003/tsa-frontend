import { useState, useEffect } from 'react';
import { UsersApi } from 'src/api/users';
import useFunction from 'src/hooks/use-function';
import { UserDetail, UserStatus } from 'src/types/user';

const useStaffData = () => {
  const getUsersApi = useFunction(UsersApi.getUsers);
  const [staffs, setStaffs] = useState<{
    [key: string]: { firstName: string; lastName: string; id: string; status: UserStatus };
  }>({});
  const [users, setUsers] = useState<UserDetail[]>([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      const users = await getUsersApi.call({});
      const staffData = (users.data || []).reduce((acc: any, user: any) => {
        if (user.role === 'STAFF') {
          acc[user.id] = {
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
            status: user.status
          };
        }
        return acc;
      }, {});
      setStaffs(staffData);
      setUsers(users?.data || []);
    };

    fetchStaffs();
  }, []);

  return {
    staffs,
    users
  };
};

export default useStaffData;
