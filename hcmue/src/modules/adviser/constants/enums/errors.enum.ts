export enum ErrorMessage {
  NO_CONTENT = 'Không có dữ liệu hiển thị.',

  ACADEMIC_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [năm học].',
  FILE_ID_EMPTY_ERROR = 'Bạn vui lòng upload [file] sinh viên.',

  ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  ACADEMIC_NOT_FOUND_ERROR = '[Năm học] không tồn tại (id: %s).',

  FILE_NOT_FOUND_ERROR = '[File] cố vấn học tập không tồn tại (id: %s)',

  INVALID_EXTENSION_ERROR = `[File] cố vấn học tập phải là file excel (extension: '.xlsx')`,

  ADVISER_OPERATOR_ERROR = 'Lưu thông tin [cố vấn học tập] thất bại.',

  FILE_EXCEL_NO_CONTENT = 'File không có dữ liệu.',
}
