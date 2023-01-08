import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';

import { RoleUsersEntity } from '../../../../entities/role_users.entity';

import { LogService } from '../../../log/services/log.service';

import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';
import { RoleCode } from '../../../../constants/enums/role_enum';

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

  async getRoleUserByRoleId(
    department_id: number,
    role_id: number,
    class_id?: number,
  ): Promise<RoleUsersEntity | null> {
    try {
      let conditions = this._roleUserRepository
        .createQueryBuilder('role_user')
        .where('role_user.role_id = :role_id', { role_id })
        .andWhere('role_user.department_id = :department_id', { department_id })
        .andWhere('role_user.deleted = :deleted', { deleted: false });

      if (class_id) {
        conditions = conditions.andWhere('role_user.class_id = :class_id', {
          class_id,
        });
      }

      const role_user = await conditions.getOne();
      return role_user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'RoleUsersService.getRoleUserByRoleId()',
        e,
      );
      return null;
    }
  }

  async getRoleUserByUserId(user_id: number): Promise<RoleUsersEntity | null> {
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

  async getRoleUserByStdCode(
    std_code: string,
  ): Promise<RoleUsersEntity | null> {
    try {
      const conditions = this._roleUserRepository
        .createQueryBuilder('role_user')
        .where('role_user.std_code = :std_code', { std_code })
        .andWhere('role_user.deleted = :deleted', { deleted: false });

      const role_user = await conditions.getOne();
      return role_user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'RoleUsersService.getRoleUserByStdCode()',
        e,
      );
      return null;
    }
  }

  async checkRoleUser(
    department_id: number,
    role_id: number,
    class_id?: number,
  ): Promise<RoleUsersEntity | null> {
    try {
      let conditions = this._roleUserRepository
        .createQueryBuilder('role_user')
        .innerJoinAndSelect('role_user.role', 'role')
        .where('role.code = :role_id', { role_id })
        .andWhere('role_user.department_id = :department_id', {
          department_id,
        })
        .andWhere('role_user.deleted = :deleted', { deleted: false })
        .andWhere('role.deleted = :deleted', { deleted: false });

      if (class_id) {
        conditions = conditions.andWhere('role_user.class_id = :class_id', {
          class_id,
        });
      }

      const role_user = await conditions.getOne();
      return role_user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'RoleUsersService.checkRoleUser()',
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
        Methods.INSERT,
        'RoleUsersService.add()',
        e,
      );
      return null;
    }
  }

  async update(
    role_user: RoleUsersEntity,
    manager?: EntityManager,
  ): Promise<RoleUsersEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      role_user = await manager.save(role_user);
      return role_user;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'RoleUsersService.update()',
        e,
      );
      return null;
    }
  }

  async unlink(
    std_code: string,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const result = await manager.update(
        RoleUsersEntity,
        { std_code: std_code },
        { deleted: true, deleted_at: new Date(), deleted_by: 'admin' },
      );

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'RoleUsersService.unlink()',
        e,
      );
      return null;
    }
  }

  async buklUnlink(
    role_code: number,
    role_id: number,
    department_id: number,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      let result: DeleteResult | null = null;
      if (role_code === RoleCode.DEPARTMENT) {
        //#region RoleCode.DEPARTMENT
        const role_user = await this.getRoleUserByRoleId(
          department_id,
          role_id,
        );

        if (role_user) {
          result = await manager.delete(RoleUsersEntity, {
            department_id: department_id,
            role: role_id,
          });
        } else return true;
        //#endregion
      }

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'RoleUsersService.buklUnlink()',
        e,
      );
      return null;
    }
  }
}
