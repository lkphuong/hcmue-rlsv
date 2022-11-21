import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ItemEntity } from '../../../entities/item.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly _itemRepository: Repository<ItemEntity>,
    private _logger: LogService,
  ) {}

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

  async getItemByTitileId(
    title_id: number,
    sheet_id: number,
  ): Promise<ItemEntity | null> {
    try {
      const conditions = this._itemRepository
        .createQueryBuilder('item')
        .leftJoinAndSelect(
          'item.options',
          'options',
          'options.item_id = item.id AND options.deleted = :deleted',
          { deleted: false },
        )
        .leftJoinAndSelect(
          'item.evaluations',
          'evaluations',
          'evaluations.item_id = item.id AND evaluation.deleted = :deleted AND evaluations.sheet_id = :sheet_id',
          { deleted: false, sheet_id },
        )
        .where('item.title_id = :title_id', { title_id })
        .andWhere('item.deleted = :deleted', { deleted: false });

      const item = await conditions.getOne();

      return item || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ItemService.getItemByTitileId()',
        e,
      );
      return null;
    }
  }
}
