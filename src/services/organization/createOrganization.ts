import { request } from '@umijs/max';

export interface CreateOrganizationRequest {
  name: string;
  displayName?: string;
  websiteUrl?: string;
  favicon?: string;
  disabled?: string;
  description?: string;
}

const url = '/api/v1/organizations';

export async function createOrganization(
  createReq: CreateOrganizationRequest,
  options?: { [key: string]: any },
) {
  return request(url, {
    method: 'POST',
    data: createReq,
    ...(options || {}),
  });
}
