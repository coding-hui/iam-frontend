import { request } from '@umijs/max';

export interface UpdateOrganizationRequest {
  displayName?: string;
  websiteUrl?: string;
  favicon?: string;
  description?: string;
}

export async function updateOrganization(
  instanceId: string,
  updateReq: UpdateOrganizationRequest,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/organizations/${instanceId}`, {
    method: 'PUT',
    data: updateReq,
    ...(options || {}),
  });
}
