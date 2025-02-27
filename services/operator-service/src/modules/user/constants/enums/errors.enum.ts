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
}
