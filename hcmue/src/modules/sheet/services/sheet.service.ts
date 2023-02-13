import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';

import { ClassEntity } from '../../../entities/class.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { HeaderEntity } from '../../../entities/header.entity';
import { ItemEntity } from '../../../entities/item.entity';
import { KEntity } from '../../../entities/k.entity';
import { OptionEntity } from '../../../entities/option.entity';
import { SheetEntity } from '../../../entities/sheet.entity';
import { TitleEntity } from '../../../entities/title.entity';
import { UserEntity } from '../../../entities/user.entity';
import { FormEntity } from '../../../entities/form.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { RoleCode } from '../../../constants/enums/role_enum';
import { SheetStatus } from '../constants/enums/status.enum';
import { FormStatus } from '../../form/constants/enums/statuses.enum';
import { ReportResponse } from '../interfaces/sheet_response.interface';
import { LevelEntity } from '../../../entities/level.entity';

@Injectable()
export class SheetService {
  constructor(
    @InjectRepository(SheetEntity)
    private readonly _sheetRepository: Repository<SheetEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async contains(
    department_id: number,
    academic_id: number,
    semester_id: number,
    role: number,
    class_id?: number,
  ) {
    try {
      let conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .select('sheet.id', 'id')
        .where('sheet.academic_id = :academic_id', { academic_id })
        .andWhere('sheet.semester_id = :semester_id', { semester_id })
        .andWhere('sheet.deleted = :deleted', { deleted: false })
        .andWhere('sheet.department_id = :department_id', { department_id })
        .andWhere('sheet.status = :status', {
          status:
            role == RoleCode.ADVISER
              ? SheetStatus.WAITING_ADVISER
              : SheetStatus.WAITING_DEPARTMENT,
        });

      if (class_id && class_id !== 0) {
        conditions = conditions.andWhere('sheet.class_id = :class_id', {
          class_id,
        });
      }

      const sheet_ids = await conditions.getRawMany();

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

  async getSheets(
    department_id: number,
    class_id: number,
    academic_id: number,
    semester_id: number,
    status: number,
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
        .innerJoinAndMapOne(
          'sheet.user',
          UserEntity,
          'user',
          `user.std_code = sheet.std_code 
          AND user.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'sheet.department',
          DepartmentEntity,
          'department',
          `sheet.department_id = department.id AND department.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'sheet.class',
          ClassEntity,
          'class',
          `sheet.class_id = class.id AND class.deleted = 0`,
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
          `sheet.std_code IN (${user_ids.toString()})`,
        );
      }

      const sheets = await conditions
        .orderBy('sheet.created_at', 'DESC')
        .getMany();

      return sheets || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.getSheets()',
        e,
      );
      return null;
    }
  }

  async getSheetsPaging(
    offset: number,
    length: number,
    department_id: number,
    class_id: number,
    academic_id: number,
    semester_id: number,
    status: number,
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
        .innerJoinAndMapOne(
          'sheet.user',
          UserEntity,
          'user',
          `user.std_code = sheet.std_code 
          AND user.deleted = 0`,
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
          `sheet.std_code IN (${user_ids.toString()})`,
        );
      }

      // if (role) {
      //   const sheet_status = this.generateStatus(role);
      //   conditions = conditions.andWhere('sheet.status >= :status', {
      //     status: sheet_status,
      //   });
      // }

      const sheets = await conditions
        .take(length)
        .skip(offset)
        .orderBy('sheet.created_at', 'DESC')
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

  async getSheetsHistoryPagingByCode(
    offset: number,
    length: number,
    std_code: string,
  ): Promise<SheetEntity[] | null> {
    try {
      const conditions = await this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoinAndSelect('sheet.semester', 'semester')
        .innerJoinAndSelect('sheet.academic_year', 'academic_year')
        .innerJoin(
          FormEntity,
          'form',
          `form.id = sheet.form_id AND form.deleted = 0`,
        )
        .leftJoinAndSelect('sheet.level', 'level')
        .where(
          new Brackets((qb) => {
            qb.where('level.deleted = :deleted', { deleted: null });
            qb.orWhere('level.deleted IS NULL');
          }),
        )
        .andWhere('sheet.std_code = :std_code', { std_code })
        .andWhere('form.status = :status', { status: FormStatus.DONE })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('sheet.deleted = :deleted', { deleted: false });

      const sheets = await conditions
        .orderBy('sheet.created_at', 'DESC')
        .skip(offset)
        .take(length)
        .getMany();

      return sheets || null;
    } catch (err) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.getSheetsHistoryPagingByCode()',
        err,
      );
      return null;
    }
  }

  async getSheetsByCode(std_code: string): Promise<SheetEntity[] | null> {
    try {
      const conditions = await this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoinAndSelect('sheet.semester', 'semester')
        .innerJoinAndSelect('sheet.academic_year', 'academic_year')
        .innerJoin(
          FormEntity,
          'form',
          `form.id = sheet.form_id AND form.deleted = 0`,
        )
        .leftJoinAndSelect('sheet.level', 'level')
        .where(
          new Brackets((qb) => {
            qb.where('level.deleted = :deleted', { deleted: null });
            qb.orWhere('level.deleted IS NULL');
          }),
        )
        .andWhere('sheet.std_code = :std_code', { std_code })
        .andWhere('form.status = :status', { status: FormStatus.IN_PROGRESS })
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
      const conditions = this._sheetRepository
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

      // const status = this.generateStatus(role);
      // conditions = conditions.andWhere('sheet.status >= :status', { status });

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
          'sheet.K',
          KEntity,
          'k',
          `k.id = sheet.k AND k.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'sheet.user',
          UserEntity,
          'user',
          `user.std_code = sheet.std_code AND user.deleted = 0`,
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
        'SheetService.getSheetById()',
        e,
      );
      return null;
    }
  }

  async getSheetsReport(
    offset: number,
    length: number,
    academic_id: number,
    semester_id: number,
    department_id?: number,
    class_id?: number,
  ): Promise<ReportResponse[] | null> {
    try {
      let conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .select(
          `user.std_code, 
          user.fullname, 
          user.birthday, 
          sheet.sum_of_personal_marks, 
          sheet.sum_of_class_marks, 
          sheet.sum_of_adviser_marks, 
          sheet.sum_of_department_marks,
          class.code AS class,
          class.id AS class_id,
          department.name as department,
          department.id as department_id,
          level.name AS level,
          k.name AS k`,
        )
        .innerJoin(
          UserEntity,
          'user',
          `user.std_code = sheet.std_code 
          AND user.deleted = 0 
          AND sheet.academic_id = user.academic_id 
          AND sheet.semester_id = user.semester_id`,
        )
        .innerJoin(
          ClassEntity,
          'class',
          `class.id = sheet.class_id AND class.deleted = 0`,
        )
        .innerJoin(
          DepartmentEntity,
          'department',
          `department.id = sheet.department_id AND department.deleted = 0`,
        )
        .innerJoin(KEntity, 'k', `k.id = sheet.k AND k.deleted = 0`)
        .leftJoin(
          LevelEntity,
          'level',
          `level.id = sheet.level_id
        AND (level.deleted = 0 OR level.deleted is null)`,
        )
        .where('sheet.academic_id = :academic_id', { academic_id })
        .andWhere('sheet.semester_id = :semester_id', { semester_id })
        .andWhere('sheet.deleted = :deleted', { deleted: false });

      if (class_id && class_id != null) {
        conditions = conditions.andWhere('sheet.class_id = :class_id', {
          class_id,
        });
      }

      if (department_id && department_id != 0) {
        conditions = conditions.andWhere(
          'sheet.department_id = :department_id',
          {
            department_id,
          },
        );
      }

      if (length !== 0) {
        conditions.take(length).skip(offset);
      }

      const results = await conditions
        .orderBy('department_id', 'ASC')
        .addOrderBy('k', 'ASC')
        .addOrderBy('class_id', 'ASC')
        .getRawMany<ReportResponse>();

      return results || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.getSheetsReport()',
        e,
      );
      return null;
    }
  }

  async countSheetsReport(
    academic_id: number,
    semester_id: number,
    department_id?: number,
    class_id?: number,
  ): Promise<number> {
    try {
      let conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .select(`COUNT(sheet.id)`, 'count')
        .innerJoin(
          UserEntity,
          'user',
          `user.std_code = sheet.std_code 
          AND user.deleted = 0 
          AND sheet.academic_id = user.academic_id 
          AND sheet.semester_id = user.semester_id`,
        )
        .innerJoin(
          ClassEntity,
          'class',
          `class.id = sheet.class_id AND class.deleted = 0`,
        )
        .innerJoin(
          DepartmentEntity,
          'department',
          `department.id = sheet.department_id AND department.deleted = 0`,
        )
        .leftJoin(
          LevelEntity,
          'level',
          `level.id = sheet.level_id
        AND (level.deleted = 0 OR level.deleted is null)`,
        )
        .where('sheet.academic_id = :academic_id', { academic_id })
        .andWhere('sheet.semester_id = :semester_id', { semester_id })
        .andWhere('sheet.deleted = :deleted', { deleted: false });

      if (class_id && class_id != null) {
        conditions = conditions.andWhere('sheet.class_id = :class_id', {
          class_id,
        });
      }

      if (department_id && department_id != 0) {
        conditions = conditions.andWhere(
          'sheet.department_id = :department_id',
          {
            department_id,
          },
        );
      }

      const { count } = await conditions.getRawOne();

      return count;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.countSheetsReport()',
        e,
      );
      return null;
    }
  }

  async countSheets(
    academic_id: number,
    class_id: number,
    department_id: number,
    semester_id: number,
    status: SheetStatus,
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
          `sheet.std_code IN (${user_ids.toString()})`,
        );
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

  async countSheetsByDepartment(
    academic_id: number,
    semester_id: number,
    department_id: number,
    status: SheetStatus,
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

      const { count } = await conditions.getRawOne();
      return count;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.countSheetsByDepartment()',
        e,
      );
      return null;
    }
  }

  async countSheetByStatus(
    academic_id: number,
    semester_id: number,
    status: number,
    department_id: number,
    class_id?: number,
    form_id?: number,
  ): Promise<number> {
    try {
      let conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .select('COUNT(sheet.id)', 'count')
        .innerJoin('sheet.academic_year', 'academic_year')
        .innerJoin('sheet.semester', 'semester')
        .innerJoin('sheet.form', 'form');

      if (academic_id && academic_id !== 0) {
        conditions = conditions.andWhere('academic_year.id = :academic_id', {
          academic_id,
        });
      }

      if (semester_id && semester_id !== 0) {
        conditions = conditions.andWhere('semester.id = :semester_id', {
          semester_id,
        });
      }

      if (status !== 0) {
        conditions = conditions.andWhere('sheet.status < :status', { status });
      }

      if (department_id && department_id !== 0) {
        conditions = conditions.andWhere(
          'sheet.department_id = :department_id',
          { department_id },
        );
      }

      if (class_id && class_id !== 0) {
        conditions = conditions.andWhere('sheet.class_id = :class_id', {
          class_id,
        });
      }

      if (form_id && form_id !== 0) {
        conditions = conditions.andWhere('form.id = :form_id', { form_id });
      }

      const { count } = await conditions.getRawOne();

      return count || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.countSheetByStatus()',
        e,
      );
      return null;
    }
  }

  async countSheetsHistoryByCode(std_code: string): Promise<number | null> {
    try {
      const conditions = await this._sheetRepository
        .createQueryBuilder('sheet')
        .select('COUNT(DISTINCT sheet.id)', 'count')
        .innerJoin('sheet.semester', 'semester')
        .innerJoin('sheet.academic_year', 'academic_year')
        .innerJoin(
          FormEntity,
          'form',
          `form.id = sheet.form_id AND form.deleted = 0`,
        )
        .where('sheet.std_code = :std_code', { std_code })
        .andWhere('form.status = :status', { status: FormStatus.DONE })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('sheet.deleted = :deleted', { deleted: false });

      const { count } = await conditions.getRawOne();

      return count || null;
    } catch (err) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.countSheetsHistoryByCode()',
        err,
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
    request_code: string,
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
          updated_by: request_code,
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
      case RoleCode.MONITOR:
      case RoleCode.SECRETARY:
      case RoleCode.CHAIRMAN:
        return SheetStatus.WAITING_CLASS;
      case RoleCode.DEPARTMENT:
        return SheetStatus.WAITING_DEPARTMENT;
      case RoleCode.ADVISER:
        return SheetStatus.WAITING_ADVISER;
    }
  };
}
