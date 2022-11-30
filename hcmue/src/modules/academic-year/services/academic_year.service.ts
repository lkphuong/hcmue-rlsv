import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class AcademicYearService {
  constructor(
    @InjectRepository(AcademicYearEntity)
    private readonly _academicYearRepository: Repository<AcademicYearEntity>,
    private _logger: LogService,
  ) {}

  async getAcademicYears(): Promise<AcademicYearEntity[] | null> {
    try {
      const conditions = this._academicYearRepository
        .createQueryBuilder('academic_year')
        .where('academic_year.active = :active', { active: 1 })
        .andWhere('academic_year.deleted = :deleted', { deleted: 0 });

      const academic_years = conditions.getMany();
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
        .innerJoinAndSelect(
          'academic_year.academic_year_classes',
          'academic_year_classes',
        )
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

  async getAcademicYearById(id: number): Promise<AcademicYearEntity> {
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
}
