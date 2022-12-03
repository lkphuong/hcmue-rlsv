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

  async getUsersPaging(
    offset: number,
    length: number,
    class_id: string,
    department_id: string,
    input?: string,
  ): Promise<any> {
    try {
      let users: any = null;
      if (input) {
        users = await this._userModule.aggregate([
          {
            $lookup: {
              from: 'classs',
              localField: 'classId',
              foreignField: '_id',
              as: 'classs',
            },
          },
          {
            $unwind: {
              path: '$classs',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'department',
              localField: 'departmentId',
              foreignField: '_id',
              as: 'department',
            },
          },
          {
            $unwind: {
              path: '$department',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              $or: [
                {
                  username: {
                    $regex: new RegExp(input, 'i'),
                  },
                },
                {
                  fullname: {
                    $regex: new RegExp(input, 'i'),
                  },
                },
              ],
              // $and: [
              //   {
              //     classId: convertString2ObjectId(class_id),
              //   },
              //   {
              //     departmentId: convertString2ObjectId(department_id),
              //   },
              //   {
              //     $or: [
              //       {
              //         username: {
              //           $regex: new RegExp(input, 'i'),
              //         },
              //       },
              //       {
              //         fullname: {
              //           $regex: new RegExp(input, 'i'),
              //         },
              //       },
              //     ],
              //   },
              // ],
            },
          },
          {
            $skip: offset,
          },
          {
            $limit: length,
          },
        ]);
      } else {
        users = await this._userModule.aggregate([
          {
            $lookup: {
              from: 'classs',
              localField: 'classId',
              foreignField: '_id',
              as: 'classs',
            },
          },
          {
            $unwind: {
              path: '$classs',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'department',
              localField: 'departmentId',
              foreignField: '_id',
              as: 'department',
            },
          },
          {
            $unwind: {
              path: '$department',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              $and: [
                {
                  classId: convertString2ObjectId(class_id),
                },
                {
                  departmentId: convertString2ObjectId(department_id),
                },
              ],
            },
          },
          {
            $skip: offset,
          },
          {
            $limit: length,
          },
        ]);
      }

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

  async count(
    class_id: string,
    department_id: string,
    input?: string,
  ): Promise<any> {
    try {
      let result;
      if (input) {
        console.log('check 2');
        result = await this._userModule.aggregate([
          {
            $match: {
              $or: [
                {
                  username: {
                    $regex: new RegExp(input, 'i'),
                  },
                },
                {
                  fullname: {
                    $regex: new RegExp(input, 'i'),
                  },
                },
              ],
            },
          },
          {
            $count: 'count',
          },
        ]);
      } else {
        result = await this._userModule.aggregate([
          {
            $match: {
              $and: [
                {
                  classId: convertString2ObjectId(class_id),
                },
                {
                  departmentId: convertString2ObjectId(department_id),
                },
              ],
            },
          },
          {
            $count: 'count',
          },
        ]);
      }

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

  async getUsersByClass(
    class_id: string,
    input?: string,
  ): Promise<User[] | null> {
    try {
      let users: User[] | null = null;
      if (input) {
        users = await this._userModule.aggregate([
          {
            $match: {
              $and: [
                {
                  classId: convertString2ObjectId(class_id),
                },
                {
                  $or: [
                    {
                      username: {
                        $regex: new RegExp(input, 'i'),
                      },
                    },
                    {
                      fullname: {
                        $regex: new RegExp(input, 'i'),
                      },
                    },
                  ],
                },
              ],
            },
          },
        ]);
      } else {
        users = await this._userModule.aggregate([
          {
            $match: {
              $and: [
                {
                  classId: convertString2ObjectId(class_id),
                },
              ],
            },
          },
        ]);
      }

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

  async getUserById(id: string): Promise<User | null> {
    try {
      const users = await this._userModule
        .aggregate<User>([
          {
            $match: { _id: convertString2ObjectId(id) },
          },
          {
            $lookup: {
              from: 'department',
              localField: 'departmentId',
              foreignField: '_id',
              as: 'department',
            },
          },
          {
            $unwind: '$department',
          },
          {
            $lookup: {
              from: 'classs',
              localField: 'classId',
              foreignField: '_id',
              as: 'class',
            },
          },
          {
            $unwind: '$class',
          },
        ])
        .exec();

      console.log('user: ', users);

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
}
