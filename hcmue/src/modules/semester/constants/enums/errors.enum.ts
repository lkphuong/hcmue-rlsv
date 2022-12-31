export enum ErrorMessage {
  SEMESTERS_NO_CONTENT = 'Không có dữ liệu hiển thị.',

  TIME_SEMESTER_NO_MATCHING_ERROR = 'Thời gian [học kì] không thuộc năm học (năm học: %s).',
  SEMESTER_NOT_FOUND_ERROR = 'Học kì không tồn tại (id: %s).',

  SEMESTER_ID_EMPTY_ERROR = 'Bạn vui lòng chọn [học kì].',
  SEMESTER_ID_NAN_ERROR = 'Giá trị [id] không hợp lệ.',

  UNLINK_SEMESTER_IN_ANY_FORM_ERROR = 'Bạn không thể xóa [học kỳ] đã tồn tại [biểu mẫu] (id: %s).',

  TIME_SEMESTER_INVALID_DATES_ERROR = 'Giá trị thời gian bắt đầu phải nhỏ hơn ngày kết thúc.',

  OPERATOR_SEMESTER_ERROR = 'Lưu thông tin học kì thất bại.',
}
