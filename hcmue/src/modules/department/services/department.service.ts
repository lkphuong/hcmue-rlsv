import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { DepartmentEntity } from '../../../entities/department.entity';

import { LogService } from '../../log/services/log.service';

import { DepartmentResponse } from '../interfaces/department_response';

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

  async getDepartments(): Promise<DepartmentResponse[] | null> {
    try {
      const conditions = this._departmentRepository
        .createQueryBuilder('department')
        .select('department.id AS id, department.name AS name')
        .where('department.deleted = :deleted', { deleted: false });

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
        Methods.SELECT,
        'DepartmentService.bulkAdd()',
        e,
      );
      return null;
    }
  }
}
