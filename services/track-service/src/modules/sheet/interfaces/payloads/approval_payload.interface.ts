import { SheetEntity } from '../../../../entities/sheet.entity';

export interface ApprovalPayload {
  payload: {
    page: number;
    data: SheetEntity[];
  };
}
