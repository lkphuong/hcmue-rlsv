import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';

@Entity('advisers')
export class AdviserEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('varchar', {
    name: 'email',
    nullable: false,
    length: 255,
  })
  email: string;

  @Column('varchar', {
    name: 'password',
    nullable: false,
    length: 45,
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
    nullable: false,
    length: 20,
  })
  birthday: string;

  @Column('varchar', {
    name: 'phone_number',
    nullable: true,
    length: 20,
  })
  phone_number: string;

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
  department_id: number;

  @Column('bigint', {
    name: 'academic_id',
    nullable: true,
    default: 0,
  })
  academic_id: number;

  @Column('bigint', {
    name: 'semester_id',
    nullable: true,
    default: 0,
  })
  semester_id: number;
}
