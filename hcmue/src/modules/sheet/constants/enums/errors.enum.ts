export enum ErrorMessage {
  NO_CONTENT = 'Không có dữ liệu hiển thị.',

  CLASS_ID_EMPTY_ERROR = 'Bạn vui lòng chọn lớp.',
  DEPARTMENT_ID_EMPTY_ERROR = 'Bạn vui lòng chọn khoa.',
  SHEET_ID_EMPTY_ERROR = 'Bạn vui lòng chọn phiếu.',
  USER_ID_EMPTY_ERROR = 'Bạn vui lòng chọn nhân viên.',

  ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  CLASS_NOT_FOUND_ERROR = 'Lớp không tồn tại (id: %s).',
  DEPARTMENT_NOT_FOUND_ERROR = 'Khoa không tồn tại (id: %s).',
  EVALUATION_NOT_FOUND_ERROR = 'Giá trị biểu mẫu không tồn tại (id: %s).',
  HEADER_NOT_FOUND_ERROR = '[Hạng mục đánh giá] không tồn tại (id: %s)',
  ITEM_NOT_FOUND_ERROR = 'Nội dung chấm điểm không tồn tại (id: %s)',
  LEVEL_NOT_FOUND_ERROR = 'Không tìm thấy xếp loại (điểm: %s).',
  SHEET_NOT_FOUND_ERROR = 'Phiếu không tồn tại (id: %s).',
  STUDENT_NOT_FOUND_ERROR = 'Sinh viên không tồn tại (id: %s).',

  SINGLE_MARK_INVALID_FORMAT = 'Giá trị [điểm đánh giá] tối đa là [%s].',
  RANGE_MARK_INVALID_FORMAT = 'Giá trị [điểm đánh giá] tối thiểu [%s] & tối đa là [%s].',

  OUT_OF_EVALUATE_TIME_ERROR = 'Bạn đã quá hạn đánh giá (level: %s, time: %s).',

  OPERATOR_EVALUATION_ERROR = 'Cập nhật điểm thất bại.',
  OPERATOR_SHEET_ERROR = 'Cập nhật phiếu thất bại.',

  CLASS_ROLE_INVALID_ERROR = 'Bạn không thể xem [danh sách phiếu] của lớp khác (name: %s).',
  DEPARTMENT_ROLE_INVALID_ERROR = 'Bạn không thể xem [danh sách phiếu] của khoa khác (name: %s).',
  STUDENT_ROLE_INVALID_ERROR = 'Bạn không thể xem [danh sách phiếu] của sinh viên khác (name: %s).',

  FORBIDDEN_ERROR = 'Bạn không có quyền thực hiện.',
}
