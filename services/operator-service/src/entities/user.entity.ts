import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApprovalEntity } from './approval.entity';
import { RootEntity } from './root.entity';

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
    select: false,
  })
  password: string;

  @Column('varchar', {
    name: 'fullname',
    nullable: false,
    length: 255,
  })
  fullname: string;

  @Column('date', {
    name: 'birthday',
    nullable: true,
  })
  birthday: Date;

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
    name: 'semester',
    nullable: false,
    default: 0,
  })
  semester_id: number;

  @OneToMany(() => ApprovalEntity, (approvals) => approvals.user)
  approvals: ApprovalEntity[];
}
