import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { HeaderEntity } from '../../../entities/header.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class HeaderService {
  constructor(
    @InjectRepository(HeaderEntity)
    private readonly _headerService: Repository<HeaderEntity>,
    private _logger: LogService,
  ) {}

  async getHeadersByFormId(id: number): Promise<HeaderEntity[] | null> {
    try {
      const conditions = this._headerService
        .createQueryBuilder('header')
        .where('header.form_id = :id', { id });

      const headers = await conditions.getMany();

      return headers || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'HeaderService.getHeadersByFormId()',
        e,
      );
      return null;
    }
  }
}
