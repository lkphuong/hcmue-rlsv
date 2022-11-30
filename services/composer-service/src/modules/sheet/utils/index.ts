import { SheetEntity } from '../../../entities/sheet.entity';
import { GenerateCreateSheetsResponse } from '../interfaces/responses/create-sheet-response.interface';

export const generateResponse = async (
  sheets: SheetEntity[] | null,
  success: boolean,
) => {
  const response: GenerateCreateSheetsResponse = {
    payload: sheets,
    success: success,
  };

  return response;
};
