import { request } from '@umijs/max';

export interface UpdateApplicationRequest {
  type: string;
  homepageUrl?: string;
  logo?: string;
  description?: string;
  displayName?: string;
  identityProviderIds?: string[];
  config?: Record<string, any>;
}

export async function updateApplication(
  instanceId: string,
  createReq: UpdateApplicationRequest,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/applications/${instanceId}`, {
    method: 'PUT',
    data: createReq,
    ...(options || {}),
  });
}
