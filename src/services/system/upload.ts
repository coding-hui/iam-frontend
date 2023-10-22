import { request } from '@umijs/max';
import { RcFile } from 'antd/es/upload';

export async function uploadFile(
  file: string | RcFile | Blob,
  fileName?: string,
): Promise<API.ApiResult<string>> {
  const formData = new FormData();
  formData.append('file', file);
  if (fileName) formData.append('fileName', fileName);
  return request('/api/v1/storage/upload', { method: 'POST', data: formData });
}
