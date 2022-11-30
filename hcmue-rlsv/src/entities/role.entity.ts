import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleUsersEntity } from './role_users.entity';

import { RootEntity } from './root.entity';

@Entity('roles')
export class RoleEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('tinyint', {
    name: 'code',
    nullable: false,
    default: 1,
  })
  code: number;

  @Column('varchar', {
    name: 'name',
    nullable: false,
    length: 255,
  })
  name: string;

  @OneToMany(() => RoleUsersEntity, (user) => user.role)
  users: RoleUsersEntity[];
}
