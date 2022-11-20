import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { FormEntity } from '../../../entities/form.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(FormEntity)
    private readonly _formSerive: Repository<FormEntity>,
    private _logger: LogService,
  ) {}

  async getFormById(id: number): Promise<FormEntity | null> {
    try {
      const conditions = this._formSerive
        .createQueryBuilder('form')
        .where('form.id = :id', { id })
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

  async getFormByParentId(ref: string): Promise<FormEntity[] | null> {
    try {
      const conditions = this._formSerive
        .createQueryBuilder('form')
        .where('form.parent_id = :ref', { ref })
        .andWhere('form.deleted = :deleted', { deleted: false });

      const forms = await conditions.getMany();

      return forms || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FormService.getFormByParentId()',
        e,
      );
      return null;
    }
  }

  async getForm(): Promise<FormEntity[] | null> {
    try {
      const conditions = this._formSerive
        .createQueryBuilder('form')
        .where('form.active = :active', { active: true })
        .andWhere('form.parent_id IS NULL')
        .andWhere('form.deleted = :deleted', { deleted: false });

      const forms = await conditions.getMany();

      return forms || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FormService.getForm()',
        e,
      );
      return null;
    }
  }

  async getChildren(
    sheet_id: number,
    ref: string,
  ): Promise<FormEntity[] | null> {
    try {
      const conditions = this._formSerive
        .createQueryBuilder('form')
        .leftJoinAndSelect(
          'form.evaluation_form',
          'evaluation',
          'evaluation.form_id = form.id AND evaluation.parent_id = :ref',
          { ref },
        )
        .where('form.deleted = :deleted', { deleted: false })
        .andWhere('evaluation.sheet_id = :sheet_id', { sheet_id });

      const forms = await conditions.getMany();

      return forms || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FormService.getChildren()',
        e,
      );
      return null;
    }
  }
}
