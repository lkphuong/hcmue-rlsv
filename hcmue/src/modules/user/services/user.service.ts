import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  generateCountUserPipeline,
  generateGetUserByIdPipeline,
  generateGetUserByUserIds,
  generateGetUsersByClassPipeline,
  generateGetUsersByInputPipeline,
  generateGetUsersPagingPipeline,
} from '../pipelines';

import { UserDocument, User } from '../../../schemas/user.schema';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly _userModule: Model<UserDocument>,
    private _logger: LogService,
  ) {}

  async count(
    class_id: string,
    department_id: string,
    input?: string,
  ): Promise<any> {
    try {
      const pipeline = generateCountUserPipeline(
        class_id,
        department_id,
        input,
      );

      const result = await this._userModule.aggregate<{ count: number }>(
        pipeline,
      );

      const count = result[0].count ?? 0;
      return count || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.count()',
        e,
      );
      return null;
    }
  }

  async getUsersPaging(
    offset: number,
    length: number,
    class_id: string,
    department_id: string,
    input?: string,
  ): Promise<User[]> {
    try {
      const pipeline = generateGetUsersPagingPipeline(
        offset,
        length,
        class_id,
        department_id,
        input,
      );

      const users = await this._userModule.aggregate<User>(pipeline);
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

  async getUsersByClass(
    class_id: string,
    input?: string,
  ): Promise<User[] | null> {
    try {
      const pipeline = generateGetUsersByClassPipeline(class_id, input);
      const users = this._userModule.aggregate<User>(pipeline);
      return users || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.getUsersByClass()',
        e,
      );
      return null;
    }
  }

  async getUsersByInput(
    class_id: string,
    department_id: string,
    input: string,
  ): Promise<User[]> {
    try {
      const pipeline = generateGetUsersByInputPipeline(
        class_id,
        department_id,
        input,
      );

      const users = await this._userModule.aggregate<User>(pipeline);
      return users || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.getUsersByInput()',
        e,
      );
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const pipeline = generateGetUserByIdPipeline(id);
      const users = await this._userModule.aggregate<User>(pipeline).exec();
      return users && users.length > 0 ? users[0] : null;
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

  async getUserByIds(user_ids: Types.ObjectId[]): Promise<User[] | null> {
    try {
      const pipeline = generateGetUserByUserIds(user_ids);
      const users = await this._userModule.aggregate<User>(pipeline).exec();
      return users || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.getUserByIds()',
        e,
      );
      return null;
    }
  }
}
