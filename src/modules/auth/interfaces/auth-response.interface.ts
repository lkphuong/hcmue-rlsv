export interface ProfileResponse {
  user_id: string;
  username?: string;
  fullname?: string;
  class_id?: string;
  department_id?: string;
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
