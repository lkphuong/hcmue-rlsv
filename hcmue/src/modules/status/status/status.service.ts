import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';

import { StatusEntity } from '../../../entities/status.entity';

import { LogService } from '../../log/services/log.service';

import { StatusResponse } from '../interfaces/status_response.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(StatusEntity)
    private readonly _statusRepository: Repository<StatusEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getStatuses(): Promise<StatusResponse[] | null> {
    try {
      const conditions = this._statusRepository
        .createQueryBuilder('status')
        .select('status.id AS id, status.name AS name')
        .where('status.deleted = :deleted', { deleted: false });

      const statuses = await conditions
        .orderBy('status.created_by', 'DESC')
        .getRawMany<StatusResponse>();

      return statuses || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'StatusService.getStatuses()',
        e,
      );
      return null;
    }
  }

  async bulkAdd(
    statuses: StatusEntity[],
    manager?: EntityManager,
  ): Promise<StatusEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      statuses = await manager.save(statuses);

      return statuses || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'StatusService.bulkAdd()',
        e,
      );
      return null;
    }
  }
}
