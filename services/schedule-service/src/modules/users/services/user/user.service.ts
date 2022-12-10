import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserDocument, User } from '../../../../schemas/user.schema';

import { LogService } from '../../../log/services/log.service';

import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<UserDocument>,
    private _logger: LogService,
  ) {}

  async countUsers(): Promise<number> {
    try {
      const count = await this._userModel.count();
      return count || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.countUsers()',
        e,
      );
      return null;
    }
  }

  async getUsersPaging(offset: number, length: number): Promise<any> {
    try {
      const users = await this._userModel.aggregate([
        {
          $lookup: {
            from: 'classs',
            localField: 'classId',
            foreignField: '_id',
            as: 'class',
          },
        },
        {
          $unwind: {
            path: '$class',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: '_k',
            localField: 'class.K',
            foreignField: 'name',
            as: 'k',
          },
        },
        {
          $unwind: {
            path: '$k',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $skip: offset,
        },
        {
          $limit: length,
        },
      ]);

      return users || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.getUsersPaging()',
        e,
      );
      return null;
    }
  }
}
