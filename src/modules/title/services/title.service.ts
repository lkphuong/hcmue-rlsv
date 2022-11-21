import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TitleEntity } from '../../../entities/title.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(TitleEntity)
    private readonly _titleService: Repository<TitleEntity>,
    private _logger: LogService,
  ) {}

  async getTitlesByHeaderId(id: number): Promise<TitleEntity[] | null> {
    try {
      const conditions = this._titleService
        .createQueryBuilder('title')
        .where('title.header_id = :id', { id });

      const titles = await conditions.getMany();

      return titles || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'TitleService.getTitlesByHeaderId()',
        e,
      );
      return null;
    }
  }
}
