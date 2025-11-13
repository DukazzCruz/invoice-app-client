import { ApiResponse, ApiError } from '../types';
import Constants from 'expo-constants';

const DEFAULT_TIMEOUT = 8000;
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  // Fallback to app.config.ts extra.apiUrl (computed local IP)
  ((Constants?.expoConfig as any)?.extra?.apiUrl as string | undefined) ||
  'http://10.0.0.91:3333';

const withTimeout = <T>(promise: Promise<T>, timeout: number = DEFAULT_TIMEOUT): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout),
    ),
  ]);

interface FetchConfig {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

export const api = async (
  url: string,
  method: string,
  body: any = null,
  headers: Record<string, string> = {}
): Promise<Response> => {
  const endpoint = `${BASE_URL}${url}`;
  const fetchConfig: FetchConfig = {
    method,
    headers: {
      ...headers,
    },
  };

  if (body !== null) {
    fetchConfig.headers['Content-Type'] = 'application/json';
    fetchConfig.body = JSON.stringify(body);
  }

  return withTimeout(fetch(endpoint, fetchConfig));
};

export interface FetchApiResult {
  token: string | null;
  success: boolean;
  responseBody: ApiResponse | ApiError | null;
}

export const fetchApi = async (
  url: string,
  method: string,
  body: any,
  expectedStatus: number,
  token: string | null = null,
): Promise<FetchApiResult> => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['x-auth'] = token;
  }

  const response = await api(url, method, body, headers);
  const result: FetchApiResult = {
    token: null,
    success: response.status === expectedStatus,
    responseBody: null,
  };

  const text = await response.text();
  let payload: ApiResponse | ApiError | null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (error) {
    payload = text as any;
  }
  result.responseBody = payload;

  const authHeader = response.headers.get('x-auth');
  if (authHeader) {
    result.token = authHeader;
  }

  if (!result.success) {
    throw result;
  }

  return result;
};

