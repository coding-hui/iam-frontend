export type Resource = {
  metadata: API.ObjectMeta;
  method: string;
  api: string;
  type: string;
  description: string;
  status?: string;
};

export type ResourceList = {
  list: Resource[];
  total: number;
};
