import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { ApprovalEntity } from 'src/entities/approval.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectRepository(ApprovalEntity)
    private readonly _approvalRepository: Repository<ApprovalEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async bulkAdd(
    approvals: ApprovalEntity[],
    manager: EntityManager,
  ): Promise<ApprovalEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      approvals = await manager.save(approvals);

      return approvals || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ApprovalService.bulkAdd()',
        e,
      );
      return null;
    }
  }

  async getApprovalBySheet(
    sheet_id: number,
    role_id: number,
  ): Promise<ApprovalEntity | null> {
    try {
      const conditions = this._approvalRepository
        .createQueryBuilder('approval')
        .innerJoin('approval.sheet', 'sheet')
        .where('sheet.id = :sheet_id', { sheet_id })
        .andWhere('approval.role_id = :role_id', { role_id })
        .andWhere('approval.deleted = :deleted', { deleted: false });

      const approval = await conditions.getOne();

      return approval || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'ApprovalService.getApprovalBySheet()',
        e,
      );
      return null;
    }
  }
}
