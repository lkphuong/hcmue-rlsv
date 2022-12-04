import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { convertString2ObjectId } from '../../../utils';

import { LogService } from '../../log/services/log.service';

import { ClassDocument, Class } from '../../../schemas/class.schema';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name)
    private readonly _classModel: Model<ClassDocument>,
    private _logger: LogService,
  ) {}

  async getClasses(ids: Types.ObjectId[]): Promise<Class[] | null> {
    try {
      const results = await this._classModel.find({
        _id: { $in: ids },
      });

      return results || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ClassService.getClasses()',
        e,
      );
      return null;
    }
  }

  async getClassesByDepartmentId(
    department_id: string,
    class_id?: string,
  ): Promise<Class[] | null> {
    try {
      let $class: Class[] = null;

      if (!class_id) {
        $class = await this._classModel
          .find({
            departmentId: convertString2ObjectId(department_id),
          })
          .sort({ name: -1 });
      } else {
        $class = await this._classModel
          .find({
            departmentId: convertString2ObjectId(department_id),
            _id: convertString2ObjectId(class_id),
          })
          .sort({ name: -1 });
      }

      return $class || null;
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
