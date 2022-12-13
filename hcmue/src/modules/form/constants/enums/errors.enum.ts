export enum ErrorMessage {
  NO_CONTENT = 'Không có dữ liệu hiển thị.',
  ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  ITEM_MARK_EMPTY_ERROR = 'Bạn vui lòng nhập [điểm] cho [tiêu chí đánh giá].',
  ITEM_MARK_MUST_BE_NOT_EQUALS_ZERO_ERROR = '[Điểm] cho [tiêu chí đánh giá] phải khác 0.',

  ITEM_RANGE_MARKS_EMPTY_ERROR = 'Bạn vui lòng nhập điểm [min] & [max] cho [tiêu chí đánh giá].',
  ITEM_RANGE_MARKS_INVALID_ERROR = 'Điểm [max] phải nhỏ hơn điểm [min].',

  ITEM_OPTIONS_EMPTY_ERROR = 'Bạn vui lòng nhập [chi tiết] cho [tiêu chí đánh giá].',

  ITEM_CHECKBOX_CATEGORY_INVALID_ERROR = 'Chỉ có thể áp dụng loại điểm [single-value] cho control [checkbox].',
  ITEM_SELECT_CATEGORY_INVALID_ERROR = 'Chỉ có thể áp dụng loại điểm [single-value] cho control [single & multiple select].',

  FORM_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [biểu mẫu].',
  FORM_NOT_FOUND_ERROR = '[Biểu mẫu] không tồn tại (id: %s)',

  FORM_PUBLISH_STATUS_INVALID_ERROR = '[Biểu mẫu] đã được phát hành (id: %s).',
  FORM_UNPUBLISH_STATUS_INVALID_ERROR = '[Biểu mẫu] chưa được phát hành (id: %s).',
  FORM_IN_PROGRESS_STATUS_INVALID_ERROR = '[Biểu mẫu] đang được xử lý (id: %s).',
  FORM_DONE_STATUS_INVALID_ERROR = '[Biểu mẫu] đã hoàn thành xử lý (id: %s).',
  MAX_MARK_HEADER_BY_FORM_ERROR = 'Tổng điểm biểu mẫu không được lớn hơn 100 (mark: %s).',

  ACADEMIC_EXISTS_FORM_PUBLISHED_IN_SEMESTER_ERROR = 'Niên khóa [%s] đã tồn tại [biểu mẫu] được phát hành trong học kỳ [%s].',

  HEADER_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [hạng mục đánh giá].',
  HEADER_NOT_FOUND_ERROR = '[Hạng mục đánh giá] không tồn tại (id: %s)',

  TITLE_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [tiêu chí đánh giá].',
  TITLE_NOT_FOUND_ERROR = '[Tiêu chí đánh giá] không tồn tại (id: %s)',

  TIME_NAN_ERROR = '[Thời gian] không hợp lệ.',
  INVALID_TIME_ERROR = '[Thời gian bắt đầu] và [thời gian kết thúc] tối thiểu 1 ngày.',

  ACADEMIC_YEAR_NOT_FOUND_ERROR = '[Niên khóa] không tồn tại (id: %s)',
  SEMESTER_NOT_FOUND_ERROR = '[Học kì] không tồn tại (id: %s)',
  ITEM_NOT_FOUND_ERROR = '[Nội dung chấm điểm] không tồn tại (id: %s)',

  ITEM_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [nội dung chấm điểm].',

  OPTION_EMPTY_ERROR = 'Bạn vui lòng chọn [tùy chọn] chấm điểm cho [nội dung chấm điểm].',
  ITEM_NOT_CONFIG_OPTION_ERROR = '[Nội dung chấm điểm] không được cấu hình [tùy chọn].',

  FROM_OR_TO_MARK_EMPTY_ERROR = 'Bạn vui lòng nhập giá trị [điểm tối thiểu] và [điểm tối đa] cho nội dung chấm điểm.',
  FROM_IN_PROGRESS_OR_DONE_ERROR = 'Bạn không thể thêm/chỉnh sửa khi [biểu mẫu] đã/đang phát hành (id: %s).',

  OPERATOR_FORM_ERROR = 'Lưu thông tin biểu mẫu thất bại.',
  OPERATOR_HEADERS_ERROR = 'Lưu nội dung tiêu đề thất bại.',
  OPERATOR_TITLE_ERROR = 'Lưu nội dung hạng mục đánh giá thất bại.',
  OPERATOR_ITEM_ERROR = 'Lưu nội dung chấm điểm thất bại.',
  OPERATOR_OPTION_ERROR = 'Lưu tùy chọn của nội dung chấm điểm thất bại.',
}
