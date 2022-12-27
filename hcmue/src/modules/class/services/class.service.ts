import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LogService } from '../../log/services/log.service';

import { ClassEntity } from '../../../entities/class.entity';

import { ClassResponse } from '../interfaces/class_response.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly _classRepository: Repository<ClassEntity>,
    private _logger: LogService,
  ) {}

  async getClasses(): Promise<ClassResponse[] | null> {
    try {
      const conditions = this._classRepository
        .createQueryBuilder('class')
        .select('class.id, class.name')
        .where('class.deleted = :deleted', { deleted: false });

      const classes = await conditions.getRawMany<ClassResponse>();

      return classes || null;
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

  async getClassesByIds(ids: number[]): Promise<ClassEntity[] | null> {
    try {
      const conditions = this._classRepository
        .createQueryBuilder('class')
        .where(`class.id IN (${ids.toString()})`);

      const classes = await conditions
        .orderBy('class.created_at', 'DESC')
        .getMany();
      return classes || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ClassService.getClassesByIds()',
        e,
      );
      return null;
    }
  }

  async getClassesByDepartmentId(
    department_id: number,
    class_id?: number,
  ): Promise<ClassEntity[] | null> {
    try {
      let conditions = await this._classRepository
        .createQueryBuilder('class')
        .where('class.department_id = :department_id', { department_id })
        .andWhere('class.deleted = :deleted', { deleted: false });

      if (class_id && class_id == 0) {
        conditions = conditions.andWhere('class.id = :class_id', { class_id });
      }

      const classes = await conditions
        .orderBy('class.created_at', 'DESC')
        .getMany();

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

  async getClassById(id: string): Promise<ClassEntity | null> {
    try {
      const conditions = this._classRepository
        .createQueryBuilder('class')
        .where('class.id = :id', { id })
        .andWhere('class.deleted = :deleted', { deleted: false });

      const $class = await conditions.getOne();

      return $class || null;
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
