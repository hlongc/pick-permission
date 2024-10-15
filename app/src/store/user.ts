import { create } from "zustand";

export interface UCenterUser {
  /**
   * 用户 id
   */
  id: string;
  /**
   * 登录账号
   */
  loginName: string;
  /**
   * 用户名
   */
  name: string;
  /**
   * 所属组织 code
   */
  orgCode?: string;
  /**
   * 所属组织 id
   */
  orgId?: string;
  /**
   * 所属组织名称
   */
  orgName?: string;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 性别
   */
  gender?: 0 | 1;
  /**
   * qq
   */
  qq?: string;
  /**
   * 有权限的应用列表
   */
  apps?: {
    appId: string;
    appKey: string;
    name: string;
    platformId: string;
    platformKey: string;
    platformName: string;
  }[];
  /**
   * 拥有的角色
   */
  roles?: {
    type: number;
    id: string;
    code: string;
  }[];
  /**
   * 当前使用的组织机构。账号属于多组织机构时可切换
   */
  currentUserRootOrg?: {
    orgCode: string;
    orgId: string;
    orgName: string;
  };
  /**
   * 账号所属组织列表
   */
  rootOrgs?: {
    orgCode: string;
    orgId: string;
    orgName: string;
  }[];
  sourceId?: string;
  /**
   * 用户状态
   */
  status?: 0 | 1;
  tenantId?: string;
  /**
   * 登录凭证
   */
  token?: string;
}

interface UserStore {
  user: UCenterUser;
  token?: string;
  setUser: (val: UCenterUser, token: string) => void;
  clearUser: () => void;
}

// 定义 Zustand 状态存储
export const useUserStore = create<UserStore>((set) => ({
  user: undefined as unknown as UCenterUser,
  token: undefined,
  setUser: (newUser, token) => set({ user: newUser, token }), // 用于设置用户信息
  clearUser: () => set({ user: undefined }), // 用于清除用户信息
}));
