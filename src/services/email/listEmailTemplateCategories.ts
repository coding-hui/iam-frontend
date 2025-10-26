import { request } from '@umijs/max';

export async function listEmailTemplateCategories(
  params?: API.ListOptions,
  options?: { [key: string]: any },
) {
  return request<API.EmailTemplateCategoryList>('/api/v1/email-template-categories', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
