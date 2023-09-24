import { request } from '@umijs/max';

export interface CreateDepartmentRequest {
  name: string;
  organizationId: string;
  parentId: string;
  parentName?: string;
  displayName?: string;
  websiteUrl?: string;
  favicon?: string;
  disabled?: string;
  description?: string;
}

const url = '/api/v1/departments';

export async function createDepartment(
  createReq: CreateDepartmentRequest,
  options?: { [key: string]: any },
) {
  return request(url, {
    method: 'POST',
    data: createReq,
    ...(options || {}),
  });
}
