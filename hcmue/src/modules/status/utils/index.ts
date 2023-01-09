import { Request } from 'express';
import { returnObjects } from '../../../utils';

import { StatusResponse } from '../interfaces/status_response.interface';

export const generateStatusResponse = (
  statuses: StatusResponse[],
  req: Request,
) => {
  console.log('----------------------------------------------------------');
  console.log(req.method + ' - ' + req.url);

  //Returns data
  return returnObjects(statuses);
};
