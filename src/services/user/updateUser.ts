import { request } from '@umijs/max';

export interface UpdateUserRequest {
  alias?: string;
  email?: string;
  phone?: string;
}

export async function updateUser(
  instanceId: string,
  updateReq: UpdateUserRequest,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/users/${instanceId}`, {
    method: 'PUT',
    data: updateReq,
    ...(options || {}),
  });
}
