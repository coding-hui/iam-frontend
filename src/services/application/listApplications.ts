import { request } from '@@/exports';

export type ListApplicationsOptions = API.ListOptions;

export async function listApplications(
  params: ListApplicationsOptions,
  options?: { [key: string]: any },
) {
  return request<App.ApplicationList>('/api/v1/applications', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
