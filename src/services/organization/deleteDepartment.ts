import { request } from '@umijs/max';

type Response = null;

export async function deleteDepartment(instanceId: string, options?: { [key: string]: any }) {
  return request<Response>(`/api/v1/departments/${instanceId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
