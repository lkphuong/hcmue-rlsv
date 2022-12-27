import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';

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
    private readonly _dataSource: DataSource,
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

  async bulkAdd(
    classes: ClassEntity[],
    manager?: EntityManager,
  ): Promise<ClassEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      classes = await manager.save(classes);

      return classes || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'ClassService.bulkAdd()',
        e,
      );
      return null;
    }
  }
}
