import { request } from '@umijs/max';

export async function deleteEmailTemplate(name: string, options?: { [key: string]: any }) {
  return request(`/api/v1/email-templates/${name}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
