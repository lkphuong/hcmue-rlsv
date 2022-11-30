import { SheetEntity } from '../../../../entities/sheet.entity';

export interface CreateSheetPayload {
  payload: SheetEntity[];
  success: boolean;
}

export interface SheetEntityPayload {
  payload: {
    data: SheetEntity[];
  };
}
