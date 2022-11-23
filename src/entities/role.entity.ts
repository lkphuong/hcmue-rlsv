import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleUserEntity } from './role_users.entity';

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

  @OneToMany(() => RoleUserEntity, (role_user) => role_user.role)
  role_user: RoleUserEntity[];
}
