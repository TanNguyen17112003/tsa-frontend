import CookieHelper, { CookieKeys } from './cookie-helper';
import { UsersApi } from 'src/api/users';

export const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getFormData = (data: { [name: string]: any }): FormData => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v));
    } else if (typeof value != 'undefined') {
      formData.append(key, value);
    }
  });
  return formData;
};

const getRequestHeaders = async (method: string, isFormData?: boolean): Promise<any> => {
  const token = CookieHelper.getItem(CookieKeys.TOKEN);

  const headers = new Headers();
  if (token) {
    headers.append('Authorization', 'Bearer ' + token);
  }
  if (!isFormData) {
    headers.append('Content-Type', 'application/json');
  }
  return headers;
};

// Parse response date time
const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
function reviver(key: any, value: any) {
  if (typeof value === 'string' && dateFormat.test(value)) {
    return new Date(value);
  }

  return value;
}

// Attach body as search params
const getRequestUrl = (query: string, body?: any) => {
  return API_HOST + query + (body ? '?' + new URLSearchParams(body) : '');
};

const apiFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
  try {
    const response = await fetch(input, init);
    const result = await response.json();
    if (!response.ok || (response.status != 200 && response.status != 201)) {
      const message = `Error: ${result.message || response.status}`;
      throw new Error(message);
    }
    const data = JSON.stringify(result);
    return JSON.parse(data, reviver);
  } catch (error) {
    throw error;
  }
};

const refreshToken = async () => {
  const refreshToken = CookieHelper.getItem(CookieKeys.REFRESH_TOKEN);
  if (refreshToken) {
    try {
      const response = await UsersApi.refreshToken(refreshToken as string);
      if (response && response.accessToken && response.refreshToken) {
        CookieHelper.setItem(CookieKeys.TOKEN, response.accessToken);
        CookieHelper.setItem(CookieKeys.REFRESH_TOKEN, response.refreshToken);
        return response.accessToken;
      } else {
        console.error('Invalid refreshToken response:', response);
        throw new Error('Invalid refresh token');
      }
    } catch (error) {
      console.error('RefreshToken error:', error);
      throw error;
    }
  } else {
    throw new Error('No refresh token available');
  }
};

const apiFetchWithRetry = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
  try {
    return await apiFetch(input, init);
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      try {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          const headers = new Headers(init?.headers);
          headers.set('Authorization', 'Bearer ' + newAccessToken);
          return await apiFetch(input, { ...init, headers });
        }
      } catch (refreshError) {
        throw refreshError;
      }
    }
    throw error;
  }
};

export const apiPost = async (query: string, body: any) => {
  const isFormData = body instanceof FormData;
  const headers = await getRequestHeaders('POST', isFormData);
  return await apiFetchWithRetry(getRequestUrl(query), {
    method: 'POST',
    headers,
    body: isFormData ? body : JSON.stringify(body)
  });
};

export const apiDelete = async (query: string, body: any) => {
  const isFormData = body instanceof FormData;
  const headers = await getRequestHeaders('DELETE', isFormData);
  return await apiFetchWithRetry(getRequestUrl(query), {
    method: 'DELETE',
    headers,
    body: isFormData ? body : JSON.stringify(body)
  });
};

export const apiPut = async (query: string, body: any) => {
  const isFormData = body instanceof FormData;
  const headers = await getRequestHeaders('PUT', isFormData);
  return await apiFetchWithRetry(getRequestUrl(query), {
    method: 'PUT',
    headers,
    body: isFormData ? body : JSON.stringify(body)
  });
};

export const apiPatch = async (query: string, body: any) => {
  const isFormData = body instanceof FormData;
  const headers = await getRequestHeaders('PATCH', isFormData);
  return await apiFetchWithRetry(getRequestUrl(query), {
    method: 'PATCH',
    headers,
    body: isFormData ? body : JSON.stringify(body)
  });
};

export const apiGet = async (query: string, body?: any) => {
  const headers = await getRequestHeaders('GET');
  return await apiFetchWithRetry(getRequestUrl(query, body), {
    method: 'GET',
    headers
  });
};
