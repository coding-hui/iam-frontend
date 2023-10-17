import { request } from '@umijs/max';

export interface UpdateIdentityProviderRequest {
  type: string;
  category: string;
  mappingMethod?: string;
  description?: string;
  displayName?: string;
  callbackURL?: string;
  config: Record<string, any>;
}

export async function updateIdentityProvider(
  instanceId: string,
  createReq: UpdateIdentityProviderRequest,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/identity_providers/${instanceId}`, {
    method: 'PUT',
    data: createReq,
    ...(options || {}),
  });
}
