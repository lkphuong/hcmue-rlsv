export enum ErrorMessage {
  TIME_NAN_ERROR = 'Thời gian bắt đầu không hợp lệ.',

  ACADEMIC_YEAR_NOT_FOUND_ERROR = '[Niên khóa] không tồn tại (id: %s)',
  SEMESTER_NOT_FOUND_ERROR = '[Học kì] không tồn tại (id: %s)',
  HEADER_NOT_FOUND_ERROR = '[Hạng mục đánh gía] không tồn tại (id: %s)',
  FORM_NOT_FOUND_ERROR = '[Biểu mẫu] không tồn tại (id: %s)',
  TITLE_NOT_FOUND_ERROR = '[Tiêu chí đánh giá] không tồn tại (id: %s)',

  OPERATOR_FORM_ERROR = 'Lưu thông tin biểu mẫu thất bại.',
  OPERATOR_ITEM_ERROR = 'Lưu nội dung chấm điểm thất bại.',

  FORM_ID_EMPTY_ERROR = 'Bạn vui lòng chọn biểu mẫu.',
  FORM_ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',
}
