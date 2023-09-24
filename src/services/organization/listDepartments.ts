import { request } from '@@/exports';

export type ListDepartmentsOptions = API.ListOptions;

export async function listDepartments(
  params: ListDepartmentsOptions,
  options?: { [key: string]: any },
) {
  return request<API.OrganizationList>('/api/v1/departments', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
