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
}
