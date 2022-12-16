import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { LogService } from '../../../log/services/log.service';

import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';

@Injectable()
export class ApprovalService {
  constructor(
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async bulkUpdate(manager?: EntityManager): Promise<boolean> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = await manager.query(`CALL sp_update_approvals_status()`);
      return results[0][0].success ?? 0;
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
