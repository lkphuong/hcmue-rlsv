import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RoleEntity } from './role.entity';
import { RootEntity } from './root.entity';

@Entity('role_users')
export class RoleUsersEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('varchar', {
    name: 'std_code',
    nullable: false,
    length: 255,
  })
  std_code: string;

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

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn([
    {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  ])
  role: RoleEntity | null;
}
