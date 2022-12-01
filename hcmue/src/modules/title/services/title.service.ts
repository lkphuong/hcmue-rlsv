import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { TitleEntity } from '../../../entities/title.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { HeaderEntity } from 'src/entities/header.entity';

@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(TitleEntity)
    private readonly _titleService: Repository<TitleEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getTitlesByHeaderId(header_id: number): Promise<TitleEntity[] | null> {
    try {
      const conditions = this._titleService
        .createQueryBuilder('title')
        .innerJoinAndMapOne(
          'title.header',
          HeaderEntity,
          'header',
          `header.form_id = title.form_id AND 
          header.ref = title.parent_ref`,
        )
        .where('header.id = :header_id', { header_id })
        .andWhere('header.deleted = :deleted', { deleted: false })
        .andWhere('title.deleted = :deleted', { deleted: false });

      const titles = await conditions.getMany();
      return titles || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'TitleService.getTitlesByHeaderId()',
        e,
      );
      return null;
    }
  }

  async getTitleById(id: number): Promise<TitleEntity | null> {
    try {
      const conditions = this._titleService
        .createQueryBuilder('title')
        .where('title.id = :id', { id })
        .andWhere('title.deleted = :deleted', { deleted: false });

      const title = await conditions.getOne();
      return title || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'TitleService.getTitleById()',
        e,
      );
      return null;
    }
  }

  async add(
    title: TitleEntity,
    manager?: EntityManager,
  ): Promise<TitleEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      title = await manager.save(title);
      return title || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'TitleService.add()',
        e,
      );
      return null;
    }
  }

  async update(
    title: TitleEntity,
    manager?: EntityManager,
  ): Promise<TitleEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      title = await manager.save(title);
      return title || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'TitleService.update()',
        e,
      );
      return null;
    }
  }

  async unlink(
    title: TitleEntity,
    manager?: EntityManager,
  ): Promise<TitleEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      title = await manager.save(title);
      return title || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'TitleService.unlink()',
        e,
      );
      return null;
    }
  }

  async cloneTitles(
    source_form_id: number,
    target_form_id: number,
    manager?: EntityManager,
  ): Promise<boolean> {
    try {
      let success = false;

      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = await manager.query(
        `CALL sp_generate_titles (${source_form_id}, ${target_form_id})`,
      );

      console.log('results: ', results);

      if (results && results.length > 0) {
        success = results[0].success != 0;
      }

      return success;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'TitleService.cloneTitles()',
        e,
      );
      return null;
    }
  }
}
