// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/v1/auth/user-info', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * Bind external account to existing user
 * @param body Bind external account parameters
 * @param options Request options
 */
export async function bindExternalAccount(
  body: API.BindExternalAccountParams,
  options?: { [key: string]: any },
) {
  return request<API.LoginResult>('/api/v1/auth/bind-external', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * Unbind external account from user
 * @param body Unbind external account parameters
 * @param options Request options
 */
export async function unbindExternalAccount(
  body: API.UnbindExternalAccountParams,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/v1/auth/unbind-external', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
