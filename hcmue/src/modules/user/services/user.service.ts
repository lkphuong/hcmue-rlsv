import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, EntityManager, Repository } from 'typeorm';

import { AcademicYearEntity } from '../../../entities/academic_year.entity';
import { ClassEntity } from '../../../entities/class.entity';
import { DepartmentEntity } from '../../../entities/department.entity';
import { SemesterEntity } from '../../../entities/semester.entity';
import { RoleUsersEntity } from '../../../entities/role_users.entity';
import { RoleEntity } from '../../../entities/role.entity';
import { UserEntity } from '../../../entities/user.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { StatusEntity } from '../../../entities/status.entity';
import { MajorEntity } from '../../../entities/major.entity';
import { KEntity } from '../../../entities/k.entity';

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
    class_id?: number,
    department_id?: number,
    status_id?: number,
    major_id?: number,
    input?: string,
  ): Promise<number> {
    try {
      let conditions = this._userRepository
        .createQueryBuilder('user')
        .select('COUNT(user.id)', 'count')
        .innerJoin(
          AcademicYearEntity,
          'academic',
          `user.academic_id = academic.id AND
           academic.deleted = 0`,
        )
        .innerJoin(
          SemesterEntity,
          'semester',
          `semester.id = user.semester_id AND
           semester.deleted = 0`,
        )
        .leftJoin(
          DepartmentEntity,
          'department',
          `department.id = user.department_id AND 
           department.deleted = 0`,
        )
        .leftJoin(
          ClassEntity,
          'class',
          `class.id = user.class_id AND
           class.deleted = 0`,
        )
        .leftJoin(
          StatusEntity,
          'status',
          `status.id = user.status_id AND
           status.deleted = 0`,
        )
        .leftJoin(
          MajorEntity,
          'major',
          `major.id = user.major_id AND 
          major.deleted = 0`,
        )
        .leftJoin(KEntity, 'k', `class.k = k.id AND k.deleted = 0`)
        .where('semester.id = :semester_id', { semester_id })
        .andWhere('academic.id = :academic_id', { academic_id })
        .andWhere('user.deleted = :deleted', { deleted: false });

      if (class_id && class_id !== 0) {
        conditions = conditions.andWhere('user.class_id = :class_id', {
          class_id,
        });
      }

      if (department_id && department_id !== 0) {
        conditions = conditions.andWhere(
          'user.department_id = :department_id',
          {
            department_id,
          },
        );
      }

      if (status_id && status_id !== 0) {
        conditions = conditions.andWhere('user.status_id = :status_id', {
          status_id,
        });
      }

      if (major_id && major_id !== 0) {
        conditions = conditions.andWhere('user.major_id = :major_id', {
          major_id,
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

  async countByAcademicAndSemester(
    academic_id: number,
    semester_id: number,
  ): Promise<number> {
    try {
      const conditions = this._userRepository
        .createQueryBuilder('user')
        .select('COUNT(user.id)', 'count')
        .innerJoin(
          AcademicYearEntity,
          'academic',
          `user.academic_id = user.academic_id AND
           academic.deleted = 0`,
        )
        .innerJoin(
          SemesterEntity,
          'semester',
          `semester.id = user.semester_id AND
           semester.deleted = 0`,
        )
        .where('semester.id = :semester_id', { semester_id })
        .andWhere('academic.id = :academic_id', { academic_id });

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

  async getUsersPaging(
    offset: number,
    length: number,
    academic_id: number,
    semester_id: number,
    class_id: number,
    department_id: number,
    status_id: number,
    major_id: number,
    input?: string,
  ): Promise<UserEntity[]> {
    try {
      let conditions = this._userRepository
        .createQueryBuilder('user')
        .innerJoinAndMapOne(
          'user.academic',
          AcademicYearEntity,
          'academic',
          `user.academic_id = user.academic_id AND 
          academic.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.semester',
          SemesterEntity,
          'semester',
          `semester.academic_id = user.academic_id AND
           semester.deleted = 0`,
        )
        .leftJoinAndMapOne(
          'user.department',
          DepartmentEntity,
          'department',
          `department.id = user.department_id AND 
           department.deleted = 0`,
        )
        .leftJoinAndMapOne(
          'user.class',
          ClassEntity,
          'class',
          `class.id = user.class_id AND
           class.deleted = 0`,
        )

        .leftJoinAndMapOne(
          'class.K',
          KEntity,
          'k',
          `k.id = class.k AND k.deleted = 0`,
        )
        .leftJoinAndMapOne(
          'user.role_user',
          RoleUsersEntity,
          'role_user',
          `user.std_code = role_user.std_code AND 
          role_user.deleted = 0`,
        )
        .leftJoinAndMapOne(
          'role_user.role',
          RoleEntity,
          'role',
          `role.code = role_user.role_id AND
           role.deleted = 0`,
        )
        .leftJoinAndMapOne(
          'user.status',
          StatusEntity,
          'status',
          `status.id = user.status_id AND
           status.deleted = 0`,
        )
        .leftJoinAndMapOne(
          'user.major',
          MajorEntity,
          'major',
          `major.id = user.major_id AND 
          major.deleted = 0`,
        )
        .where('semester.id = :semester_id', { semester_id })
        .andWhere('academic.id = :academic_id', { academic_id })
        .andWhere('user.active = :active', { active: true })
        .andWhere('user.deleted = :deleted', { deleted: false });

      if (class_id && class_id !== 0) {
        conditions = conditions.andWhere('user.class_id = :class_id', {
          class_id,
        });
      }

      if (department_id && department_id !== 0) {
        conditions = conditions.andWhere(
          'user.department_id = :department_id',
          {
            department_id,
          },
        );
      }

      if (status_id && status_id !== 0) {
        conditions = conditions.andWhere('user.status_id = :status_id', {
          status_id,
        });
      }

      if (major_id && major_id !== 0) {
        conditions = conditions.andWhere('user.major_id = :major_id', {
          major_id,
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
          `semester.academic_id = academic.id AND
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
          `user.academic_id = academic.id AND 
        academic.deleted = 0`,
        )
        .innerJoinAndMapOne(
          'user.semester',
          SemesterEntity,
          'semester',
          `semester.academic_id = academic.id AND
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

      const user = await conditions.orderBy('user.created_at', 'DESC').getOne();

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

  async getUserByCode(
    std_code: string,
    academic_id?: number,
    semester_id?: number,
  ): Promise<UserEntity | null> {
    try {
      const conditions = this._userRepository
        .createQueryBuilder('user')
        .innerJoinAndMapOne(
          'user.class',
          ClassEntity,
          'class',
          `class.id = user.class_id AND class.delete_flag = 0`,
        )
        .where('user.std_code = :std_code', { std_code })
        .andWhere('user.active = :active', { active: true })
        .andWhere('user.deleted = :deleted', { deleted: 0 });

      if (academic_id && academic_id !== 0) {
        conditions.andWhere('user.academic_id = :academic_id', { academic_id });
      }

      if (semester_id && semester_id !== 0) {
        conditions.andWhere('user.semester_id = :semester_id', { semester_id });
      }

      const user = await conditions.orderBy('user.created_at', 'DESC').getOne();

      return user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.getUserByCode()',
        e,
      );
      return null;
    }
  }

  async getUserByEmail(
    email: string,
    academic_id?: number,
    semester_id?: number,
  ): Promise<UserEntity | null> {
    try {
      const conditions = this._userRepository
        .createQueryBuilder('user')
        .innerJoinAndMapOne(
          'user.class',
          ClassEntity,
          'class',
          `class.id = user.class_id AND class.delete_flag = 0`,
        )
        .where('user.email = :email', { email })
        .andWhere('user.active = :active', { active: true })
        .andWhere('user.deleted = :deleted', { deleted: 0 });

      if (academic_id && academic_id !== 0) {
        conditions.andWhere('user.academic_id = :academic_id', { academic_id });
      }

      if (semester_id && semester_id !== 0) {
        conditions.andWhere('user.semester_id = :semester_id', { semester_id });
      }

      const user = await conditions.orderBy('user.created_at', 'DESC').getOne();

      return user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.getUserByCode()',
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

  async getOneUser(): Promise<UserEntity | null> {
    try {
      const conditions = this._userRepository
        .createQueryBuilder('user')
        .where('user.deleted = :deleted', { deleted: false })
        .andWhere('user.active = :active', { active: true })
        .orderBy('user.created_at', 'DESC');

      const user = await conditions.getOne();

      return user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'UserService.getOneUser()',
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

  async update(
    user: UserEntity,
    manager?: EntityManager,
  ): Promise<UserEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      user = await manager.save(user);

      return user || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'UserService.update()',
        e,
      );
      return null;
    }
  }

  async bulkUpdatePassword(
    source_academic_id: number,
    source_semester_id: number,
    target_academic_id: number,
    targer_semester_id: number,
    manager?: EntityManager,
  ): Promise<boolean> {
    try {
      let success = false;

      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = await manager.query(
        `call sp_update_users(${source_academic_id}, ${source_semester_id}, ${target_academic_id}, ${targer_semester_id});`,
      );

      console.log('results: ', results);

      if (results && results.length > 0) {
        success = results[0].success != 0;
      }

      return success;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'UserService.bulkUpdatePassword()',
        e,
      );
      return null;
    }
  }

  async bulkUnlink(manager?: EntityManager) {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      const results = await manager.update(
        UserEntity,
        {
          active: 1,
          deleted: false,
        },
        {
          updated_at: new Date(),
          updated_by: 'system',
          active: false,
          deleted: true,
        },
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
