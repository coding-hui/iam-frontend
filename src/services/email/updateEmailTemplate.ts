import { request } from '@umijs/max';

export type UpdateEmailTemplateRequest = {
  displayName?: string;
  subject?: string;
  content?: string;
  categoryId?: string;
  description?: string;
  status?: string;
};

export async function updateEmailTemplate(
  name: string,
  data: UpdateEmailTemplateRequest,
  options?: { [key: string]: any },
) {
  return request<API.EmailTemplate>(`/api/v1/email-templates/${name}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
