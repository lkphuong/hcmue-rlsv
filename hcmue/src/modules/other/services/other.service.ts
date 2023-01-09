import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';

import { OtherEntity } from '../../../entities/other.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { DepartmentEntity } from '../../../entities/department.entity';

@Injectable()
export class OtherService {
  constructor(
    @InjectRepository(OtherEntity)
    private readonly _otherRepository: Repository<OtherEntity>,
    private readonly _dataSource: DataSource,
    private readonly _logger: LogService,
  ) {}

  async contains(
    username: string,
    other_id?: number,
  ): Promise<OtherEntity | null> {
    try {
      let conditions = this._otherRepository
        .createQueryBuilder('other')
        .where('other.username = :username', { username })
        .andWhere('other.deleted = :deleted', { deleted: false });

      if (other_id) {
        conditions = conditions.andWhere('other.id != :other_id', { other_id });
      }

      const other = await conditions.getOne();

      return other || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'OtherService.contains()',
        e,
      );
      return null;
    }
  }

  async getOtherByUsername(username: string): Promise<OtherEntity | null> {
    try {
      const conditions = this._otherRepository
        .createQueryBuilder('other')
        .leftJoinAndMapOne(
          'other.department',
          DepartmentEntity,
          'department',
          `department.id = other.department_id AND department.deleted = 0`,
        )
        .where('other.username = :username', { username })
        .andWhere('other.deleted = :deleted', { deleted: false });

      const other = await conditions.getOne();

      return other || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'OtherService.getOtherByusername()',
        e,
      );
      return null;
    }
  }

  async getOtherByDepartment(
    department_id: number,
  ): Promise<OtherEntity | null> {
    try {
      const conditions = this._otherRepository
        .createQueryBuilder('other')
        .where('other.department_id = :department_id', { department_id })
        .andWhere('other.deleted = :deleted', { deleted: false });

      const other = await conditions.getOne();

      return other || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'OtherService.getOtherByDepartment()',
        e,
      );
      return null;
    }
  }

  async getOtherById(other_id: number): Promise<OtherEntity | null> {
    try {
      const conditions = this._otherRepository
        .createQueryBuilder('other')
        .where('other.id = :other_id', { other_id })
        .andWhere('other.deleted = :deleted', { deleted: false });

      const other = await conditions.getOne();

      return other || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'OtherService.getOtherById()',
        e,
      );
      return null;
    }
  }

  async add(
    other: OtherEntity,
    manager?: EntityManager,
  ): Promise<OtherEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      other = await manager.save(other);

      return other || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'OtherService.add()',
        e,
      );
      return null;
    }
  }

  async update(
    other: OtherEntity,
    manager?: EntityManager,
  ): Promise<OtherEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      other = await manager.save(other);

      return other || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'OtherService.update()',
        e,
      );
      return null;
    }
  }

  async unlink(
    other_id: number,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const result = await manager.update(
        OtherEntity,
        { id: other_id },
        { deleted_at: new Date(), deleted: true },
      );

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'OtherService.unlink()',
        e,
      );
      return null;
    }
  }
}
