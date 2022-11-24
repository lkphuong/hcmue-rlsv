import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { TitleEntity } from '../../../entities/title.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(TitleEntity)
    private readonly _titleService: Repository<TitleEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getTitlesByHeaderId(id: number): Promise<TitleEntity[] | null> {
    try {
      const conditions = this._titleService
        .createQueryBuilder('title')
        .where('title.header_id = :id', { id })
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
        Methods.INSERT,
        'TitleService.update()',
        e,
      );
      return null;
    }
  }
}
