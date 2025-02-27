import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AdviserEntity } from '../../../../entities/adviser.entity';

import { LogService } from '../../../log/services/log.service';

import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';
import { DepartmentEntity } from '../../../../entities/department.entity';
import { AcademicYearEntity } from '../../../../entities/academic_year.entity';
import { AdviserClassesEntity } from '../../../../entities/adviser_classes.entity';
import { ClassEntity } from '../../../../entities/class.entity';

@Injectable()
export class AdviserService {
  constructor(
    @InjectRepository(AdviserEntity)
    private readonly _adviserRepository: Repository<AdviserEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getAdviserPaging(
    offset: number,
    length: number,
    academic_id: number,
    class_id: number,
    department_id: number,
    input?: string,
    semester_id?: number,
  ): Promise<AdviserEntity[] | null> {
    try {
      let conditions = this._adviserRepository
        .createQueryBuilder('adviser')
        .innerJoinAndMapOne(
          'adviser.department',
          DepartmentEntity,
          'department',
          `department.id = adviser.department_id 
        AND department.deleted = 0`,
        )
        .innerJoin(
          AcademicYearEntity,
          `academic`,
          `academic.id = adviser.academic_id 
        AND academic.deleted = 0`,
        )
        .leftJoinAndMapMany(
          'adviser.adviser_classes',
          AdviserClassesEntity,
          'adviser_class',
          `adviser_class.adviser_id = adviser.id AND adviser_class.deleted = 0`,
        )
        .leftJoinAndMapOne(
          'adviser_class.class',
          ClassEntity,
          'class',
          `adviser_class.class_id = class.id AND class.deleted = 0`,
        )
        .where('adviser.deleted = :deleted', { deleted: false })
        .andWhere('adviser.active = :active', { active: true });

      if (academic_id && academic_id !== 0) {
        conditions = conditions.andWhere('academic.id = :academic_id', {
          academic_id,
        });
      }

      if (class_id && class_id !== 0) {
        conditions = conditions.andWhere('adviser_class.class_id = :class_id', {
          class_id,
        });
      }

      if (department_id && department_id !== 0) {
        conditions = conditions.andWhere(
          'adviser.department_id = :department_id',
          { department_id },
        );
      }

      if (input) {
        conditions = conditions.andWhere(`adviser.fullname LIKE '%${input}%'`);
      }

      if (semester_id && semester_id !== 0) {
        conditions = conditions.andWhere('adviser.semester_id = :semester_id', {
          semester_id,
        });
      }

      const advisers = await conditions
        .orderBy('adviser.created_at', 'DESC')
        .skip(offset)
        .take(length)
        .getMany();

      return advisers || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AdviserService.getAdviserPaging()',
        e,
      );

      return null;
    }
  }

  async getAdviserByDepartmentId(
    department_id: number,
    academic_id: number,
    semester_id: number,
  ) {
    try {
      const query = `
          SELECT
            a.fullname,
            ac.class_id
          FROM
            advisers a
            JOIN adviser_classes ac ON a.id = ac.adviser_id
          WHERE
            a.delete_flag = 0
            AND ac.delete_flag = 0
            AND a.academic_id = ${academic_id}
            AND a.semester_id = ${semester_id}
            AND a.department_id = ${department_id}
      `;

      console.log(query);

      const advisers = (await this._dataSource.manager.query(query)) as {
        fullname: string;
        class_id: number;
      }[];

      return advisers || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AdviserService.getAdviserByDepartmentId()',
        e,
      );
      return null;
    }
  }

  async count(
    academic_id: number,
    class_id: number,
    department_id: number,
    input?: string,
    semester_id?: number,
  ): Promise<number> {
    try {
      const conditions = this._adviserRepository
        .createQueryBuilder('adviser')
        .select('COUNT(distinct adviser.id)', 'count')
        .innerJoin(
          DepartmentEntity,
          'department',
          `department.id = adviser.department_id 
          AND department.deleted = 0`,
        )
        .innerJoin(
          AcademicYearEntity,
          `academic`,
          `academic.id = adviser.academic_id 
          AND academic.deleted = 0`,
        )
        .leftJoin(
          AdviserClassesEntity,
          'adviser_class',
          `adviser.id  = adviser_class.adviser_id AND adviser_class.deleted = 0`,
        )
        .where('adviser.deleted = :deleted', { deleted: false })
        .andWhere('adviser.active = :active', { active: true });

      if (academic_id && academic_id !== 0) {
        conditions.andWhere('academic.id = :academic_id', {
          academic_id,
        });
      }

      if (class_id && class_id !== 0) {
        conditions.andWhere('adviser_class.class_id = :class_id', {
          class_id,
        });
      }

      if (department_id && department_id !== 0) {
        conditions.andWhere('adviser.department_id = :department_id', {
          department_id,
        });
      }

      if (input) {
        conditions.andWhere(`adviser.fullname LIKE '%${input}%'`);
      }

      if (semester_id && semester_id !== 0) {
        conditions.andWhere('adviser.semester_id = :semester_id', {
          semester_id,
        });
      }

      const { count } = await conditions.getRawOne();

      return count || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AdviserService.count()',
        e,
      );
      return null;
    }
  }

  async getAdviserByCode(code: string): Promise<AdviserEntity | null> {
    try {
      const conditions = this._adviserRepository
        .createQueryBuilder('adviser')
        .where('adviser.code = :code', { code })
        .andWhere('adviser.deleted = :deleted', { deleted: false })
        .andWhere('adviser.active = :active', { active: true })
        .orderBy('adviser.created_at', 'DESC');

      const adviser = await conditions.getOne();

      return adviser || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AdviserService.getAdviserByUsername()',
        e,
      );
      return null;
    }
  }

  async getAdviserByClass(
    class_id: number,
    manager?: EntityManager,
  ): Promise<string | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const result = await manager.query(
        `
        SELECT  advisers.fullname
        FROM advisers 
          JOIN adviser_classes ON advisers.id = adviser_classes.adviser_id
        WHERE adviser_classes.class_id = ${class_id}
        LIMIT 1
      `,
      );

      return result[0]?.fullname || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AdviserService.getAdviserByClass()',
        e,
      );
      return null;
    }
  }

  async getOneAdviser(): Promise<AdviserEntity | null> {
    try {
      const conditions = this._adviserRepository
        .createQueryBuilder('adviser')
        .where('adviser.deleted = :deleted', { deleted: false })
        .andWhere('adviser.active = :active', { active: true })
        .orderBy('adviser.created_at', 'DESC');

      const adviser = await conditions.getOne();

      return adviser || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AdviserService.getOneAdviser()',
        e,
      );
    }
  }

  async getAdviserById(id: number): Promise<AdviserEntity | null> {
    try {
      const conditions = this._adviserRepository
        .createQueryBuilder('adviser')
        .where('adviser.id = :id', { id })
        .andWhere('adviser.deleted = :deleted', { deleted: false })
        .andWhere('adviser.active = :active', { active: true })
        .orderBy('adviser.created_at', 'DESC');

      const adviser = await conditions.getOne();

      return adviser || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AdviserService.getOneAdviser()',
        e,
      );
    }
  }

  async getAdviserByIds(ids: number[]): Promise<AdviserEntity[] | null> {
    try {
      const conditions = this._adviserRepository
        .createQueryBuilder('adviser')
        .whereInIds(ids)
        .andWhere('adviser.deleted = :deleted', { deleted: false })
        .andWhere('adviser.active = :active', { active: true })
        .orderBy('adviser.created_at', 'DESC');

      const advisers = await conditions.getMany();

      return advisers || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AdviserService.getAdviserByIds()',
        e,
      );
    }
  }

  async bulkAdd(
    advisers: AdviserEntity[],
    manager?: EntityManager,
  ): Promise<AdviserEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      advisers = await manager.save(advisers);

      return advisers || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'AdviserService.bulkAdd()',
        e,
      );
      return null;
    }
  }

  async update(adviser: AdviserEntity, manager?: EntityManager) {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      adviser = await manager.save(adviser);

      return adviser || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'AdviserService.update()',
        e,
      );
      return null;
    }
  }

  async bulkUpdatePassword(
    source_academic_id: number,
    targer_academic_id: number,
    manager?: EntityManager,
  ): Promise<boolean> {
    try {
      let success = false;

      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results =
        await manager.query(`call sp_update_advisers(${source_academic_id}, ${targer_academic_id});
      `);

      if (results && results.length > 0) {
        success = results[0].success != 0;
      }

      return success;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'AdviserService.bulkUpdatePassword()',
        e,
      );
      return null;
    }
  }

  async bulkUnlink(
    academic_id: number,
    manager?: EntityManager,
    semester_id?: number,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      const results = await manager.update(
        AdviserEntity,
        {
          academic_id: academic_id,
          semester_id: semester_id,
          active: 1,
          deleted: false,
        },
        {
          updated_at: new Date(),
          updated_by: 'system',
          active: false,
          deleted: true,
        },
      );
      return results.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'AdviserService.bulkUnlink()',
        e,
      );
      return null;
    }
  }
}
