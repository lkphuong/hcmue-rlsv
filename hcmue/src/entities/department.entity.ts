import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';

import { ClassEntity } from './class.entity';
import { UserEntity } from './user.entity';

@Entity('departments')
export class DepartmentEntity extends RootEntity {
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

  classes: ClassEntity[] | null;
  users: UserEntity[] | null;
}
