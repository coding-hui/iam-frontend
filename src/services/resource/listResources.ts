import { request } from '@umijs/max';

export type ListResourceParams = {
  fuzzyName: string;
} & API.PageParams;

const url = '/api/v1/resources';

export async function listResources(params: ListResourceParams, options?: { [key: string]: any }) {
  return request<API.ResourceList>(url, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
