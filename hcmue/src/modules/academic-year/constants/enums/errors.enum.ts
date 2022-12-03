export enum ErrorMessage {
  ACADEMIC_YEARS_NO_CONTENT = 'Không có dữ liệu hiển thị.',
  FROM_ACADEMIC_YEAR_INVALID_ERROR = '[Năm bắt đầu] không được phép lớn hơn [năm kết thúc].',
  ACADEMIC_YEAR_DUPLICATE_ERROR = 'Niên khóa đã tồn tại (niên khóa: %s).',

  ACADEMIC_YEAR_NOT_FOUND_ERROR = 'Niên khóa không tồn tại (id: %s).',

  UNLINK_ACADEMIC_YEAR_IN_ANY_FORM_ERROR = 'Bạn không thể xóa [niên khóa] đã tồn tại [biểu mẫu] (id: %s).',

  ACADEMIC_YEAR_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [niên khóa].',
  ACADEMIC_YEAR_ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  OPERATOR_ACADEMIC_YEAR_ERROR = 'Lưu thông tin niên khóa thất bại.',
}
