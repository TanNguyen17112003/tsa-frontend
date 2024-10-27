import type { User, UserDetail } from 'src/types/user';
import { apiDelete, apiGet, apiPatch, apiPost, apiPut, getFormData } from 'src/utils/api-request';
import CookieHelper, { CookieKeys } from 'src/utils/cookie-helper';

type SignInRequest = {
  email: string;
  password: string;
};

type SignInResponse = {
  accessToken: string;
  userInfo: UserDetail;
  refreshToken: string;
};

type FirebaseSignInResponse = {
  refreshToken(REFRESH_TOKEN: CookieKeys, refreshToken: any): unknown;
  userInfo: UserDetail;
  accessToken: string;
};

type LoginFirebaseRequest = { idToken: string };

export type InitialSignUpRequest = {
  email: string;
};

export type SignUpRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  dormitory: string;
  building: string;
  photoUrl?: string;
  room: string;
  token: string;
};

export type UpdateProfileRequest = Partial<
  Pick<
    SignUpRequest,
    'firstName' | 'lastName' | 'phoneNumber' | 'dormitory' | 'building' | 'room' | 'photoUrl'
  >
>;

export class UsersApi {
  static async postUser(request: Omit<User, 'id'>): Promise<User> {
    return await apiPost('/users', request);
  }

  static async getUsers(request: {}): Promise<UserDetail[]> {
    const response = await apiGet('/users', getFormData(request));
    return response;
  }

  static async signIn(request: SignInRequest): Promise<SignInResponse> {
    return await apiPost('/auth/signin', request);
  }

  static async loginFirebase(request: LoginFirebaseRequest): Promise<FirebaseSignInResponse> {
    return await apiPost('/auth/signin/google', request);
  }

  static async initiateSignUp(request: InitialSignUpRequest): Promise<void> {
    return await apiPost('/auth/signup/initiate', request);
  }

  static async completeSignUp(request: SignUpRequest): Promise<UserDetail> {
    const response = await apiPost('/auth/signup/complete', request);
    return response;
  }

  static async me(): Promise<Partial<UserDetail>> {
    return await apiGet('/users/profile');
  }

  static async updatePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<User> {
    return await apiPut('/users/password', payload);
  }

  static async updateProfile(payload: UpdateProfileRequest): Promise<User> {
    return await apiPatch('/users/profile', payload);
  }

  static async updateUserRole(id: User['id'], role: User['role']): Promise<User> {
    return await apiPut(`/users/role/${id}`, { role });
  }

  static async deleteUser(id: User['id']) {
    return await apiDelete(`/users/${id}`, {});
  }

  static async refreshToken(refreshToken: string): Promise<SignInResponse> {
    return await apiPost('/auth/refresh', { refreshToken });
  }

  static async signOut(refreshToken: string): Promise<void> {
    return await apiPost('/auth/signout', { refreshToken });
  }
}
