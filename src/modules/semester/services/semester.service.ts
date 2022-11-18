import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SemesterEntity } from '../../../entities/semester.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(SemesterEntity)
    private readonly _semesterRepository: Repository<SemesterEntity>,
    private _logger: LogService,
  ) {}

  async getSemesters(): Promise<SemesterEntity[] | null> {
    try {
      const conditions = this._semesterRepository
        .createQueryBuilder('semester')
        .where('semester.active = :active', { active: 1 })
        .andWhere('semester.deleted = :deleted', { deleted: 0 });

      const semesters = conditions.getMany();

      return semesters || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SemesterService.getSemesters()',
        e,
      );

      return null;
    }
  }
}
