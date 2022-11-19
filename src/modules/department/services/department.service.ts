import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

import {
  Department,
  DepartmentDocument,
} from '../../../schemas/department.schema';

import { convertString2ObjectId } from '../../../utils';
@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private readonly _departmentModel: Model<DepartmentDocument>,
    private _logger: LogService,
  ) {}

  async getDepartmentById(department_id: string): Promise<Department | null> {
    try {
      const department = await this._departmentModel.findOne({
        _id: convertString2ObjectId(department_id),
      });

      return department || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'DepartmentService.getDepartmentById()',
        e,
      );
      return null;
    }
  }
}
