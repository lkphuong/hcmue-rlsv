import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { ItemEntity } from '../../../entities/item.entity';
import { OptionEntity } from '../../../entities/option.entity';
import { TitleEntity } from '../../../entities/title.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

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
          'item.evaluations',
          'evaluation',
          'evaluation.item_id = item.id AND evaluation.deleted = 0',
        )
        .innerJoinAndSelect('evaluation.sheet', 'sheet')
        .innerJoinAndMapOne(
          'item.title',
          TitleEntity,
          'title',
          `title.form_id = item.form_id AND 
          title.ref = item.parent_ref`,
        )
        .leftJoinAndMapMany(
          'item.options',
          OptionEntity,
          'options',
          `item.form_id = options.form_id AND 
          item.ref = options.parent_ref AND 
          options.delete_flag = 0`,
        )
        .where('title.id = :title_id', { title_id })
        .andWhere('evaluation.sheet_id = :sheet_id', { sheet_id })
        .andWhere('sheet.deleted = :deleted', { deleted: false })
        .andWhere('title.deleted = :deleted', { deleted: false })
        .andWhere('item.deleted = :deleted', { deleted: false });

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

  async getItemByIds(ids: number[]): Promise<ItemEntity[] | null> {
    try {
      const conditions = this._itemRepository
        .createQueryBuilder('item')
        .whereInIds(ids)
        .andWhere('item.deleted = :deleted', { deleted: false });

      const items = await conditions.getMany();
      return items || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ItemService.getItemByIds()',
        e,
      );
      return null;
    }
  }

  async getItemsByTitleId(title_id: number): Promise<ItemEntity[] | null> {
    try {
      const conditions = this._itemRepository
        .createQueryBuilder('item')
        .innerJoinAndMapOne(
          'item.title',
          TitleEntity,
          'title',
          `title.form_id = item.form_id AND 
          title.ref = item.parent_ref`,
        )
        .leftJoinAndMapMany(
          'item.options',
          OptionEntity,
          'options',
          `item.form_id = options.form_id AND 
          item.ref = options.parent_ref AND 
          options.delete_flag = 0`,
        )
        .where('title.id = :title_id', { title_id })
        .andWhere('title.deleted = :deleted', { deleted: false })
        .andWhere('item.deleted = :deleted', { deleted: false });

      const items = await conditions.orderBy('options.id', 'ASC').getMany();
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

  async getMaxSortOrder(ids: number[]): Promise<number> {
    try {
      const conditions = this._itemRepository
        .createQueryBuilder('item')
        .select('MAX(sort_order)', 'sort_order')
        .where(`item.id IN (${ids.toString()})`)
        .andWhere('item.deleted = :deleted', { deleted: false });

      const { sort_order } = await conditions.getRawOne();

      return sort_order || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ItemService.getMaxSortOrder()',
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

  async update(
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
        Methods.UPDATE,
        'ItemService.update()',
        e,
      );
      return null;
    }
  }

  async unlink(
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
        Methods.DELETE,
        'ItemService.unlink()',
        e,
      );
      return null;
    }
  }

  async cloneItems(
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
        `CALL sp_generate_items (${source_form_id}, ${target_form_id})`,
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
        'ItemService.cloneItems()',
        e,
      );
      return null;
    }
  }
}
