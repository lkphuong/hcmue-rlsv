import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

import { SheetEntity } from 'src/entities/sheet.entity';

@Injectable()
export class SheetService {
  constructor(
    @InjectRepository(SheetEntity)
    private readonly _sheetRepository: Repository<SheetEntity>,
    private _logger: LogService,
  ) {}

  async getSheetByUserIdPaging(
    offet: number,
    length: number,
    user_id: string,
  ): Promise<SheetEntity[] | null> {
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
        .skip(offet)
        .take(length)
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

  async countSheetByUserId(user_id: string): Promise<number> {
    try {
      const conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .select('COUNT(DISTINCT sheet.id)', 'count')
        .where('sheet.user_id = :user_id', { user_id });

      const { count } = await conditions.getRawOne();

      return count;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.countSheetByUserId()',
        e,
      );
      return null;
    }
  }

  async getSheetPaging(
    offset: number,
    length: number,
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

      const sheets = await conditions.skip(offset).take(length).getMany();

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

  async countSheet(
    semester_id: number,
    academic_id: number,
    class_id?: number,
  ): Promise<number> {
    try {
      const conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoin('sheet.semester', 'semester')
        .innerJoin('sheet.academic_year', 'academic_year')
        .innerJoin('sheet.level', 'level')
        .select('COUNT(DISTINCT sheet.id)', 'count')
        .where('sheet.deleted = :deleted', { deleted: false })
        .andWhere('level.deleted = :deleted', { deleted: false })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.id = :semester_id', { semester_id })
        .andWhere('academic_year.id = :academic_id', { academic_id });

      if (class_id && class_id !== 0) {
        conditions.andWhere('sheet.class_id = :class_id', { class_id });
      }

      const { count } = await conditions.getRawOne();

      return count;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.countSheet()',
        e,
      );
      return null;
    }
  }
}
