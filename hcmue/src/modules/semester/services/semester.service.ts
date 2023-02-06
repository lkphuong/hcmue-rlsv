import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';
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

  async getSemestersPaging(
    offset: number,
    length: number,
  ): Promise<SemesterEntity[] | null> {
    try {
      const conditions = this._semesterRepository
        .createQueryBuilder('semester')
        .innerJoinAndMapOne(
          'semester.academic',
          AcademicYearEntity,
          'academic',
          `semester.academic_id = academic.id 
          AND academic.deleted = 0`,
        )
        .where('semester.active = :active', { active: 1 })
        .andWhere('semester.deleted = :deleted', { deleted: 0 });

      const semesters = conditions
        .orderBy('semester.created_at', 'DESC')
        .skip(offset)
        .take(length)
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

  async getSemesterByAcademicId(
    academic_id: number,
  ): Promise<SemesterEntity[] | null> {
    try {
      const conditions = this._semesterRepository
        .createQueryBuilder('semester')
        .innerJoinAndMapOne(
          'semester.academic',
          AcademicYearEntity,
          'academic',
          `academic.id = semester.academic_id AND
           academic.deleted = 0`,
        )
        .where('semester.academic_id = :academic_id', { academic_id })
        .andWhere('semester.deleted = :deleted', { deleted: 0 });

      const semesters = await conditions.getMany();

      return semesters || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SemesterService.getSemesterByAcademicId()',
        e,
      );
      return null;
    }
  }

  async count(): Promise<number> {
    try {
      const conditions = this._semesterRepository
        .createQueryBuilder('semester')
        .select('COUNT(semester.id)', 'count')
        .innerJoin(
          AcademicYearEntity,
          'academic',
          'semester.academic_id = academic.id',
        )
        .where('semester.active = :active', { active: 1 })
        .andWhere('semester.deleted = :deleted', { deleted: 0 });

      console.log('sql: ', conditions.getSql());

      const { count } = await conditions.getRawOne();

      return count || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SemesterService.count()',
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
    request_code: string,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const result = await manager.update(
        SemesterEntity,
        { id: semester_id },
        { deleted: true, deleted_at: new Date(), deleted_by: request_code },
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
