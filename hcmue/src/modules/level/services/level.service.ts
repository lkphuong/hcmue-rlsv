import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { LevelEntity } from '../../../entities/level.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(LevelEntity)
    private readonly _levelRepository: Repository<LevelEntity>,
    private _logger: LogService,
  ) {}

  async getLevels(): Promise<LevelEntity[] | null> {
    try {
      const conditions = this._levelRepository
        .createQueryBuilder('level')
        .where('level.deleted = :deleted', { deleted: false });

      const levels = await conditions.getMany();
      return levels || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'LevelService.getLevels()',
        e,
      );
    }
  }

  async getLevelByMark(mark: number): Promise<LevelEntity | null> {
    try {
      const conditions = this._levelRepository
        .createQueryBuilder('level')
        .where(
          new Brackets((qb) => {
            qb.where('level.from_mark <= :mark', { mark });

            qb.andWhere('level.to_mark >= :mark', { mark });
          }),
        )
        .andWhere('level.deleted = :deleted', { deleted: false });

      const level = await conditions.getOne();
      return level || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'LevelService.getLevelByMark()',
        e,
      );
    }
  }

  async getLevelBySortOrder(sort_order: number): Promise<LevelEntity | null> {
    try {
      const conditions = this._levelRepository
        .createQueryBuilder('level')
        .where('level.sort_order = :sort_order', { sort_order })
        .andWhere('level.deleted = :deleted', { deleted: false });

      const level = await conditions.getOne();

      return level || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'LevelService.getLevelBySortOrder()',
        e,
      );
      return null;
    }
  }
}
