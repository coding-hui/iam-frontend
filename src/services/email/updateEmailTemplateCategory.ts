import { request } from '@umijs/max';

export type UpdateEmailTemplateCategoryRequest = {
  displayName?: string;
  description?: string;
  status?: string;
};

export async function updateEmailTemplateCategory(
  name: string,
  data: UpdateEmailTemplateCategoryRequest,
  options?: { [key: string]: any },
) {
  return request<API.EmailTemplateCategory>(`/api/v1/email-template-categories/${name}`, {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}
