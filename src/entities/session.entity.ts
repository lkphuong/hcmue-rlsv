import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';

@Entity('sessions')
export class SessionEntity extends RootEntity {
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
    name: 'username',
    nullable: false,
    length: 255,
  })
  username: string;

  @Column('varchar', {
    name: 'fullname',
    nullable: false,
    length: 255,
  })
  fullname: string;

  @Column('varchar', {
    name: 'class_id',
    nullable: false,
    length: 24,
  })
  class: string;

  @Column('varchar', {
    name: 'department_id',
    nullable: false,
    length: 24,
  })
  department: string;

  @Column('varchar', {
    name: 'access_token',
    nullable: true,
    default: 0,
    length: 500,
  })
  access_token: string;

  @Column('varchar', {
    name: 'refresh_token',
    nullable: true,
    default: 0,
    length: 500,
  })
  refresh_token: string;

  @Column('datetime', {
    name: 'login_time',
    nullable: false,
    default: () => 'getdate()',
  })
  login_time: Date;

  @Column('datetime', {
    name: 'expired_time',
    nullable: true,
  })
  expired_time: Date;

  @Column('datetime', {
    name: 'logout_time',
    nullable: true,
  })
  logout_time: Date;
}
