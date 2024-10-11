import { useState, useEffect } from 'react';
import { UsersApi } from 'src/api/users';
import useFunction from 'src/hooks/use-function';

const useStaffData = () => {
  const getUsersApi = useFunction(UsersApi.getUsers);
  const [staffs, setStaffs] = useState<{ [key: string]: { firstName: string; lastName: string } }>(
    {}
  );

  useEffect(() => {
    const fetchStaffs = async () => {
      const users = await getUsersApi.call({});
      const staffData = (users.data || []).reduce((acc: any, user: any) => {
        if (user.role === 'STAFF') {
          acc[user.id] = { firstName: user.firstName, lastName: user.lastName };
        }
        return acc;
      }, {});
      setStaffs(staffData);
    };

    fetchStaffs();
  }, [getUsersApi]);

  return staffs;
};

export default useStaffData;
