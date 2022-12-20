import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';

import { generateObjectIDString } from '../utils';

import { HeaderEntity } from '../../../entities/header.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { OptionEntity } from '../../../entities/option.entity';
import { SheetEntity } from '../../../entities/sheet.entity';
import { TitleEntity } from '../../../entities/title.entity';

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

  async contains(
    department_id: string,
    academic_id: number,
    semester_id: number,
  ): Promise<number[] | null> {
    try {
      const conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .select('sheet.id', 'id')
        .where('sheet.department_id = :department_id', { department_id })
        .andWhere('sheet.academic_id = :academic_id', { academic_id })
        .andWhere('sheet.semester_id = :semester_id', { semester_id })
        .andWhere('sheet.status = :status', {
          status: SheetStatus.WAITING_DEPARTMENT,
        })
        .andWhere('sheet.deleted = :deleted', { deleted: false });

      const sheet_ids = await conditions.getRawMany<number>();

      return sheet_ids || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.contains()',
        e,
      );
      return null;
    }
  }

  async getSheetsPaging(
    offset: number,
    length: number,
    department_id: string,
    class_id: string,
    academic_id: number,
    semester_id: number,
    status: number,
    role: number,
    user_ids?: string[],
  ): Promise<SheetEntity[] | null> {
    try {
      let conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoin('sheet.semester', 'semester')
        .innerJoin('sheet.academic_year', 'academic_year')
        .leftJoinAndSelect(
          'sheet.level',
          'level',
          `level.id = sheet.level AND 
          level.deleted = 0`,
        )
        .where('semester.id = :semester_id', { semester_id })
        .andWhere('academic_year.id = :academic_id', { academic_id })
        .andWhere('sheet.department_id = :department_id', { department_id })
        .andWhere('sheet.class_id = :class_id', { class_id })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('sheet.deleted = :deleted', { deleted: false });

      if (status != SheetStatus.ALL) {
        conditions = conditions.andWhere('sheet.status = :status', { status });
      }

      if (user_ids && user_ids.length > 0) {
        conditions = conditions.andWhere(
          `sheet.user_id IN (${generateObjectIDString(user_ids)})`,
        );
      }

      const sheet_status = this.generateStatus(role);
      conditions = conditions.andWhere('sheet.status >= :status', {
        status: sheet_status,
      });

      const sheets = await conditions
        .orderBy('sheet.created_at', 'DESC')
        .skip(offset)
        .take(length)
        .getMany();

      return sheets || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.getSheetsPaging()',
        e,
      );
      return null;
    }
  }

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

  async countSheets(
    academic_id: number,
    class_id: string,
    department_id: string,
    semester_id: number,
    status: SheetStatus,
    role?: number,
    user_ids?: string[],
  ): Promise<number> {
    try {
      let conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoin('sheet.semester', 'semester')
        .innerJoin('sheet.academic_year', 'academic_year')
        .leftJoinAndSelect('sheet.level', 'level')
        .select('COUNT(DISTINCT sheet.id)', 'count')
        .where('semester.id = :semester_id', { semester_id })
        .andWhere('academic_year.id = :academic_id', { academic_id })
        .andWhere('sheet.class_id = :class_id', { class_id })
        .andWhere('sheet.department_id = :department_id', { department_id })
        .andWhere('sheet.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere(
          new Brackets((qb) => {
            qb.where('level.deleted = :deleted', { deleted: false });
            qb.orWhere('level.deleted IS NULL');
          }),
        );

      if (status != SheetStatus.ALL) {
        conditions = conditions.andWhere('sheet.status = :status', { status });
      }

      if (user_ids && user_ids.length > 0) {
        conditions = conditions.andWhere(
          `sheet.user_id IN (${generateObjectIDString(user_ids)})`,
        );
      }

      if (role) {
        const sheet_status = this.generateStatus(role);
        conditions = conditions.andWhere('sheet.status >= :status', {
          status: sheet_status,
        });
      }

      const { count } = await conditions.getRawOne();
      return count;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.countSheets()',
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

  async ungraded(
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
          status: SheetStatus.NOT_GRADED,
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
      case RoleCode.ADMIN:
      case RoleCode.STUDENT:
        return SheetStatus.WAITING_STUDENT;
      case RoleCode.CLASS:
        return SheetStatus.WAITING_CLASS;
      case RoleCode.DEPARTMENT:
        return SheetStatus.WAITING_DEPARTMENT;
    }
  };
}
