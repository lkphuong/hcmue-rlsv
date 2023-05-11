import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Brackets, DataSource, Repository } from 'typeorm';

import { SheetHistoryEntity } from '../../../entities/sheet_history.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { ClassEntity } from '../../../entities/class.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { UserEntity } from '../../../entities/user.entity';
import { StatusEntity } from '../../../entities/status.entity';
import { HeaderEntity } from '../../../entities/header.entity';
import { TitleEntity } from '../../../entities/title.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { OptionEntity } from '../../../entities/option.entity';
import { EvaluationHistoryEntity } from '../../../entities/evaluation_history.entity';
import { generateCategoryByRole } from '../../sheet/utils';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(SheetHistoryEntity)
    private _sheetHistoryRepository: Repository<SheetHistoryEntity>,
    @InjectRepository(EvaluationHistoryEntity)
    private _evaluationService: Repository<EvaluationHistoryEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getSheetHistory(
    offset: number,
    length: number,
    sheet_id: number,
  ): Promise<SheetHistoryEntity[] | null> {
    try {
      const conditions = this._sheetHistoryRepository
        .createQueryBuilder('sheet_history')
        .where('sheet_history.sheet_id = :sheet_id', { sheet_id });

      const sheet_history = await conditions
        .take(length)
        .skip(offset)
        .orderBy('sheet_history.created_at', 'DESC')
        .getMany();

      return sheet_history || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'HistoryService.getSheetHistory()',
        e,
      );
      return null;
    }
  }

  async count(sheet_id: number): Promise<number | null> {
    try {
      const conditions = this._sheetHistoryRepository
        .createQueryBuilder('sheet_history')
        .where('sheet_history.sheet_id = :sheet_id', { sheet_id });

      const count = await conditions.getCount();

      return count || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'HistoryService.count()',
        e,
      );
      return null;
    }
  }

  async getSheetById(id: number): Promise<SheetHistoryEntity | null> {
    try {
      const conditions = this._sheetHistoryRepository
        .createQueryBuilder('sheet')
        .innerJoinAndSelect('sheet.semester', 'semester')
        .innerJoinAndSelect('sheet.academic_year', 'academic_year')
        .leftJoinAndSelect('sheet.level', 'level')
        .innerJoinAndSelect('sheet.form', 'form')
        .innerJoinAndMapOne(
          'sheet.class',
          ClassEntity,
          'class',
          `class.id = sheet.class_id AND class.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'sheet.department',
          DepartmentEntity,
          'department',
          `department.id = sheet.department_id AND department.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'sheet.user',
          UserEntity,
          'user',
          `user.std_code = sheet.std_code AND user.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.status',
          StatusEntity,
          'status',
          `status.id = user.status_id AND status.deleted = 0`,
        )
        .leftJoinAndMapMany(
          'form.headers',
          HeaderEntity,
          'header',
          `header.form_id = form.id 
          AND header.delete_flag = 0`,
        )
        .leftJoinAndMapMany(
          'header.titles',
          TitleEntity,
          'title',
          `title.form_id = header.form_id 
          AND header.ref = title.parent_ref 
          AND title.delete_flag = 0`,
        )
        .leftJoinAndMapMany(
          'title.items',
          ItemEntity,
          'item',
          `item.form_id = title.form_id 
          AND title.ref = item.parent_ref 
          AND item.delete_flag = 0`,
        )
        .leftJoinAndMapMany(
          'item.options',
          OptionEntity,
          'options',
          `item.form_id = options.form_id
           AND item.ref = options.parent_ref 
           AND options.delete_flag = 0`,
        )
        .where(
          new Brackets((qb) => {
            qb.where('level.deleted = :deleted', { deleted: false });
            qb.orWhere('level.deleted IS NULL');
          }),
        )
        .andWhere('sheet.id = :id', { id })
        .andWhere('sheet.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('form.deleted = :deleted', { deleted: false });

      const sheet = await conditions
        .orderBy('header.id', 'ASC')
        .addOrderBy('title.id', 'ASC')
        .addOrderBy('item.id', 'ASC')
        .addOrderBy('options.id', 'ASC')
        .getOne();

      return sheet || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'HistoryService.getSheetById()',
        e,
      );
      return null;
    }
  }

  async getById(id: number): Promise<SheetHistoryEntity | null> {
    try {
      const conditions = this._sheetHistoryRepository
        .createQueryBuilder('sheet')
        .where('sheet.id = :id', { id });

      const sheet = await conditions.getOne();

      return sheet || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'EvaluationService.getById()',
        e,
      );
    }
  }

  async getPreviousSheet(
    sheet_id: number,
    sort_order: number,
  ): Promise<SheetHistoryEntity | null> {
    try {
      const conditions = this._sheetHistoryRepository
        .createQueryBuilder('sheet')
        .andWhere('sheet.sheet_id = :sheet_id', { sheet_id })
        .andWhere('sheet.sort_order = :sort_order', { sort_order })
        .andWhere('sheet.deleted = :deleted', { deleted: false });

      const sheet = await conditions.getOne();

      return sheet || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'HistoryService.getPreviousSheet()',
        e,
      );
      return null;
    }
  }

  async getEvaluationBySheetId(
    sheet_id: number,
    role: number,
  ): Promise<EvaluationHistoryEntity[] | null> {
    try {
      const conditions = this._evaluationService
        .createQueryBuilder('evaluation')
        .innerJoinAndSelect('evaluation.sheet_history', 'sheet')
        .innerJoinAndSelect('evaluation.item', 'item')
        .leftJoinAndSelect(
          'evaluation.option',
          'option',
          'evaluation.option_id = option.id AND option.delete_flag = 0',
        )
        .where('sheet.id = :sheet_id', { sheet_id })
        .andWhere('evaluation.category = :category', {
          category: generateCategoryByRole(role),
        })
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
}
