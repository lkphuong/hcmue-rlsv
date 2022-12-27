import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { SemesterEntity } from '../../../entities/semester.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(SemesterEntity)
    private readonly _semesterRepository: Repository<SemesterEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async contains(id: number): Promise<SemesterEntity | null> {
    try {
      const conditions = this._semesterRepository
        .createQueryBuilder('semester')
        .leftJoinAndSelect(
          'semester.forms',
          'form',
          `form.semester_id = semester.id AND 
          form.deleted = 0`,
        )
        .where('semester.id = :id', { id })
        .andWhere('semester.deleted = :deleted', { deleted: false });

      const semester = await conditions.getOne();
      return semester || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SemesterService.contains()',
        e,
      );
      return null;
    }
  }

  async getSemesters(): Promise<SemesterEntity[] | null> {
    try {
      const conditions = this._semesterRepository
        .createQueryBuilder('semester')
        .where('semester.active = :active', { active: 1 })
        .andWhere('semester.deleted = :deleted', { deleted: 0 });

      const semesters = conditions
        .orderBy('semester.created_at', 'DESC')
        .getMany();
      return semesters || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SemesterService.getSemesters()',
        e,
      );

      return null;
    }
  }

  async getSemesterById(semester_id: number): Promise<SemesterEntity | null> {
    try {
      const conditions = this._semesterRepository
        .createQueryBuilder('semester')
        .where('semester.id = :semester_id', { semester_id })
        .andWhere('semester.deleted = :deleted', { deleted: false });

      const semester = await conditions.getOne();
      return semester || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SemesterService.getSemesterByid()',
        e,
      );
      return null;
    }
  }

  async getSemesterByName(name: string): Promise<SemesterEntity | null> {
    try {
      const conditions = this._semesterRepository
        .createQueryBuilder('semester')
        .where('LOWER(semester.name) = :name', { name: name.toLowerCase() })
        .andWhere('semester.deleted = :deleted', { deleted: false });

      const semester = await conditions.getOne();
      return semester || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SemesterService.getSemesterByName()',
        e,
      );
      return null;
    }
  }

  async add(
    semester: SemesterEntity,
    manager?: EntityManager,
  ): Promise<SemesterEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      semester = await manager.save(semester);
      return semester || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'SemesterService.add()',
        e,
      );
      return null;
    }
  }

  async unlink(
    semester_id: number,
    user_id: number,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const result = await manager.update(
        SemesterEntity,
        { id: semester_id },
        { deleted: true, deleted_at: new Date(), deleted_by: user_id },
      );

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'SemesterService.unlink()',
        e,
      );
      return null;
    }
  }
}
