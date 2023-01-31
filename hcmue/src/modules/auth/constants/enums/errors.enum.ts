export enum ErrorMessage {
  ACCOUNT_NOT_FOUND_ERROR = 'Tài khoản không tồn tại (username: %s).',
  INVALID_TOKEN_ERROR = 'Invalid token (access_token: %s)',
  NO_TOKEN_ERROR = 'No token',
  LOGIN_FAILD = 'Tài khoản hoặc mật khẩu không hợp lệ.',

  PASSWORD_NO_MATCHING_ERROR = 'Xác nhận mật khẩu không chính xác.',
  OLD_PASSWORD_NO_MATCHING_ERROR = 'Mật khẩu hiện tại không chính xác.',

  OPERATOR_PASSWORD_ERROR = 'Cập nhật mật khẩu thất bại.',

  OPERATOR_SEND_EMAIL_ERROR = 'Gửi email thất bại.',
}
