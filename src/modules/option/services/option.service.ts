import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { OptionEntity } from 'src/entities/option.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(OptionEntity)
    private readonly _optionRepository: Repository<OptionEntity>,
    private readonly _dataSource: DataSource,
    private readonly _logger: LogService,
  ) {}

  async getOptionById(id: number): Promise<OptionEntity | null> {
    try {
      const conditions = this._optionRepository
        .createQueryBuilder('option')
        .where('option.id = :id', { id })
        .andWhere('option.deleted = :deleted', { deleted: false });

      const option = await conditions.getOne();

      return option || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'OptionService.getOptionById()',
        e,
      );
      return null;
    }
  }

  async getOptionByItemId(item_id: number): Promise<OptionEntity[] | null> {
    try {
      const conditions = this._optionRepository
        .createQueryBuilder('option')
        .innerJoin('option.item', 'item')
        .where('item.id = :item_id', { item_id })
        .andWhere('item.deleted = :deleted', { deleted: false })
        .andWhere('option.deleted = :deleted', { deleted: false });

      const options = await conditions.getMany();

      return options || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'OptionService.getOptionByItemId()',
        e,
      );
      return null;
    }
  }

  async bulkAdd(
    options: OptionEntity[],
    manager?: EntityManager,
  ): Promise<OptionEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      options = await manager.save(options);

      return options || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'OptionService.bulkAdd()',
        e,
      );
      return null;
    }
  }

  async bulkUnlinkByItemId(
    item_id: number,
    user_id: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = await manager.update(
        OptionEntity,
        { item: item_id },
        { deleted: true, deleted_at: new Date(), deleted_by: user_id },
      );

      return results.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'OptionService.bulkUnlinkByItemId()',
        e,
      );
      return null;
    }
  }
}
