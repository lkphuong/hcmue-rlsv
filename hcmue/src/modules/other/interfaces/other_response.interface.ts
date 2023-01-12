export interface OtherResponse {
  username: string;
}

export interface AccountDepartmentResponse {
  id: number;
  department: {
    id: number;
    name: string;
  };
  username: string;
}
