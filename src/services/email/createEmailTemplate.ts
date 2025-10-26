import { request } from '@umijs/max';

export type CreateEmailTemplateRequest = {
  name: string;
  displayName: string;
  subject: string;
  content: string;
  categoryId?: string;
  description?: string;
  status?: string;
};

export async function createEmailTemplate(
  data: CreateEmailTemplateRequest,
  options?: { [key: string]: any },
) {
  return request<API.EmailTemplate>('/api/v1/email-templates', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
