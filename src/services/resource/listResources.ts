import { request } from '@umijs/max';

export type ListResourceOptions = API.ListOptions;

const url = '/api/v1/resources';

export async function listResources(params: ListResourceOptions, options?: { [key: string]: any }) {
  return request<API.ResourceList>(url, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
