export enum ErrorMessage {
  NO_CONTENT = 'Không có dữ liệu hiển thị.',

  CLASS_ID_EMPTY_ERROR = 'Bạn vui lòng chọn lớp.',
  DEPARTMENT_ID_EMPTY_ERROR = 'Bạn vui lòng chọn khoa.',
  SHEET_ID_EMPTY_ERROR = 'Bạn vui lòng chọn phiếu.',
  USER_ID_EMPTY_ERROR = 'Bạn vui lòng chọn nhân viên.',

  ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  EVALUATION_NOT_FOUND_ERROR = 'Giá trị biểu mẫu không tồn tại (id: %s).',
  ITEM_NOT_FOUND_ERROR = 'Nội dung chấm điểm không tồn tại (id: %s)',
  LEVEL_NOT_FOUND_ERROR = 'Không tìm thấy xếp loại (điểm: %s).',
  SHEET_NOT_FOUND_ERROR = 'Phiếu không tồn tại (id: %s).',

  SINGLE_MARK_INVALID_FORMAT = 'Giá trị [điểm đánh giá] tối đa là [%s].',
  RANGE_MARK_INVALID_FORMAT = 'Giá trị [điểm đánh giá] tối thiểu [%s] & tối đa là [%s].',

  OUT_OF_EVALUATE_TIME_ERROR = 'Bạn đã quá hạn đánh giá (level: %s, time: %s).',

  OPERATOR_EVALUATION_ERROR = 'Cập nhật điểm thất bại.',
  OPERATOR_SHEET_ERROR = 'Cập nhật phiếu thất bại.',

  FORBIDDEN_ERROR = 'Bạn không có quyền thực hiện.',
}
