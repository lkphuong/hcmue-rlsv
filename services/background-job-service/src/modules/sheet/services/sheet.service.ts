import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { LogService } from '../../log/services/log.service';

import { SheetEntity } from '../../../entities/sheet.entity';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class SheetService {
  constructor(
    @InjectRepository(SheetEntity) _sheetRepository: Repository<SheetEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async bulkAdd(
    sheets: SheetEntity[],
    manager?: EntityManager,
  ): Promise<SheetEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      sheets = await manager.save(sheets);
      return sheets || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'SheetService.bulkAdd()',
        e,
      );
      return null;
    }
  }

  async bulkUpdate(
    sheets: SheetEntity[],
    manager?: EntityManager,
  ): Promise<SheetEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      sheets = manager.create(SheetEntity, sheets);
      console.log('sheets: ', sheets[0]);
      sheets = await manager.save(sheets);

      return sheets || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'SheetService.bulkUpdate()',
        e,
      );
      return null;
    }
  }
}
