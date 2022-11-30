export enum ApprovalValue {
  'VALUE_PENDING' = 0,
  'VALUE_APPROVED' = 1,
  'VALUE_DENIED' = 2,

  'LABEL_PENDING' = 'Chưa xác nhận',
  'LABEL_APPROVED' = 'Đã duyệt',
  'LABEL_DENIED' = 'Từ chối',
}

export enum ApprovalStatus {
  PENDING = 0,
  APPROVED = 1,
  DENIED = 2,
}

export enum ProgressStatus {
  PENDING = 0,
  IN_PROGRESS = 1,
  NEXT = 2,
  DONE = 3,
  FAILED = 4,
}
