export interface RoleUserResponse {
  id: number;
  name: string;
}

export interface CheckRoleUserResponse {
  user: UserResponse;
  role: RoleResponse;
}

export interface RoleResponse {
  id: number;
  name: string;
}

export interface UserResponse {
  id: number;
  name: string;
}
