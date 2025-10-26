import { request } from '@umijs/max';

export async function deleteEmailTemplateCategory(name: string, options?: { [key: string]: any }) {
  return request(`/api/v1/email-template-categories/${name}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
