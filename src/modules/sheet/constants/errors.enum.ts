export enum ErrorMessage {
  NO_CONTENT = 'Không có dữ liệu hiển thị.',

  SHEET_NOT_FOUND_ERROR = 'Biểu mẫu không tồn tại (id: %s).',

  DEPARTMENT_ID_EMPTY_ERROR = 'Bạn vui lòng chọn khoa.',
  SHEET_ID_EMPTY_ERROR = 'Bạn vui lòng chọn phiếu.',
  USER_ID_EMPTY_ERROR = 'Bạn vui lòng chọn nhân viên.',

  ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  EVALUATION_NOT_FOUND_ERROR = 'Giá trị biểu mẫu không tồn tại (id: %s).',

  ITEM_NOT_FOUND_ERROR = 'Nội dung chấm điểm không tồn tại (id: %s)',

  SINGLE_MARK_INVALID_FORMAT = 'Giá trị [điểm đánh giá] tối đa là [%s].',
  RANGE_MARK_INVALID_FORMAT = 'Giá trị [điểm đánh giá] tối thiểu [%s] & tối đa là [%s].',
  MARK_NOT_FOUND_ERROR = 'Điểm của bạn không tồn tại (điểm: %s).',

  PAST_APPROVAL_TIME_ERROR = 'Hết thời hạn phê duyệt.',
  OPERATOR_MULTI_APPROVAL_ERROR = 'Cập nhật điểm thất bại.',
  FORBIDDEN_ERROR = 'Bạn không có quyền thực hiện.',
}
