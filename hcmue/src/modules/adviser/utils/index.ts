import { QueryRunner } from 'typeorm';
import { Request } from 'express';

export const generateImportSuccessResponse = async (
  query_runner: QueryRunner,
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  // Commit transaction
  if (query_runner) await query_runner.commitTransaction();

  // Return object
  return {
    data: 'Thành công',
    errorCode: 0,
    message: null,
    errors: null,
  };
};
