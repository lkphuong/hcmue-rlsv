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

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
    private _logger: LogService,
  ) {}

  async getAllDepartments(): Promise<Department[] | null> {
    try {
      const departments = await this.departmentModel.find();

      return departments || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'DepartmentService.getAllDepartments()',
        e,
      );
      return null;
    }
  }
}
