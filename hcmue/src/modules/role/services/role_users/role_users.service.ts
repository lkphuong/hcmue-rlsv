import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  DataSource,
  DeleteResult,
  EntityManager,
  Repository,
  UpdateResult,
} from 'typeorm';

import { RoleUsersEntity } from 'src/entities/role_users.entity';

import { LogService } from '../../../log/services/log.service';
import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';
import { RoleCode } from 'src/constants/enums/role_enum';

@Injectable()
export class RoleUsersService {
  constructor(
    @InjectRepository(RoleUsersEntity)
    private readonly _roleUserRepository: Repository<RoleUsersEntity>,
    private readonly _dataSource: DataSource,
    private readonly _logger: LogService,
  ) {}

  async getRoleUsers(user_ids: string[]): Promise<RoleUsersEntity[] | null> {
    try {
      const conditions = this._roleUserRepository
        .createQueryBuilder('role_users')
        .innerJoinAndSelect('role_users.role', 'role')
        .where('role_users.user_id IN (:...user_ids)', { user_ids })
        .andWhere('role.deleted = :deleted', { deleted: false })
        .andWhere('role_users.deleted = :deleted', { deleted: false });

      const role_users = await conditions.getMany();

      return role_users || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'RoleUsersService.getRoleUsers()',
        e,
      );
      return null;
    }
  }

  // async getRoleUser(
  //   user_id: string,
  //   code: number,
  //   department_id: string,
  //   class_id?: string,
  // ): Promise<RoleUsersEntity | null> {
  //   try {
  //     let conditions = this._roleUserRepository
  //       .createQueryBuilder('role_users')
  //       .innerJoinAndSelect('role_users.role', 'role')
  //       .where(
  //         new Brackets((qb) => {
  //           qb.where('role.code = :code', { code });
  //           qb.andWhere('role_users.department_id = :department_id', {
  //             department_id,
  //           });
  //           qb.andWhere('role_users.deleted = :deleted', { deleted: false });
  //         }),
  //       )
  //       .orWhere('role_users.user_id = :user_id', { user_id });

  //     if (class_id) {
  //       conditions = conditions
  //         .where(
  //           new Brackets((qb) => {
  //             qb.where('role.code = :code', { code });
  //             qb.andWhere('role_users.department_id = :department_id', {
  //               department_id,
  //             });
  //             qb.andWhere('role_users.deleted = :deleted', { deleted: false });
  //             qb.andWhere('role_users.class_id = :class_id', {
  //               class_id,
  //             });
  //           }),
  //         )
  //         .orWhere('role_users.user_id = :user_id', { user_id });
  //     }

  //     console.log('sql: ', conditions.getSql());

  //     const role_user = await conditions.getOne();

  //     return role_user || null;
  //   } catch (e) {
  //     this._logger.writeLog(
  //       Levels.ERROR,
  //       Methods.SELECT,
  //       'RoleUsersService.getRoleUser()',
  //       e,
  //     );
  //     return null;
  //   }
  // }

  async getRoleUserByUserId(user_id: string): Promise<RoleUsersEntity | null> {
    try {
      const conditions = this._roleUserRepository
        .createQueryBuilder('role_user')
        .where('role_user.user_id = :user_id', { user_id })
        .andWhere('role_user.deleted = :deleted', { deleted: false });

      const role_user = await conditions.getOne();

      return role_user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'RoleUsersService.getRoleUserByUserId()',
        e,
      );
      return null;
    }
  }

  async add(
    role_user: RoleUsersEntity,
    manager?: EntityManager,
  ): Promise<RoleUsersEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      role_user = await manager.save(role_user);

      return role_user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'RoleUsersService.add()',
        e,
      );
      return null;
    }
  }

  async unlink(id: number, manager?: EntityManager): Promise<boolean> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const result = await manager.delete(RoleUsersEntity, { id: id });

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'RoleUsersService.unlink()',
        e,
      );
      return null;
    }
  }

  async buklUnlink(
    code: number,
    role_id: number,
    department_id: string,
    class_id: string,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      let result: DeleteResult | null = null;
      if (code === RoleCode.DEPARTMENT) {
        result = await manager.delete(RoleUsersEntity, {
          department_id: department_id,
          role: role_id,
        });
      } else if (code !== RoleCode.ADMIN) {
        result = await manager.delete(RoleUsersEntity, {
          department_id: department_id,
          class_id: class_id,
          role: role_id,
        });
      }

      console.log('result: ', result);

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'RoleUsersService.unlink()',
        e,
      );
      return null;
    }
  }
}
