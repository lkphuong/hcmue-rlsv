import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { catchError, map } from 'rxjs';

import { LogService } from '../../log/services/log.service';

import { SheetEntity } from '../../../entities/sheet.entity';

import { SheetEntityPayload } from '../interfaces/payloads/create-sheets-entity.interface';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

import { BACKGROUND_JOB_MODULE } from '../../../constants';

@Injectable()
export class SheetService {
  constructor(
    @Inject(BACKGROUND_JOB_MODULE)
    private readonly _backgroundClient: ClientProxy,
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

  // async generateCreateSheets(
  //   pattern: string,
  //   data: SheetEntity[],
  // ): Promise<void> {
  //   this._backgroundClient.send(pattern, data);
  // }

  async send(pattern: string, results: SheetEntity[]): Promise<any> {
    return new Promise<any>((resolve) => {
      this._backgroundClient
        .send<any, SheetEntityPayload>(pattern, {
          payload: {
            data: results,
          },
        })
        .pipe(
          map((results) => {
            return results;
          }),
          catchError(() => {
            return null;
          }),
        )
        .subscribe((result) => resolve(result));
    });
  }
}
