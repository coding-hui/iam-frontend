import { request } from '@umijs/max';

export async function getApplication(instanceId: string) {
  return request<App.Application>(`/api/v1/applications/${instanceId}`, {
    method: 'GET',
  });
}

export async function getApplicationPublicConfig(instanceId: string) {
  return request<App.Application>(`/api/v1/applications/public/${instanceId}/config`, {
    method: 'GET',
  });
}
