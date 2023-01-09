export interface OtherResponse {
  username: string;
}

export interface AccountDepartmentResponse {
  department: {
    id: number;
    name: string;
  };
  username: string;
}
