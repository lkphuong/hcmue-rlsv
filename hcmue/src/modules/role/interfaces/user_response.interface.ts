export interface BaseMongoResponse {
  id: string;
  name: string;
}

export interface UserResponse {
  user_id: string;
  name: string;
  department: BaseMongoResponse;
  classes: BaseMongoResponse;
  role: number;
}

export interface RoleUserResponse {
  id: number;
  name: string;
}
