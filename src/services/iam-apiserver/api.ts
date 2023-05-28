// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/v1/auth/user-info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
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

/** 获取规则列表 GET /api/rule */
export async function listUsers(
  params: {
    // query
    /** 当前的页码 */
    offset?: number;
    /** 页面的容量 */
    limit?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.UserList>('/api/v1/users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateUser(options?: { [key: string]: any }) {
  return request<API.UserInfo>('/api/v1/users', {
    method: 'PUT',
    ...(options || {}),
  });
}

export async function addUser(options?: { [key: string]: any }) {
  return request<API.UserInfo>('/api/v1/users', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function removeUser(name?: string) {
  return request<Record<string, any>>(`/api/v1/users/${name}`, {
    method: 'DELETE',
  });
}
