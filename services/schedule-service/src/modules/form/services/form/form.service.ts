import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { FormEntity } from '../../../../entities/form.entity';

import { LogService } from '../../../log/services/log.service';

import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';

import { FormStatus } from '../../constants/emuns/form_status.enum';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(FormEntity)
    private readonly _formRepository: Repository<FormEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getFormPublished(): Promise<FormEntity | null> {
    try {
      const conditions = this._formRepository
        .createQueryBuilder('form')
        .innerJoinAndSelect('form.academic_year', 'academic_year')
        .innerJoinAndSelect('form.semester', 'semester')
        .where('form.status = :status', { status: FormStatus.PUBLISHED })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('form.deleted = :deleted', { deleted: false });

      const form = await conditions.getOne();
      return form || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FormService.getFormPublished()',
        e,
      );
      return null;
    }
  }

  async getFormInProgress(): Promise<FormEntity | null> {
    try {
      const conditions = this._formRepository
        .createQueryBuilder('form')
        .innerJoinAndSelect('form.academic_year', 'academic_year')
        .innerJoinAndSelect('form.semester', 'semester')
        .where('form.status = :status', { status: FormStatus.IN_PROGRESS })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('form.deleted = :deleted', { deleted: false });

      const form = await conditions.getOne();
      return form || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FormService.getFormInProgress()',
        e,
      );
      return null;
    }
  }

  async updateForm(
    form_id: number,
    status: number,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const result = await manager.update(
        FormEntity,
        { id: form_id },
        { status: status },
      );

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(Levels.ERROR, Methods.UPDATE, 'FormService', e);
      return null;
    }
  }
}
