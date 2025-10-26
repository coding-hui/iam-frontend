import { request } from '@umijs/max';

export type CreateEmailTemplateCategoryRequest = {
  name: string;
  displayName: string;
  description?: string;
};

export async function createEmailTemplateCategory(
  data: CreateEmailTemplateCategoryRequest,
  options?: { [key: string]: any },
) {
  return request<API.EmailTemplateCategory>('/api/v1/email-template-categories', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
