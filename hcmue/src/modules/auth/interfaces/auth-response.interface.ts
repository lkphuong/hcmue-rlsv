export interface ProfileResponse {
  user_id: number;
  username?: string;
  fullname?: string;
  class_id?: number[];
  department_id?: number;
  role?: number;
  classes?: ClassResponse[];
}

export interface ClassResponse {
  id: number;
  code: string;
  name: string;
}

export interface UserResponse extends ProfileResponse {
  username: string;
}

export interface AuthResponse {
  success: boolean;
  payload: UserResponse | null;
  error?: string;
}

export interface VerifyTokenResponse {
  email: string;
  type: number;
}
