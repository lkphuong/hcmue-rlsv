import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { ClassEntity } from '../../../entities/class.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { SemesterEntity } from '../../../entities/semester.entity';
import { RoleUsersEntity } from '../../../entities/role_users.entity';
import { UserEntity } from '../../../entities/user.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { RoleEntity } from 'src/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async count(
    academic_id: number,
    semester_id: number,
    class_id: number,
    department_id: number,
    input?: string,
  ): Promise<number> {
    try {
      let conditions = this._userRepository
        .createQueryBuilder('user')
        .select('COUNT(user.id)', 'count')
        .innerJoin(
          AcademicYearEntity,
          'academic',
          `user.academic_id = academic_id AND
           academic.deleted = 0`,
        )
        .innerJoin(
          SemesterEntity,
          'semester',
          `semester.academic_id = academic_id AND
           semester.deleted = 0`,
        )
        .innerJoin(
          DepartmentEntity,
          'department',
          `department.id = user.department_id AND 
           department.deleted = 0`,
        )
        .innerJoin(
          ClassEntity,
          'class',
          `class.id = user.class_id AND
           class.deleted = 0`,
        )
        .where('semester.id = :semester_id', { semester_id })
        .andWhere('academic.id = :academic_id', { academic_id })
        .andWhere('user.deleted = :deleted', { deleted: false });

      if (class_id && class_id !== 0) {
        conditions = conditions.andWhere('user.class_id = :class_id', {
          class_id,
        });
      }

      if (department_id && department_id !== 0) {
        conditions = conditions.andWhere('user.department_id', {
          department_id,
        });
      }

      if (input) {
        conditions = conditions.andWhere(
          new Brackets((qb) => {
            qb.where(`user.std_code LIKE '%${input}%'`);
            qb.orWhere(`user.fullname LIKE '%${input}%'`);
          }),
        );
      }

      const { count } = await conditions.getRawOne();

      return count;
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

  async countUsersByAcademicAndSemester(
    academic_id: number,
    semester_id: number,
  ): Promise<number> {
    try {
      const conditions = await this._userRepository
        .createQueryBuilder('user')
        .select('COUNT(user.id)', 'count')
        .where('user.academic_id = :academic_id', { academic_id })
        .andWhere('user.semester_id = :semester_id', { semester_id })
        .andWhere('user.deleted = :deleted', { deleted: false });

      console.log('sql: ', conditions.getSql());

      const { count } = await conditions.getRawOne();

      return count;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.countUsersByAcademicAndSemester()',
        e,
      );
      return null;
    }
  }

  async getUsersPaging(
    offset: number,
    length: number,
    academic_id: number,
    semester_id: number,
    class_id: number,
    department_id: number,
    input?: string,
  ): Promise<UserEntity[]> {
    try {
      let conditions = this._userRepository
        .createQueryBuilder('user')
        .innerJoinAndMapOne(
          'user.academic',
          AcademicYearEntity,
          'academic',
          `user.academic_id = academic_id AND 
          academic.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.semester',
          SemesterEntity,
          'semester',
          `semester.academic_id = academic_id AND
           semester.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.department',
          DepartmentEntity,
          'department',
          `department.id = user.department_id AND 
           department.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.class',
          ClassEntity,
          'class',
          `class.id = user.class_id AND
           class.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.role_user',
          RoleUsersEntity,
          'role_user',
          `user.id = role_user.user_id AND 
          role_user.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'role_user.role',
          RoleEntity,
          'role',
          `role.id = role_user.role_id AND
           role.deleted = 0`,
        )
        .where('semester.id = :semester_id', { semester_id })
        .andWhere('academic.id = :academic_id', { academic_id })
        .andWhere('user.deleted = :deleted', { deleted: false });

      if (class_id && class_id !== 0) {
        conditions = conditions.andWhere('user.class_id = :class_id', {
          class_id,
        });
      }

      if (department_id && department_id !== 0) {
        conditions = conditions.andWhere('user.department_id', {
          department_id,
        });
      }

      if (input) {
        conditions = conditions.andWhere(
          new Brackets((qb) => {
            qb.where(`user.std_code LIKE '%${input}%'`);
            qb.orWhere(`user.fullname LIKE '%${input}%'`);
          }),
        );
      }

      const users = await conditions
        .orderBy('user.created_at', 'DESC')
        .skip(offset)
        .take(length)
        .getMany();

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
    academic_id: number,
    semester_id: number,
    class_id: number,
    input?: string,
  ): Promise<UserEntity[] | null> {
    try {
      let conditions = this._userRepository
        .createQueryBuilder('user')
        .innerJoinAndMapOne(
          'user.academic',
          AcademicYearEntity,
          'academic',
          `user.academic_id = academic_id AND 
          academic.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.semester',
          SemesterEntity,
          'semester',
          `semester.academic_id = academic_id AND
           semester.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.department',
          DepartmentEntity,
          'department',
          `department.id = user.department_id AND 
           department.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.class',
          ClassEntity,
          'class',
          `class.id = user.class_id AND
           class.deleted = 0`,
        )
        .where('academic.id = :academic_id', { academic_id })
        .andWhere('semester.id = :semester_id', { semester_id })
        .andWhere('class.id = :class_id', { class_id });

      if (input) {
        conditions = conditions.andWhere(
          new Brackets((qb) => {
            qb.where(`user.std_code LIKE '%${input}%'`);
            qb.orWhere(`user.fullname LIKE '%${input}%'`);
          }),
        );
      }

      const users = await conditions
        .orderBy('user.created_at', 'DESC')
        .getMany();

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
    academic_id: number,
    semester_id: number,
    class_id: number,
    department_id: number,
    input: string,
  ): Promise<UserEntity[]> {
    try {
      let conditions = this._userRepository
        .createQueryBuilder('user')
        .innerJoinAndMapOne(
          'user.academic',
          AcademicYearEntity,
          'academic',
          `user.academic_id = academic_id AND 
          academic.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.semester',
          SemesterEntity,
          'semester',
          `semester.academic_id = academic_id AND
           semester.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.department',
          DepartmentEntity,
          'department',
          `department.id = user.department_id AND 
           department.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.class',
          ClassEntity,
          'class',
          `class.id = user.class_id AND
           class.deleted = 0`,
        )
        .where('academic.id = :academic_id', { academic_id })
        .andWhere('semester.id = :semester_id', { semester_id })
        .andWhere('class.id = :class_id', { class_id })
        .andWhere('department.id = :department_id', { department_id })
        .andWhere('user.deleted = :deleted', { deleted: 0 });

      if (input) {
        conditions = conditions.andWhere(
          new Brackets((qb) => {
            qb.where(`user.std_code LIKE '%${input}%'`);
            qb.orWhere(`user.fullname LIKE '%${input}%'`);
          }),
        );
      }

      const users = await conditions
        .orderBy('user.created_at', 'DESC')
        .getMany();

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

  async getUserById(id: number): Promise<UserEntity | null> {
    try {
      const conditions = this._userRepository
        .createQueryBuilder('user')
        .innerJoinAndMapOne(
          'user.academic',
          AcademicYearEntity,
          'academic',
          `user.academic_id = academic_id AND 
        academic.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.semester',
          SemesterEntity,
          'semester',
          `semester.academic_id = academic_id AND
         semester.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.department',
          DepartmentEntity,
          'department',
          `department.id = user.department_id AND 
         department.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.class',
          ClassEntity,
          'class',
          `class.id = user.class_id AND
         class.deleted = 0`,
        )
        .where('user.id = :id', { id })
        .andWhere('user.deleted = :deleted', { deleted: 0 });

      const user = await conditions.getOne();

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

  async getUserByIds(user_ids: number[]): Promise<UserEntity[] | null> {
    try {
      const conditions = this._userRepository
        .createQueryBuilder('user')
        .innerJoinAndMapOne(
          'user.academic',
          AcademicYearEntity,
          'academic',
          `user.academic_id = academic_id AND 
        academic.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.semester',
          SemesterEntity,
          'semester',
          `semester.academic_id = academic_id AND
         semester.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.department',
          DepartmentEntity,
          'department',
          `department.id = user.department_id AND 
         department.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.class',
          ClassEntity,
          'class',
          `class.id = user.class_id AND
         class.deleted = 0`,
        )
        .where(`user.id IN (${user_ids.toString()})`)
        .andWhere('user.deleted = :deleted', { deleted: 0 });

      const users = await conditions
        .orderBy('user.created_at', 'DESC')
        .getMany();

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

  async bulkAdd(users: UserEntity[], manager?: EntityManager) {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = await manager.insert(UserEntity, users);

      return results || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.bulkAdd()',
        e,
      );
      return null;
    }
  }

  async bulkUnlink(
    academic_id: number,
    semester_id: number,
    manager?: EntityManager,
  ) {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      const results = await manager.update(
        UserEntity,
        {
          academic_id: academic_id,
          semester_id: semester_id,
          deleted: false,
        },
        { deleted: true, deleted_at: new Date(), deleted_by: 0 },
      );
      return results.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'UserService.bulkUnlink()',
        e,
      );
      return null;
    }
  }
}
