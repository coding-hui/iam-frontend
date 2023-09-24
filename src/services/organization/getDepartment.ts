import { request } from '@umijs/max';

export async function getDepartment(instanceId: string) {
  return request<API.Organization>(`/api/v1/departments/${instanceId}`, {
    method: 'GET',
  });
}
