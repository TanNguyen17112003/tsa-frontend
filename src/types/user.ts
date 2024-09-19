import * as yup from 'yup';

type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN';
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: string;
  verified?: boolean;
  email: string;
  iat?: number;
  exp?: number;
}

export interface UserDetail extends User {}

export const userSchema = yup.object().shape({
  username: yup.string().required('Vui lòng nhập username'),
  email: yup.string().email('Vui lòng nhập đúng định dạng email').required('Vui lòng nhập email'),
  full_name: yup.string().required('Vui lòng nhập name'),
  password: yup.string().required('Vui lòng nhập password')
});

export const initialUser: UserDetail = {
  id: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  role: 'STUDENT',
  createdAt: '',
  verified: false,
  email: ''
};
