import { request } from '@@/exports';

export type ListUserParams = {
  name?: string;
  fuzzyName?: string;
} & API.PageParams;

export async function listUsers(params: ListUserParams, options?: { [key: string]: any }) {
  return request<API.UserList>('/api/v1/users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
