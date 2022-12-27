export interface ProfileResponse {
  user_id: number;
  username?: string;
  fullname?: string;
  class_id?: number;
  department_id?: number;
  role?: number;
}

export interface UserResponse extends ProfileResponse {
  username: string;
}

export interface AuthResponse {
  success: boolean;
  payload: UserResponse | null;
  error?: string;
}
