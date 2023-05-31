import { request } from '@@/exports';

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
