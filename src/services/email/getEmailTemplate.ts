import { request } from '@umijs/max';

export async function getEmailTemplate(name: string, options?: { [key: string]: any }) {
  return request<API.EmailTemplate>(`/api/v1/email-templates/${name}`, {
    method: 'GET',
    ...(options || {}),
  });
}
