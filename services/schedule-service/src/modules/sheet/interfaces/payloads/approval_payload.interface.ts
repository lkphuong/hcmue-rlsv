import { SheetEntity } from '../../../../entities/sheet.entity';

export interface SheetPayload {
  payload: {
    data: SheetEntity[];
  };
}
