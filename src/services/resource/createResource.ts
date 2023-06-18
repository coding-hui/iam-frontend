import { request } from '@umijs/max';

export interface CreateResourceRequest {
  name?: string;
  description?: string;
  type?: string;
  method?: string;
  api?: string;
  isDefault?: boolean;
  actions?: string[];
}

export async function createResource(
  createReq: CreateResourceRequest,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/resources`, {
    method: 'POST',
    data: createReq,
    ...(options || {}),
  });
}
