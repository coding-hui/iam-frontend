import { request } from '@umijs/max';

export interface CreateUserRequest {
  name: string;
  alias?: string;
  password?: string;
  email?: string;
  phone?: string;
  disabled?: boolean;
  status?: string;
  resetPasswordOnFirstLogin?: boolean;
}

const url = '/api/v1/users';

export async function createUser(createReq: CreateUserRequest, options?: { [key: string]: any }) {
  return request(url, {
    method: 'POST',
    data: createReq,
    ...(options || {}),
  });
}
