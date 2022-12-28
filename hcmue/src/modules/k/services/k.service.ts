import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { KEntity } from 'src/entities/k.entity';

import { LogService } from '../../log/services/log.service';

import { KResponse } from '../interfaces/k_response.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class KService {
  constructor(
    @InjectRepository(KEntity)
    private readonly _kRepository: Repository<KEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getAll(): Promise<KResponse[] | null> {
    try {
      const conditions = this._kRepository
        .createQueryBuilder('k')
        .select('k.id AS id, k.name AS name')
        .where('k.deleted = :deleted', { deleted: false });

      const k = await conditions.getRawMany<KResponse>();

      return k || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'KService.getAll()',
        e,
      );
      return null;
    }
  }

  async getKById(k_id: number): Promise<KEntity | null> {
    try {
      const conditions = await this._kRepository
        .createQueryBuilder('k')
        .where('k.id = :k_id', { k_id })
        .andWhere('k.deleted = :deleted', { deleted: false });

      const k = await conditions.getOne();

      return k || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'KService.getKById()',
        e,
      );
      return null;
    }
  }

  async bulkAdd(
    k: KEntity[],
    manager?: EntityManager,
  ): Promise<KEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      k = await manager.save(k);

      return k || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'KService.bulkAdd()',
        e,
      );
      return null;
    }
  }
}
