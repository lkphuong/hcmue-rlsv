import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { LogService } from '../../log/services/log.service';

import { ApprovalEntity } from '../../../entities/approval.entity';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectRepository(ApprovalEntity)
    _approvalRepository: Repository<ApprovalEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async bulkUpdate(
    approvals: ApprovalEntity[],
    manager?: EntityManager,
  ): Promise<ApprovalEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      approvals = manager.create(ApprovalEntity, approvals);
      console.log('approvals: ', approvals[0]);
      approvals = await manager.save(approvals);

      return approvals || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'ApprovalService.bulkUpdate()',
        e,
      );
      return null;
    }
  }
}
