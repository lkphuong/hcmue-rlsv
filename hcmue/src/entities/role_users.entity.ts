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
    name: 'user_id',
    nullable: false,
    length: 24,
  })
  user_id: string;

  @Column('varchar', {
    name: 'class_id',
    nullable: false,
    length: 24,
  })
  class_id: string;

  @Column('varchar', {
    name: 'department_id',
    nullable: false,
    length: 24,
  })
  department_id: string;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn([
    {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  ])
  role: RoleEntity;
}
