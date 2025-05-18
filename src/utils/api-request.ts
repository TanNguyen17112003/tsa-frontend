import CookieHelper, { CookieKeys } from './cookie-helper';

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
export const getRequestUrl = (query: string, body?: any) => {
  return API_HOST + query + (body ? '?' + new URLSearchParams(body) : '');
};

export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit | undefined) => {
  try {
    const response = await fetch(input, init);

    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
      return null;
    }

    const result = await response.json();
    if (!response.ok || (response.status !== 200 && response.status !== 201)) {
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
  return 'test';
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
  const response = await apiFetchWithRetry(getRequestUrl(query), {
    method: 'DELETE',
    headers,
    body: isFormData ? body : JSON.stringify(body)
  });

  if (response && response.status === 204) {
    return null;
  }

  return response;
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
