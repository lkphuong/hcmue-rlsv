import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { MajorEntity } from '../../../entities/major.entity';

import { LogService } from '../../log/services/log.service';

import { MajorResponse } from '../interfaces/major_response.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class MajorService {
  constructor(
    @InjectRepository(MajorEntity)
    private readonly _majorRepository: Repository<MajorEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getMajors(): Promise<MajorResponse[] | null> {
    try {
      const conditions = this._majorRepository
        .createQueryBuilder('major')
        .select('major.id AS id, major.name AS name')
        .where('major.deleted = :deleted', { deleted: 0 });

      const majors = await conditions.getRawMany<MajorResponse>();

      return majors || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'MajorService.getMajors()',
        e,
      );
      return null;
    }
  }

  async bulkAdd(
    majors: MajorEntity[],
    manager?: EntityManager,
  ): Promise<MajorEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      majors = await manager.save(majors);

      return majors || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'MajorService.bulkAdd()',
        e,
      );
      return null;
    }
  }
}
