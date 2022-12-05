export enum ErrorMessage {
  NO_CONTENT = 'Không có dữ liệu hiển thị.',
  ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  ACADEMIC_YEAR_NOT_FOUND_ERROR = '[Niên khóa] không tồn tại (id: %s)',
  CLASS_NOT_FOUND_ERROR = '[Lớp] không tồn tại (id: %s)',
  DEPARTMENT_NOT_FOUND_ERROR = '[Khoa] không tồn tại (id: %s)',
  SEMESTER_NOT_FOUND_ERROR = '[Học kì] không tồn tại (id: %s)',

  ROLE_INVALID_ERROR = 'Bạn không thể xem [thống kế phiếu] của khoa khác (khoa: %s).',
}
