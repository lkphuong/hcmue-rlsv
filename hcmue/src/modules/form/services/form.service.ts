import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { FormEntity } from '../../../entities/form.entity';

import { LogService } from '../../log/services/log.service';

import { FormStatus } from '../constants/enums/statuses.enum';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(FormEntity)
    private readonly _formRepository: Repository<FormEntity>,
    private readonly _dataSourece: DataSource,
    private readonly _logger: LogService,
  ) {}

  async isAnyPublish(
    semester_id: number,
    academic_id: number,
  ): Promise<FormEntity | null> {
    try {
      const conditions = this._formRepository
        .createQueryBuilder('form')
        .innerJoinAndSelect('form.academic_year', 'academic_year')
        .innerJoinAndSelect('form.semester', 'semester')
        .where('form.semester_id = :semester_id', { semester_id })
        .andWhere('form.academic_id = :academic_id', { academic_id })
        .andWhere('form.status > :status', { status: FormStatus.DRAFTED })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('form.deleted = :deleted', { deleted: false });

      const form = await conditions.getOne();
      return form || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FormService.isAnyPublish()',
        e,
      );
      return null;
    }
  }

  async getFormById(id: number): Promise<FormEntity | null> {
    try {
      const conditions = this._formRepository
        .createQueryBuilder('form')
        .innerJoinAndSelect('form.academic_year', 'academic_year')
        .innerJoinAndSelect('form.semester', 'semester')
        .where('form.id = :id', { id })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('form.deleted = :deleted', { deleted: false });

      const form = await conditions.getOne();
      return form || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FormService.getFormById()',
        e,
      );
      return null;
    }
  }

  async getForms(): Promise<FormEntity[] | null> {
    try {
      const conditions = this._formRepository
        .createQueryBuilder('form')
        .innerJoinAndSelect('form.academic_year', 'academic_year')
        .innerJoinAndSelect('form.semester', 'semester')
        .where('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('form.deleted = :deleted', { deleted: false });

      const forms = await conditions
        .orderBy('form.created_at', 'DESC')
        .getMany();
      return forms || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FormService.getForms()',
        e,
      );
      return null;
    }
  }

  async add(
    form: FormEntity,
    manager?: EntityManager,
  ): Promise<FormEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSourece.manager;
      }

      form = await manager.save(form);
      return form || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'FormService.add()',
        e,
      );
      return null;
    }
  }

  async update(
    form: FormEntity,
    manager?: EntityManager,
  ): Promise<FormEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSourece.manager;
      }

      form = await manager.save(form);
      return form || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'FormService.update()',
        e,
      );
      return null;
    }
  }

  async unlink(
    form: FormEntity,
    manager?: EntityManager,
  ): Promise<FormEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSourece.manager;
      }

      form = await manager.save(form);
      return form || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'FormService.unlink()',
        e,
      );
      return null;
    }
  }
}
