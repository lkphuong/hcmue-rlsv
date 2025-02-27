import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { DepartmentEntity } from '../../../entities/department.entity';

import { LogService } from '../../log/services/log.service';

import { DepartmentResponse } from '../interfaces/department_response.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly _departmentRepository: Repository<DepartmentEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getDepartments(
    department_id?: number,
    academic_id?: number,
    semester_id?: number,
  ): Promise<DepartmentResponse[] | null> {
    try {
      const conditions = this._departmentRepository
        .createQueryBuilder('department')
        .select('department.id AS id, department.name AS name')
        .where('department.deleted = :deleted', { deleted: false });

      if (department_id) {
        conditions.andWhere('department.id = :department_id', {
          department_id,
        });
      }

      if (academic_id) {
        conditions.andWhere('department.academic_id = :academic_id', {
          academic_id,
        });
      }
      if (semester_id) {
        conditions.andWhere('department.semester_id = :semester_id', {
          semester_id,
        });
      }

      console.log(
        'conditions: ',
        conditions.getQuery(),
        academic_id,
        semester_id,
      );

      const departments = await conditions.getRawMany<DepartmentResponse>();

      return departments || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'DepartmentService.getDepartments()',
        e,
      );
      return null;
    }
  }

  async getDepartmentById(
    department_id: number,
  ): Promise<DepartmentEntity | null> {
    try {
      const conditions = this._departmentRepository
        .createQueryBuilder('department')
        .where('department.id = :department_id', { department_id })
        .andWhere('department.deleted = :deleted', { deleted: false });

      const department = await conditions.getOne();

      return department || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'DepartmentService.getDepartmentById()',
        e,
      );
      return null;
    }
  }

  async getDepartmentPaging(
    offset: number,
    length: number,
    department_id?: number,
    input?: string,
    academic_id?: number,
    semester_id?: number,
  ): Promise<DepartmentEntity[] | null> {
    try {
      let conditions = this._departmentRepository
        .createQueryBuilder('department')
        .where('department.deleted = :deleted', { deleted: 0 });

      if (department_id && department_id !== 0) {
        conditions = conditions.andWhere('department.id = :department_id', {
          department_id,
        });
      }

      if (input) {
        conditions = conditions.andWhere(`department.name LIKE '%${input}%'`);
      }

      if (academic_id) {
        conditions = conditions.andWhere(
          'department.academic_id = :academic_id',
          { academic_id },
        );
      }

      if (semester_id) {
        conditions = conditions.andWhere(
          'department.semester_id = :semester_id',
          { semester_id },
        );
      }

      const departments = await conditions.skip(offset).take(length).getMany();

      return departments || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'DepartmentService.getDepartmentPaging()',
        e,
      );
      return null;
    }
  }

  async getDepartmentsByIds(ids: number[]): Promise<DepartmentEntity[] | null> {
    try {
      const conditions = this._departmentRepository
        .createQueryBuilder('department')
        .where(`department.id IN (${ids.toString()})`)
        .andWhere('department.deleted = :deleted', { deleted: false });

      const departments = await conditions
        .orderBy('department.created_at', 'DESC')
        .getMany();

      return departments || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'DepartmentService.getDepartmentsByIds()',
        e,
      );
      return null;
    }
  }

  async count(department_id?: number, input?: string): Promise<number> {
    try {
      let conditions = this._departmentRepository
        .createQueryBuilder('department')
        .select('COUNT(id)', 'count')
        .where('department.deleted = :deleted', { deleted: 0 });

      if (department_id && department_id !== 0) {
        conditions = conditions.andWhere('department.id = :department_id', {
          department_id,
        });
      }
      if (input) {
        conditions = conditions.andWhere(`department.name LIKE '%${input}%'`);
      }

      const { count } = await conditions.getRawOne();

      return count || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'DepartmentService.count()',
        e,
      );
      return null;
    }
  }

  async bulkAdd(
    departments: DepartmentEntity[],
    manager?: EntityManager,
  ): Promise<DepartmentEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      departments = await manager.save(departments);

      return departments || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'DepartmentService.bulkAdd()',
        e,
      );
      return null;
    }
  }

  async deleteByAcademicIdAndSemesterId(
    academic_id: number,
    semester_id: number,
  ) {
    try {
      const query = `UPDATE departments SET delete_flag = 1 WHERE academic_id = ${academic_id} AND semester_id = ${semester_id}`;

      const result = await this._dataSource.query(query);

      return result || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'DepartmentService.deleteByAcademicIdAndSemesterId()',
        e,
      );
      return null;
    }
  }
}
