import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';

import { SheetEntity } from '../../../entities/sheet.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { RoleCode } from '../../../constants/enums/role_enum';
import { SheetStatus } from '../constants/enums/status.enum';

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
        .leftJoinAndSelect('sheet.level', 'level')
        .where(
          new Brackets((qb) => {
            qb.where('level.deleted = :deleted', { deleted: null });
            qb.orWhere('level.deleted IS NULL');
          }),
        )
        .andWhere('sheet.user_id = :user_id', { user_id })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('sheet.deleted = :deleted', { deleted: false });

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

  async getSheetsByClassId(
    academic_id: number,
    class_id: string,
    semester_id: number,
    role: RoleCode,
  ): Promise<SheetEntity[] | null> {
    try {
      let conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoin('sheet.semester', 'semester')
        .innerJoin('sheet.academic_year', 'academic_year')
        .leftJoinAndSelect('sheet.level', 'level')
        .where(
          new Brackets((qb) => {
            qb.where('level.deleted = :deleted', { deleted: null });
            qb.orWhere('level.deleted IS NULL');
          }),
        )
        .andWhere('academic_year.id = :academic_id', { academic_id })
        .andWhere('semester.id = :semester_id', { semester_id })
        .andWhere('sheet.class_id = :class_id', { class_id })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('sheet.deleted = :deleted', { deleted: false });

      const status = this.generateStatus(role);

      conditions = conditions.andWhere('sheet.status >= :status', { status });

      const sheets = await conditions
        .orderBy('sheet.created_at', 'DESC')
        .getMany();

      return sheets || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.getSheetsByClassId()',
        e,
      );
      return null;
    }
  }

  async getSheetById(id: number): Promise<SheetEntity | null> {
    try {
      const conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoinAndSelect('sheet.semester', 'semester')
        .innerJoinAndSelect('sheet.academic_year', 'academic_year')
        .leftJoinAndSelect('sheet.level', 'level')
        .innerJoinAndSelect('sheet.form', 'form')
        .leftJoinAndSelect(
          'form.headers',
          'headers',
          'headers.form_id = form.id AND headers.deleted = :deleted',
          { deleted: false },
        )
        .where(
          new Brackets((qb) => {
            qb.where('level.deleted = :deleted', { deleted: null });
            qb.orWhere('level.deleted IS NULL');
          }),
        )
        .andWhere('sheet.id = :id', { id })
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

  async unapproved(
    sheet_id: number,
    user_id: string,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const result = await manager.update(
        SheetEntity,
        { id: sheet_id },
        {
          status: 5,
          graded: 0,
          level: null,
          updated_at: new Date(),
          updated_by: user_id,
        },
      );

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'SheetService.unapproved()',
        e,
      );
      return null;
    }
  }

  generateStatus = (role: RoleCode) => {
    switch (role) {
      case RoleCode.ADMIN | RoleCode.STUDENT:
        return SheetStatus.WAITING_STUDENT;
      case RoleCode.CLASS:
        return SheetStatus.WAITING_CLASS;
      case RoleCode.DEPARTMENT:
        return SheetStatus.WAITING_DEPARTMENT;
    }
  };
}
