export enum ErrorMessage {
  NO_CONTENT = 'Không có dữ liệu hiển thị.',

  CLASS_ID_EMPTY_ERROR = 'Bạn vui lòng chọn lớp.',
  DEPARTMENT_ID_EMPTY_ERROR = 'Bạn vui lòng chọn khoa.',
  SHEET_ID_EMPTY_ERROR = 'Bạn vui lòng chọn phiếu.',
  USER_ID_EMPTY_ERROR = 'Bạn vui lòng chọn nhân viên.',
  ACADEMIC_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [năm học].',
  SEMESTER_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [học kì].',

  ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  CLASS_NOT_FOUND_ERROR = 'Lớp không tồn tại (id: %s).',
  DEPARTMENT_NOT_FOUND_ERROR = 'Khoa không tồn tại (id: %s).',
  EVALUATION_NOT_FOUND_ERROR = 'Giá trị phiếu không tồn tại (id: %s).',
  HEADER_NOT_FOUND_ERROR = '[Hạng mục đánh giá] không tồn tại (id: %s)',
  ITEM_NOT_FOUND_ERROR = '[Nội dung chấm điểm] không tồn tại (id: %s)',
  LEVEL_NOT_FOUND_ERROR = 'Không tìm thấy xếp loại (điểm: %s).',
  LEVEL_BY_SORT_ORDER_NOT_FOUND_ERROR = 'Không tìm thấy xếp loại (sort_order: %s).',
  SHEET_NOT_FOUND_ERROR = 'Phiếu không tồn tại (id: %s).',
  STUDENT_NOT_FOUND_ERROR = 'Sinh viên không tồn tại (id: %s).',

  ACADEMIC_NOT_FOUND_ERROR = '[Năm học] không tồn tại (id: %s).',
  SEMESTER_NOT_FOUND_ERROR = '[Học kì] không tồn tại (id: %s)',

  CHECKBOX_MARK_INVALID_FORMAT = 'Giá trị [điểm đánh giá] không hợp lệ. Giá trị [điểm đánh giá] phải bằng [%s].',
  RANGE_MARK_INVALID_FORMAT = 'Giá trị [điểm đánh giá] tối thiểu [%s] & tối đa là [%s].',

  OUT_OF_EVALUATE_TIME_ERROR = 'Bạn đã quá hạn đánh giá.',
  ADVISER_APPROVED_ERROR = 'Cố vấn học tập đã đánh giá. Bạn không thể chỉnh sửa.',

  OPERATOR_EVALUATION_ERROR = 'Cập nhật điểm thất bại.',
  OPERATOR_SHEET_ERROR = 'Cập nhật phiếu thất bại.',

  CLASS_ROLE_INVALID_ERROR = 'Bạn không thể xem [danh sách phiếu] của lớp khác (name: %s).',
  DEPARTMENT_ROLE_INVALID_ERROR = 'Bạn không thể xem [danh sách phiếu] của khoa khác (name: %s).',
  STUDENT_ROLE_INVALID_ERROR = 'Bạn không thể xem [danh sách phiếu] của sinh viên khác (name: %s).',

  FORBIDDEN_ERROR = 'Bạn không có quyền thực hiện.',

  CANNOT_UPLOAD_FILE_ITEM_ERROR = 'Bạn không thể upload file [minh chứng]. Nội dung chấm điểm chưa được cấu hình upload file [minh chứng].',
  FILE_NOT_FOUND_ERROR = 'File [minh chứng] không tồn tại (id: %s).',
  MAXIMUM_FILE_ERROR = 'File [minh chứng] vượt quá giới hạn (size: %s).',

  OPTION_EMPTY_ERROR = 'Bạn vui lòng chọn [tùy chọn] chấm điểm cho [nội dung chấm điểm] (id: %s).',
  ITEM_NOT_CONFIG_OPTION_ERROR = '[Nội dung chấm điểm] không được cấu hình [tùy chọn] (id: %s).',
}
