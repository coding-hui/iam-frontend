import { request } from '@@/exports';

export type ListUserOptions = API.ListOptions;

export async function listUsers(params: ListUserOptions, options?: { [key: string]: any }) {
  return request<API.UserList>('/api/v1/users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
