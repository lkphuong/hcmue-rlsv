import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { OptionEntity } from '../../../entities/option.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { ItemEntity } from '../../../entities/item.entity';

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

  async getOptionByIds(ids: number[]): Promise<OptionEntity[] | null> {
    try {
      const conditions = this._optionRepository
        .createQueryBuilder('option')
        .whereInIds(ids)
        .andWhere('option.deleted = :deleted', { deleted: false });

      const options = await conditions.getMany();
      return options || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'OptionService.getOptionByIds()',
        e,
      );
      return null;
    }
  }

  async getOptionsByItemId(
    form_id: number,
    item_id: number,
  ): Promise<OptionEntity[] | null> {
    try {
      const conditions = this._optionRepository
        .createQueryBuilder('option')
        .innerJoinAndMapOne(
          'option.item',
          ItemEntity,
          'item',
          `item.ref = option.parent_ref AND item.delete_flag = 0`,
        )
        .where('item.id = :item_id', { item_id })
        .andWhere('option.form_id = :form_id', { form_id })
        .andWhere('item.deleted = :deleted', { deleted: false })
        .andWhere('option.deleted = :deleted', { deleted: false });

      const options = await conditions.getMany();

      return options || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'OptionService.getOptionsByItemId()',
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

  async bulkUnlink(
    form_id: number,
    parent_ref: string,
    request_code: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = await manager.update(
        OptionEntity,
        { form: form_id, parent_ref: parent_ref },
        { deleted: true, deleted_at: new Date(), deleted_by: request_code },
      );

      return results.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'OptionService.bulkUnlink()',
        e,
      );
      return null;
    }
  }

  async cloneOptions(
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
        `CALL sp_generate_options (${source_form_id}, ${target_form_id})`,
      );

      if (results && results.length > 0) {
        success = results[0].success != 0;
      }

      return success;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'OptionService.cloneOptions()',
        e,
      );
      return null;
    }
  }
}
