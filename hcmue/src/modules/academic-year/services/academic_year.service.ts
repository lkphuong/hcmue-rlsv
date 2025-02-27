import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { AcademicYearDefaultResponse } from '../interfaces/academic_year_response.interface';

@Injectable()
export class AcademicYearService {
  constructor(
    @InjectRepository(AcademicYearEntity)
    private readonly _academicYearRepository: Repository<AcademicYearEntity>,
    private readonly _dataSourtce: DataSource,
    private _logger: LogService,
  ) {}

  async contains(id: number): Promise<AcademicYearEntity | null> {
    try {
      const conditions = this._academicYearRepository
        .createQueryBuilder('academic_year')
        .leftJoinAndSelect(
          'academic_year.forms',
          'form',
          'form.academic_id = academic_year.id AND form.deleted = 0',
        )
        .where('academic_year.id = :id', { id })
        .andWhere('academic_year.deleted = :deleted', { deleted: false });

      const academic_year = await conditions.getOne();

      return academic_year || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AcademicYearService.contains()',
        e,
      );
      return null;
    }
  }

  async getAcademicYears(): Promise<AcademicYearEntity[] | null> {
    try {
      const conditions = this._academicYearRepository
        .createQueryBuilder('academic_year')
        .where('academic_year.active = :active', { active: 1 })
        .andWhere('academic_year.deleted = :deleted', { deleted: 0 });

      const academic_years = conditions
        .orderBy('academic_year.created_at', 'DESC')
        .getMany();
      return academic_years || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AcademicYearService.getSemesters()',
        e,
      );

      return null;
    }
  }

  async getClassesByAcademic(
    academic_year_id: number,
    class_id?: string | null,
  ): Promise<AcademicYearEntity | null> {
    try {
      let conditions = await this._academicYearRepository
        .createQueryBuilder('academic_year')
        .innerJoinAndSelect('academic_year.classes', 'academic_year_classes')
        .where('academic_year_classes.academic_year_id = :academic_year_id', {
          academic_year_id,
        })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('academic_year_classes.deleted = :deleted', {
          deleted: false,
        });

      if (class_id) {
        conditions = conditions.andWhere(
          'academic_year_classes.class_id = :class_id',
          { class_id },
        );
      }

      const academic_year = await conditions.getOne();
      return academic_year || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AcademicYearService.getAcademicYearClassesById()',
        e,
      );
      return null;
    }
  }

  async getAcademicYearById(id: number): Promise<AcademicYearEntity | null> {
    try {
      const conditions = this._academicYearRepository
        .createQueryBuilder('academic_year')
        .where('academic_year.id = :id', { id })
        .andWhere('academic_year.deleted = :deleted', { deleted: false });

      const academic_year = await conditions.getOne();
      return academic_year || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AcademicYearService.getAcademicYearById()',
        e,
      );
      return null;
    }
  }

  async getAcademicYearByTime(
    start: number,
    end: number,
  ): Promise<AcademicYearEntity | null> {
    try {
      const conditions = this._academicYearRepository
        .createQueryBuilder('academic_year')
        .where('academic_year.start = :start', { start })
        .andWhere('academic_year.end = :end', { end })
        .andWhere('academic_year.deleted = :deleted', { deleted: false });

      const academic_year = await conditions.getOne();

      return academic_year || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AcademicYearService.getAcademicYearByName()',
        e,
      );
      return null;
    }
  }

  async getDefaultAcademicYear() {
    try {
      const query = `
        SELECT 
            academic_id, semesters.id AS semester_id
        FROM
            academic_years
                JOIN
            semesters ON academic_years.id = semesters.academic_id
        WHERE
            academic_years.delete_flag = 0
                AND semesters.delete_flag = 0
        ORDER BY academic_years.id DESC , semesters.id DESC
        LIMIT 1;
      `;

      const result = (await this._dataSourtce.query(
        query,
      )) as AcademicYearDefaultResponse;

      return result[0] || null;
    } catch (err) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'AcademicYearService.getDefaultAcademicYear()',
        err,
      );
      return null;
    }
  }

  async add(
    academic_year: AcademicYearEntity,
    manager?: EntityManager,
  ): Promise<AcademicYearEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSourtce.manager;
      }

      academic_year = await manager.save(academic_year);

      return academic_year || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'AcademicYearService.add()',
        e,
      );
      return null;
    }
  }

  async unlink(
    academic_year_id: number,
    request_code: string,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSourtce.manager;
      }

      const result = await manager.update(
        AcademicYearEntity,
        { id: academic_year_id },
        { deleted: true, deleted_by: request_code, deleted_at: new Date() },
      );

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'AcademicYearService.unlink()',
        e,
      );
      return null;
    }
  }
}
