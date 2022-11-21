import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OptionEntity } from 'src/entities/option.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(OptionEntity)
    private readonly _optionRepository: Repository<OptionEntity>,
    private readonly _logger: LogService,
  ) {}

  async getOptionById(id: number): Promise<OptionEntity | null> {
    try {
      const conditions = this._optionRepository
        .createQueryBuilder('option')
        .where('option.id = :id', { id })
        .andWhere('option.deleted = :deleted');

      const option = await conditions.getOne();

      return option || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'OptionService.getOptionById()',
        e,
      );
      return null;
    }
  }
}
