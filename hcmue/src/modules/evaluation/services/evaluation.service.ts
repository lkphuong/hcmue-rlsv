import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';

import { EvaluationEntity } from '../../../entities/evaluation.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(EvaluationEntity)
    private readonly _evaluationService: Repository<EvaluationEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async contains(
    sheet_id: number,
    item_id: number,
    category?: number,
  ): Promise<EvaluationEntity | null> {
    try {
      let conditions = this._evaluationService
        .createQueryBuilder('evaluation')
        .where('evaluation.sheet_id = :sheet_id', { sheet_id })
        .andWhere('evaluation.item_id = :item_id', { item_id })
        .andWhere('evaluation.deleted = :deleted ', { deleted: false });

      if (category) {
        conditions = conditions.andWhere('evaluation.category = :category', {
          category,
        });
      }

      const evaluation = await conditions.getOne();
      return evaluation || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'EvaluationService.contains()',
        e,
      );
      return null;
    }
  }

  async getEvaluationById(id: number): Promise<EvaluationEntity | null> {
    try {
      const conditions = this._evaluationService
        .createQueryBuilder('evaluation')
        .where('evaluation.id = :id', { id })
        .andWhere('evaluation.deleted = :deleted', { deleted: false });

      const evaluation = await conditions.getOne();
      return evaluation || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'EvaluationService.getEvaluationById()',
        e,
      );
      return null;
    }
  }

  async getEvaluationBySheetId(
    sheet_id: number,
  ): Promise<EvaluationEntity[] | null> {
    try {
      const conditions = this._evaluationService
        .createQueryBuilder('evaluation')
        .innerJoinAndSelect('evaluation.sheet', 'sheet')
        .innerJoinAndSelect('evaluation.item', 'item')
        .leftJoinAndSelect(
          'evaluation.option',
          'option',
          'evaluation.option_id = option.id AND option.delete_flag = 0',
        )
        .where('sheet.id = :sheet_id', { sheet_id })
        .andWhere('sheet.deleted = :deleted', { deleted: false })
        .andWhere('item.deleted = :deleted', { deleted: false });

      const evaluations = await conditions.getMany();
      return evaluations || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'EvaluationService.getEvaluationBySheetId()',
        e,
      );
      return null;
    }
  }

  async bulkAdd(
    evaluation: EvaluationEntity[],
    manager?: EntityManager,
  ): Promise<EvaluationEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      evaluation = await manager.save(evaluation);
      return evaluation;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'EvaluationService.bulkAdd()',
        e,
      );
      return null;
    }
  }

  async bulkUpdate(
    evaluation: EvaluationEntity[],
    manager?: EntityManager,
  ): Promise<EvaluationEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      evaluation = await manager.save(evaluation);
      return evaluation;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'EvaluationService.bulkUpdate()',
        e,
      );
      return null;
    }
  }

  async bulkApprove(
    sheet_ids: number[],
    manager?: EntityManager,
  ): Promise<boolean> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = await manager.query(
        `CALL sp_multiple_approval ('${sheet_ids.toString()}')`,
      );

      return results[0][0].success ?? 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'EvaluationService.bulkApprove()',
        e,
      );
      return null;
    }
  }
}
