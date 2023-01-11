import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AdviserEntity } from '../../../../entities/adviser.entity';

import { LogService } from '../../../log/services/log.service';

import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';

@Injectable()
export class AdviserService {
  constructor(
    @InjectRepository(AdviserEntity)
    private readonly _adviserRepository: Repository<AdviserEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getAdviserByEmail(email: string): Promise<AdviserEntity | null> {
    try {
      const conditions = this._adviserRepository
        .createQueryBuilder('adviser')
        .where('adviser.email = :email', { email })
        .andWhere('adviser.deleted = :deleted', { deleted: false })
        .andWhere('adviser.active = :active', { active: false });

      const adviser = await conditions.getOne();

      return adviser || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AdviserService.getAdviserByUsername()',
        e,
      );
      return null;
    }
  }

  async bulkAdd(
    advisers: AdviserEntity[],
    manager?: EntityManager,
  ): Promise<AdviserEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      advisers = await manager.save(advisers);

      return advisers || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'AdviserService.bulkAdd()',
        e,
      );
      return null;
    }
  }

  async update(adviser: AdviserEntity, manager?: EntityManager) {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      adviser = await manager.save(adviser);

      return adviser || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'AdviserService.update()',
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
        AdviserEntity,
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
        'AdviserService.bulkUnlink()',
        e,
      );
      return null;
    }
  }
}
