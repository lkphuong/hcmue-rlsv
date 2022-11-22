import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { HeaderEntity } from '../../../entities/header.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class HeaderService {
  constructor(
    @InjectRepository(HeaderEntity)
    private readonly _headerRepository: Repository<HeaderEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getHeadersByFormId(id: number): Promise<HeaderEntity[] | null> {
    try {
      const conditions = this._headerRepository
        .createQueryBuilder('header')
        .where('header.form_id = :id', { id });

      const headers = await conditions.getMany();

      return headers || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'HeaderService.getHeadersByFormId()',
        e,
      );
      return null;
    }
  }

  async getHeaderById(id: number): Promise<HeaderEntity | null> {
    try {
      const conditions = this._headerRepository
        .createQueryBuilder('header')
        .where('heaer.id = :id', { id })
        .andWhere('header.deleted = :deleted', { deleted: false });

      const header = await conditions.getOne();

      return header || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'HeaderService.getHeaderById()',
        e,
      );
      return null;
    }
  }


  async add(
    header: HeaderEntity,
    manager?: EntityManager,
  ): Promise<HeaderEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      header = await manager.save(header);

      return header || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'HeaderService.add()',
        e,
      );
      return null;
    }
  }

  async update(
    header: HeaderEntity,
    manager?: EntityManager,
  ): Promise<HeaderEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      header = await manager.save(header);

      return header || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'HeaderService.update()',
        e,
      );
      return null;
    }
  }
}
