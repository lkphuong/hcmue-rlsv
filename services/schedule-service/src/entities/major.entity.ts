import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';

import { UserEntity } from './user.entity';

@Entity('majors')
export class MajorEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('varchar', {
    name: 'name',
    nullable: false,
    length: 255,
  })
  name: string;

  @Column('bigint', {
    name: 'department_id',
    nullable: false,
  })
  department_id: number;

  users: UserEntity[] | null;
}
