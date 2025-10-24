import { request } from '@@/exports';

export type ListApiKeyOptions = {
  status?: number;
} & API.ListOptions;

export async function listApiKeys(params: ListApiKeyOptions, options?: Record<string, unknown>) {
  return request<API.ApiKeyList>('/api/v1/apikeys', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
