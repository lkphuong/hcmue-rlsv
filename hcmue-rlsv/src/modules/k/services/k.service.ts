import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { convertString2ObjectId } from '../../../utils';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

import { _KDocument, _K } from '../../../schemas/_k.schema';

@Injectable()
export class KService {
  constructor(
    @InjectModel(_K.name)
    private readonly _kModel: Model<_KDocument>,
    private _logger: LogService,
  ) {}

  async getKById(k_id: string): Promise<_K | null> {
    try {
      const department = await this._kModel.findOne({
        _id: convertString2ObjectId(k_id),
      });

      return department || null;
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
