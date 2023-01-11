import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AcademicYearEntity } from './academic_year.entity';
import { ClassEntity } from './class.entity';
import { DepartmentEntity } from './department.entity';
import { MajorEntity } from './major.entity';
import { RoleUsersEntity } from './role_users.entity';
import { RootEntity } from './root.entity';
import { SemesterEntity } from './semester.entity';
import { StatusEntity } from './status.entity';

@Entity('users')
export class UserEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('varchar', {
    name: 'std_code',
    nullable: false,
    length: 20,
  })
  std_code: string;

  @Column('varchar', {
    name: 'password',
    nullable: false,
    length: 255,
  })
  password: string;

  @Column('varchar', {
    name: 'fullname',
    nullable: false,
    length: 255,
  })
  fullname: string;

  @Column('varchar', {
    name: 'birthday',
    nullable: true,
    length: 20,
  })
  birthday: string;

  @Column('bigint', {
    name: 'status_id',
    nullable: false,
    default: 0,
  })
  status_id: number;

  @Column('bigint', {
    name: 'class_id',
    nullable: false,
    default: 0,
  })
  class_id: number;

  @Column('bigint', {
    name: 'department_id',
    nullable: false,
    default: 0,
  })
  department_id: number;

  @Column('bigint', {
    name: 'major_id',
    nullable: false,
    default: 0,
  })
  major_id: number;

  @Column('bigint', {
    name: 'academic_id',
    nullable: false,
    default: 0,
  })
  academic_id: number;

  @Column('bigint', {
    name: 'semester_id',
    nullable: false,
    default: 0,
  })
  semester_id: number;

  status: StatusEntity | null;

  class: ClassEntity | null;

  department: DepartmentEntity | null;

  major: MajorEntity | null;

  academic: AcademicYearEntity | null;

  semester: SemesterEntity | null;

  role_user: RoleUsersEntity | null;
}
