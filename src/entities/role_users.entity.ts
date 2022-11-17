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
export class RoleUserEntity extends RootEntity {
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

  @ManyToOne(() => RoleEntity, (role) => role.role_user)
  @JoinColumn([
    {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  ])
  role: RoleEntity;
}
