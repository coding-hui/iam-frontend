import { request } from '@umijs/max';

export interface CreateIdentityProviderRequest {
  name: string;
  type: string;
  category: string;
  mappingMethod?: string;
  description?: string;
  displayName?: string;
  callbackURL?: string;
  config: Record<string, any>;
}

const url = '/api/v1/identity-providers';

export async function createIdentityProvider(
  createReq: CreateIdentityProviderRequest,
  options?: { [key: string]: any },
) {
  return request(url, {
    method: 'POST',
    data: createReq,
    ...(options || {}),
  });
}
