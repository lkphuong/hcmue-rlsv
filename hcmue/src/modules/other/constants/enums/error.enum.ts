export enum ErrorMessage {
  PASSWORD_NO_MATCHING_ERROR = '[Mật khẩu xác nhận] không hợp lệ.',

  DEPARTMENT_HAS_EXIST_ACCOUNT_ERROR = '[Khoa] đã tồn tại account (department_id: %s).',
  ACCOUNT_UNIQUE_ERROR = '[Tài khoản] đã tồn tại (username: %s).',

  DEPARTMENT_NOT_FOUND_ERROR = '[Khoa] không tồn tại (id: %s).',
  OTHER_NOT_FOUND_ERROR = '[Tài khoản] không tồn tại (id: %s).',

  OPERATOR_OTHER_ERROR = 'Lưu thông tin [tài khoản] thất bại.',
}
