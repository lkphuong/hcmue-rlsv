export enum ErrorMessage {
  NO_CONTENT = 'Không có dữ liệu hiển thị.',

  OPERATOR_ROLE_USER_ERROR = 'Lưu thông tin phân quyền thất bại.',

  CLASS_NOT_FOUD_ERROR = '[Lớp] không tồn tại (id: %s).',
  DEPARTMENT_NOT_FOUD_ERROR = '[Khoa] không tồn tại (id: %s).',
  ROLE_NOT_FOUND_ERROR = '[Vai trò] không tồn tại (id: %s).',
  STUDENT_NOT_FOUND_ERROR = '[Sinh viên] không tồn tại (id: %s).',

  USER_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [sinh viên].',
  USER_ID_INVALID_ERROR = 'Giá trị [user_id] không hợp lệ.',

  CANNOT_ALLOWED_CHANGLE_ROLE_ERROR = 'Không thể thay đổi quyền cho cố vấn học tập, khoa và admin.',
}
