import { SheetEntity } from '../../../../entities/sheet.entity';

export interface GenerateCreateSheetsResponse {
  payload?: SheetEntity[];
  success: boolean;
}
