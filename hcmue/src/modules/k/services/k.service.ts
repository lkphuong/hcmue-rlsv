import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { KEntity } from 'src/entities/k.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class KService {
  constructor(
    @InjectRepository(KEntity)
    private readonly _kRepository: Repository<KEntity>,
    private _logger: LogService,
  ) {}

  async getKById(k_id: number): Promise<KEntity | null> {
    try {
      const conditions = await this._kRepository
        .createQueryBuilder('k')
        .where('k.id = :k_id', { k_id })
        .andWhere('k.deleted = :deleted', { deleted: false });

      const k = await conditions.getOne();

      return k || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'KService.getKById()',
        e,
      );
      return null;
    }
  }
}
