import { request } from '@@/exports';

export type ListOrganizationOptions = API.ListOptions;

export async function listOrganizations(
  params: ListOrganizationOptions,
  options?: { [key: string]: any },
) {
  return request<API.OrganizationList>('/api/v1/organizations', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
