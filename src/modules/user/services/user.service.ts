import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { convertString2ObjectId } from '../../../utils';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

import { UserDocument, User } from '../../../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModule: Model<UserDocument>,
    private _logger: LogService,
  ) {}

  async getUserByInput(id: string, input: string): Promise<User | null> {
    try {
      const user = await this._userModule.findOne({
        $or: [{ username: { $regex: input } }, { fullname: { $regex: input } }],
        $and: [{ _id: convertString2ObjectId(id) }],
      });

      return user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.getUserByInput()',
        e,
      );
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this._userModule.findOne({
        _id: convertString2ObjectId(id),
      });

      return user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.getUserById()',
        e,
      );
      return null;
    }
  }
}
