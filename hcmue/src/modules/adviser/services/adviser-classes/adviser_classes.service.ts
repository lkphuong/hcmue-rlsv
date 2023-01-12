import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';

import { AdviserClassesEntity } from '../../../../entities/adviser_classes.entity';

import { LogService } from '../../../log/services/log.service';

import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';

@Injectable()
export class AdviserClassesService {
  constructor(
    @InjectRepository(AdviserClassesEntity)
    private readonly _adviserClassRepository: Repository<AdviserClassesEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getClassByAdviserId(
    adviser_id: number,
  ): Promise<AdviserClassesEntity[] | null> {
    try {
      const conditions = this._adviserClassRepository
        .createQueryBuilder('adviser_class')
        .where('adviser_class.adviser_id = :adviser_id', { adviser_id })
        .andWhere('adviser_class.active = :active', { active: true })
        .andWhere('adviser_class.deleted = :deleted', { deleted: false });

      const adviser_classes = await conditions.getMany();

      return adviser_classes || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AdviserClassesService.getClassByAdviserId()',
        e,
      );
      return null;
    }
  }

  async bulkAdd(
    adviser_classes: AdviserClassesEntity[],
    manager?: EntityManager,
  ) {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = await manager.insert(
        AdviserClassesEntity,
        adviser_classes,
      );

      return results || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'AdviserClassesService.bulkAdd()',
        e,
      );
      return null;
    }
  }

  async bulkUnlink(manager?: EntityManager) {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      const results = await manager.update(
        AdviserClassesEntity,
        {
          active: 1,
          deleted: false,
        },
        { updated_at: new Date(), updated_by: 'system', active: false },
      );
      return results.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'AdviserClassesService.bulkUnlink()',
        e,
      );
      return null;
    }
  }
}
