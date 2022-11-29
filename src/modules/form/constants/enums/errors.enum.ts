export enum ErrorMessage {
  NO_CONTENT = 'Không có dữ liệu hiển thị.',
  ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  FORM_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [biểu mẫu].',
  FORM_NOT_FOUND_ERROR = '[Biểu mẫu] không tồn tại (id: %s)',

  FORM_PUBLISH_STATUS_INVALID_ERROR = '[Biểu mẫu] đã được phát hành (id: %s).',
  FORM_UNPUBLISH_STATUS_INVALID_ERROR = '[Biểu mẫu] chưa được phát hành (id: %s).',
  FORM_IN_PROGRESS_STATUS_INVALID_ERROR = '[Biểu mẫu] đang được xử lý (id: %s).',
  FORM_DONE_STATUS_INVALID_ERROR = '[Biểu mẫu] đã hoàn thành xử lý (id: %s).',

  ACADEMIC_EXISTS_FORM_PUBLISHED_IN_SEMESTER_ERROR = 'Niên khóa [%s] đã tồn tại [biểu mẫu] được phát hành trong học kỳ [%s].',

  HEADER_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [hạng mục đánh giá].',
  HEADER_NOT_FOUND_ERROR = '[Hạng mục đánh giá] không tồn tại (id: %s)',

  TITLE_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [tiêu chí đánh giá].',
  TITLE_NOT_FOUND_ERROR = '[Tiêu chí đánh giá] không tồn tại (id: %s)',

  TIME_NAN_ERROR = '[Thời gian] không hợp lệ.',

  ACADEMIC_YEAR_NOT_FOUND_ERROR = '[Niên khóa] không tồn tại (id: %s)',
  SEMESTER_NOT_FOUND_ERROR = '[Học kì] không tồn tại (id: %s)',

  ITEM_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [nội dung chấm điểm].',
  ITEM_NOT_FOUND_ERROR = '[Nội dung chấm điểm] không tồn tại (id: %s)',

  OPERATOR_FORM_ERROR = 'Lưu thông tin biểu mẫu thất bại.',
  OPERATOR_HEADERS_ERROR = 'Lưu nội dung tiêu đề thất bại.',
  OPERATOR_TITLE_ERROR = 'Lưu nội dung hạng mục đánh giá thất bại.',
  OPERATOR_ITEM_ERROR = 'Lưu nội dung chấm điểm thất bại.',
}
