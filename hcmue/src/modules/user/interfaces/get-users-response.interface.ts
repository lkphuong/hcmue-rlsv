export interface BaseMongoResponse {
  id: string;
  name: string;
}

export interface UserResponse {
  user_id: string;
  std_code: string;
  name: string;
  department: BaseMongoResponse;
  classes: BaseMongoResponse;
  role: number;
}
