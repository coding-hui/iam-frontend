import { request } from '@umijs/max';

export type ListEmailTemplateOptions = {
  categoryId?: string;
  status?: string;
} & API.ListOptions;

export async function listEmailTemplates(
  params: ListEmailTemplateOptions,
  options?: { [key: string]: any },
) {
  return request<API.EmailTemplateList>('/api/v1/email-templates', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
