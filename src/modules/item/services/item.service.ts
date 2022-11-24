import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';

import { ItemEntity } from '../../../entities/item.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly _itemRepository: Repository<ItemEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async contains(
    title_id: number,
    sheet_id: number,
  ): Promise<ItemEntity[] | null> {
    try {
      const conditions = this._itemRepository
        .createQueryBuilder('item')
        .leftJoinAndSelect(
          'item.options',
          'option',
          'option.item_id = item.id AND option.deleted = :deleted',
          { deleted: false },
        )
        .leftJoinAndSelect(
          'item.evaluations',
          'evaluation',
          'evaluation.item_id = item.id AND evaluation.deleted = false',
        )
        .where('item.title = :title_id', { title_id })
        .andWhere('item.deleted = :deleted', { deleted: false })
        .andWhere('evaluation.sheet_id = :sheet_id', { sheet_id });

      const item = await conditions.getMany();

      return item || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ItemService.contains()',
        e,
      );
      return null;
    }
  }

  async getItemById(id: number): Promise<ItemEntity | null> {
    try {
      const conditions = this._itemRepository
        .createQueryBuilder('item')
        .where('item.id = :id', { id })
        .andWhere('item.deleted = :deleted', { deleted: false });

      const item = await conditions.getOne();

      return item || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ItemService.getItemById()',
        e,
      );
      return null;
    }
  }

  async getItemsByTitleId(id: number): Promise<ItemEntity[] | null> {
    try {
      const conditions = this._itemRepository
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.options', 'option')
        .where('item.title_id = :id', { id })
        .andWhere('item.deleted = :deleted', { deleted: false })
        .andWhere(
          new Brackets((qb) => {
            qb.where('option.deleted = :deleted', { deleted: false });
            qb.orWhere('option.deleted IS NULL');
          }),
        );

      const items = await conditions.getMany();

      return items || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ItemService.getItemsByTitleId()',
        e,
      );
      return null;
    }
  }

  async add(
    item: ItemEntity,
    manager?: EntityManager,
  ): Promise<ItemEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      item = await manager.save(item);

      return item || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'ItemService.add()',
        e,
      );
      return null;
    }
  }
}
