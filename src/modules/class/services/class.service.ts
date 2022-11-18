import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

import { ClassDocument, Class } from '../../../schemas/class.schema';

import { convertString2ObjectId } from 'src/utils';
@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name)
    private readonly _classModel: Model<ClassDocument>,
    private _logger: LogService,
  ) {}

  async getClassesByDepartmentId(
    department_id: string,
  ): Promise<Class[] | null> {
    try {
      const classes = await this._classModel.find({
        departmentId: convertString2ObjectId(department_id),
      });

      return classes || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ClassService.getClassesByDepartmentId()',
        e,
      );
      return null;
    }
  }

  async getClassById(id: string, department_id: string): Promise<Class | null> {
    try {
      console.log('id: ', id, 'department: ', department_id);
      const result = await this._classModel.findOne({
        _id: convertString2ObjectId(id),
        departmentId: convertString2ObjectId(department_id),
      });

      return result || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ClassService.getClassById()',
        e,
      );
      return null;
    }
  }
}
