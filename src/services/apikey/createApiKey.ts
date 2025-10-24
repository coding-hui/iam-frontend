import { request } from '@@/exports';

export async function createApiKey(
  params: API.CreateApiKeyRequest,
  options?: Record<string, unknown>,
) {
  return request<API.ApiKey>('/api/v1/apikeys', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}
