import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';

@Entity('sessions')
export class SessionEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('bigint', {
    name: 'user_id',
    nullable: false,
    default: 0,
  })
  user_id: number;

  @Column('varchar', {
    name: 'username',
    nullable: false,
    length: 255,
  })
  username: string;

  @Column('varchar', {
    name: 'fullname',
    nullable: true,
    length: 255,
  })
  fullname: string;

  @Column('tinyint', {
    name: 'role_id',
    nullable: false,
    default: 0,
  })
  role_id: number;

  @Column('bigint', {
    name: 'class_id',
    nullable: true,
    default: 0,
  })
  class: number;

  @Column('bigint', {
    name: 'department_id',
    nullable: true,
    default: 0,
  })
  department: number;

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
