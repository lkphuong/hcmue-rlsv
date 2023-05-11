import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { HeaderEntity } from '../../../entities/header.entity';

import { LogService } from '../../log/services/log.service';

import { StoreProcedureResponse } from '../../form/interfaces/store-procedure-response.interface';

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
        .where('header.form_id = :id', { id })
        .andWhere('header.deleted = :deleted', { deleted: false });

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
        .where('header.id = :id', { id })
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

  async getHeaderByIds(ids: number[]): Promise<HeaderEntity[] | null> {
    try {
      const conditions = this._headerRepository
        .createQueryBuilder('header')
        .whereInIds(ids)
        .andWhere('header.deleted = false');

      const headers = await conditions.getMany();

      return headers || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'HeaderService.getHeaderByIds()',
        e,
      );
      return null;
    }
  }

  async sumMaxMarkHeaderByFormId(
    form_id: number,
    header_id?: number,
  ): Promise<number> {
    try {
      let conditions = this._headerRepository
        .createQueryBuilder('header')
        .select('SUM(header.max_mark)', 'sum')
        .where('header.form_id = :form_id', { form_id })
        .andWhere('header.deleted = :deleted', { deleted: false });

      if (header_id && header_id != 0) {
        conditions = conditions.andWhere('header.id != :header_id', {
          header_id,
        });
      }

      const { sum } = await conditions.getRawOne();

      return sum || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'HeaderService.sumMaxMarkHeaderByFormId()',
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

  async unlink(
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
        Methods.DELETE,
        'HeaderService.unlink()',
        e,
      );
      return null;
    }
  }

  async cloneHeaders(
    source_form_id: number,
    target_form_id: number,
    manager?: EntityManager,
  ): Promise<boolean> {
    try {
      let success = false;

      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = (await manager.query(
        `CALL sp_generate_headers (${source_form_id}, ${target_form_id})`,
      )) as StoreProcedureResponse[];

      if (results && results.length > 0) {
        success = results[0].success != 0;
      }

      return success;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'HeaderService.cloneHeaders()',
        e,
      );
      return null;
    }
  }
}
