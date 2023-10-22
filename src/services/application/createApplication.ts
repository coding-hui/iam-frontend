import { request } from '@umijs/max';

export interface CreateApplicationRequest {
  name: string;
  type: string;
  homepageUrl?: string;
  logo?: string;
  description?: string;
  displayName?: string;
  identityProviderIds?: string[];
  config?: Record<string, any>;
}

const url = '/api/v1/applications';

export async function createApplication(
  createReq: CreateApplicationRequest,
  options?: { [key: string]: any },
) {
  return request(url, {
    method: 'POST',
    data: createReq,
    ...(options || {}),
  });
}
