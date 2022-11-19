import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

import { SheetEntity } from 'src/entities/sheet.entity';

@Injectable()
export class SheetService {
  constructor(
    @InjectRepository(SheetEntity)
    private readonly _sheetRepository: Repository<SheetEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getSheetsByUserId(user_id: string): Promise<SheetEntity[] | null> {
    try {
      const conditions = await this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoinAndSelect('sheet.semester', 'semester')
        .innerJoinAndSelect('sheet.academic_year', 'academic_year')
        .innerJoinAndSelect('sheet.level', 'level')
        .where('sheet.user_id = :user_id', { user_id })
        .andWhere('sheet.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('level.deleted = :deleted', { deleted: false });

      const sheets = await conditions
        .orderBy('sheet.created_at', 'DESC')
        .getMany();

      return sheets || null;
    } catch (err) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.getSheetByUserId()',
        err,
      );
      return null;
    }
  }

  async getSheetPaging(
    semester_id: number,
    academic_id: number,
    class_id?: number,
  ): Promise<SheetEntity[] | null> {
    try {
      const conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoin('sheet.semester', 'semester')
        .innerJoin('sheet.academic_year', 'academic_year')
        .innerJoinAndSelect('sheet.level', 'level')
        .where('sheet.deleted = :deleted', { deleted: false })
        .andWhere('level.deleted = :deleted', { deleted: false })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.id = :semester_id', { semester_id })
        .andWhere('academic_year.id = :academic_id', { academic_id });

      if (class_id && class_id !== 0) {
        conditions.andWhere('sheet.class_id = :class_id', { class_id });
      }

      const sheets = await conditions
        .orderBy('sheet.created_at', 'DESC')
        .getMany();

      return sheets || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.getSheetPaging()',
        e,
      );
      return null;
    }
  }

  async getSheetById(id: number): Promise<SheetEntity | null> {
    try {
      const conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .where('sheet.id = :id', { id })
        .andWhere('sheet.deleted = :deleted', { deleted: false });

      const sheet = await conditions.getOne();

      return sheet || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.getSheetById()',
        e,
      );
      return null;
    }
  }

  async update(
    sheet: SheetEntity,
    manager: EntityManager,
  ): Promise<SheetEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      sheet = await manager.save(sheet);

      return sheet || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'SheetService.update()',
        e,
      );
      return null;
    }
  }
}
