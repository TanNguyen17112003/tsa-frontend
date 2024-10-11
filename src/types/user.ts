import { AddressData } from '@utils';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';

export type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN';
type Dormitory = 'A' | 'B';
export type UserStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export const userStatusMap = {
  'Đang online': 'AVAILABLE',
  'Đang bận': 'BUSY',
  'Đã offline': 'OFFLINE'
};

export interface User {
  id: string;
  studentId?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: string;
  verified?: boolean;
  room?: string;
  building?: string;
  dormitory?: Dormitory;
  status?: UserStatus;
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

const getRandomFirstName = (): string => {
  const firstNames = ['John', 'Jane', 'Alex', 'Chris', 'Katie'];
  return firstNames[Math.floor(Math.random() * firstNames.length)];
};

const getRandomLastName = (): string => {
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Davis'];
  return lastNames[Math.floor(Math.random() * lastNames.length)];
};

const getRandomPhoneNumber = (): string => {
  return `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
};

const getRandomEmail = (firstName: string, lastName: string): string => {
  const domains = ['example.com', 'test.com', 'demo.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
};

const getRandomUserStatus = (): UserStatus => {
  const statuses: UserStatus[] = ['AVAILABLE', 'BUSY', 'OFFLINE'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getRandomUserRole = (): UserRole => {
  const roles: UserRole[] = ['STUDENT', 'STAFF'];
  return roles[Math.floor(Math.random() * roles.length)];
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateUsers = (role: UserRole, count: number): User[] => {
  const userList: User[] = [];
  const dormitory = getRandomElement(AddressData.dormitories) as Dormitory;
  const building = getRandomElement(
    AddressData.buildings[dormitory as keyof typeof AddressData.buildings]
  );
  const room = getRandomElement(AddressData.rooms);

  for (let i = 0; i < count; i++) {
    const firstName = getRandomFirstName();
    const lastName = getRandomLastName();
    const user: User = {
      id: uuidv4(),
      firstName,
      lastName,
      phoneNumber: getRandomPhoneNumber(),
      role,
      createdAt: (new Date().getTime() / 1000).toString(), // Unix timestamp in seconds
      verified: Math.random() > 0.5,
      room: room,
      building: building,
      dormitory: dormitory,
      status: getRandomUserStatus(),
      email: getRandomEmail(firstName, lastName)
    };
    userList.push(user);
  }
  return userList;
};

export const initialStudentList: User[] = generateUsers('STUDENT', 50);
export const initialStaffList: User[] = generateUsers('STAFF', 20);
