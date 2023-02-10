export enum ErrorMessage {
  NO_CONTENT = 'Không có dữ liệu hiển thị.',

  ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  ACADEMIC_NOT_FOUND_ERROR = '[Năm học] không tồn tại (id: %s).',
  FILE_NOT_FOUND_ERROR = '[File] sinh viên không tồn tại (id: %s)',
  SEMESTER_NOT_FOUND_ERROR = '[Học kì] không tồn tại (id: %s)',

  ACADEMIC_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [năm học].',
  FILE_ID_EMPTY_ERROR = 'Bạn vui lòng upload [file] sinh viên.',
  SEMESTER_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [học kì].',

  INVALID_EXTENSION_ERROR = `[File] sinh viên phải là file excel (extension: '.xlsx')`,

  STATUS_OPERATOR_ERROR = 'Lưu thông tin [trạng thái] thất bại.',
  DEPARTMENT_OPERATOR_ERROR = 'Lưu thông tin [khoa] thất bại.',
  MAJOR_OPERATOR_ERROR = 'Lưu thông tin [chuyên ngành] thất bại.',
  CLASS_OPERATOR_ERROR = 'Lưu thông tin [lớp] thất bại.',
  STUDENT_OPERATOR_ERROR = 'Lưu thông tin [sinh viên] thất bại.',
  K_OPERATOR_ERROR = 'Lưu thông tin [niên khóa] thất bại.',

  DATE_INVALID_FORMAT_ERROR = '[Ngày sinh] không hợp lệ (date: %s).',

  IMPORT_USERS_NO_MATCHING_TIME_ERROR = 'Tải danh sách thất bại do đang trong thời gian phát hành phiếu chấm điểm rèn luyện.',
}
