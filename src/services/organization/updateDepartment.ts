import { request } from '@umijs/max';

export interface UpdateDepartmentRequest {
  displayName?: string;
  websiteUrl?: string;
  favicon?: string;
  description?: string;
  parentId: string;
  organizationId: string;
}

export async function updateDepartment(
  instanceId: string,
  updateReq: UpdateDepartmentRequest,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/departments/${instanceId}`, {
    method: 'PUT',
    data: updateReq,
    ...(options || {}),
  });
}
