declare namespace API {
  // Standard object's metadata.
  type ObjectMeta = {
    name: string;
    instanceId: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type CurrentUser = {
    metadata?: ObjectMeta;
    avatar?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    address?: string;
    disabled?: string;
    phone?: string;
    alias?: string;
    email?: string;
    status?: string;
    lastLoginTime?: string;
  };

  type PageInfo = {
    data: any[];
    total: number;
  };

  type LoginResult = {
    access_token?: string;
    status: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    /** 查询关键字 */
    keyword?: string;
  };

  type UserInfo = {
    metadata: ObjectMeta;
    password?: string;
    avatar?: string;
    address?: string;
    disabled?: string;
    phone?: string;
    alias?: string;
    email?: string;
    status?: string;
    lastLoginTime?: string;
  };

  type UserList = {
    list: UserInfo[];
    total: number;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type Action = {
    name: string;
    description?: string;
  };

  type Resource = {
    metadata: ObjectMeta;
    method: string;
    api: string;
    type: string;
    description?: string;
    actions: Action[];
    status?: string;
  };

  type ResourceList = {
    list: Resource[];
    total: number;
  };

  type Statement = {
    effect: boolean;
    resource: string;
    resourceIdentifier: string;
    actions: string[];
  };

  type Policy = {
    metadata: ObjectMeta;
    subjects: string[];
    resources: Resource[];
    statements: Statement[];
    type: string;
    owner: string;
    description: string;
    status?: string;
  };

  type PolicyList = {
    list: Policy[];
    total: number;
  };

  type Role = {
    metadata: ObjectMeta;
    owner: string;
    description: string;
    disabled: boolean;
    users: API.UserInfo[];
  };

  type RoleList = {
    list: Role[];
    total: number;
  };
}
