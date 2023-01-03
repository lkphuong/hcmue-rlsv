import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

import { SheetEntity } from '../../../../entities/sheet.entity';

import { LogService } from '../../../log/services/log.service';

import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';

import { StoreProcedureResponse } from '../../interfaces/store-procedure-response.interface';

@Injectable()
export class SheetService {
  constructor(
    @InjectRepository(SheetEntity)
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async generateSheets(
    source_form_id: number,
    source_academic_id: number,
    source_semester_id: number,
    manager?: EntityManager,
  ): Promise<boolean> {
    try {
      let success = false;

      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = (await manager.query(
        `CALL sp_generate_sheets (${source_form_id}, ${source_academic_id}, ${source_semester_id})`,
      )) as StoreProcedureResponse[];

      console.log('results: ', results);

      if (results && results.length > 0) {
        success = results[0].success != 0;
      }

      return success;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'HeaderService.generateSheets()',
        e,
      );
      return null;
    }
  }
}
