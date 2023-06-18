import { request } from '@umijs/max';

export interface CreateResourceRequest {
  name?: string;
  description?: string;
  type?: string;
  method?: string;
  api?: string;
  isDefault?: boolean;
  actions?: API.Action[];
}

export async function updateResource(
  instanceId: string,
  createReq: CreateResourceRequest,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/resources/${instanceId}`, {
    method: 'PUT',
    data: createReq,
    ...(options || {}),
  });
}
