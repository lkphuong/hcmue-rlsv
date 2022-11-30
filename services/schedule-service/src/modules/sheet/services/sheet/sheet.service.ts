import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as moment from 'moment';

import { SheetEntity } from '../../../../entities/sheet.entity';

import { LogService } from '../../../log/services/log.service';

import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';

import { ApprovedStatus } from '../../constants/enums/approved_status.enum';

@Injectable()
export class SheetService {
  constructor(
    @InjectRepository(SheetEntity)
    private readonly _sheetRepository: Repository<SheetEntity>,
    private _logger: LogService,
  ) {}

  async getSheetsPaging(
    offset: number,
    length: number,
  ): Promise<SheetEntity[] | null> {
    try {
      const conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoinAndSelect('sheet.approvals', 'approval')
        .where('sheet.deleted = :deleted', { deleted: false })
        .andWhere('approval.end_at <= :time', {
          time: moment(new Date()).format('YYYY-MM-DD HH-mm-ss'),
        })
        .andWhere('approval.approved_status = :status', {
          status: ApprovedStatus.UNASSESS,
        });

      const sheets = await conditions
        .orderBy('approval.category', 'ASC')
        .skip(offset)
        .take(length)
        .getMany();

      console.log(sheets[0]);

      return sheets || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.getSheetsPaging()',
        e,
      );
      return null;
    }
  }

  async countSheets(): Promise<number> {
    try {
      const conditions = this._sheetRepository
        .createQueryBuilder('sheet')
        .innerJoin('sheet.approvals', 'approval')
        .select('COUNT(DISTINCT sheet.id)', 'count')
        .where('sheet.deleted = :deleted', { deleted: false })
        .andWhere('approval.end_at <= :time', {
          time: moment(new Date()).format('YYYY-MM-DD HH-mm-ss'),
        })
        .andWhere('approval.approved_status = :status', {
          status: ApprovedStatus.UNASSESS,
        });

      const { count } = await conditions.getRawOne();

      return count;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'SheetService.countSheets()',
        e,
      );
      return null;
    }
  }
}
