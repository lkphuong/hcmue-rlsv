import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { DepartmentEntity } from './department.entity';
import { RootEntity } from './root.entity';

@Entity('others')
export class OtherEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('bigint', {
    name: 'department_id',
    nullable: true,
    default: 0,
  })
  department_id: number;

  @Column('varchar', {
    name: 'username',
    nullable: false,
    length: 255,
  })
  username: string;

  @Column('varchar', {
    name: 'password',
    nullable: false,
    length: 45,
  })
  password: string;

  @Column('tinyint', {
    name: 'category',
    nullable: false,
    default: 0,
  })
  category: number; // 0: Khoa 1 Admin

  department: DepartmentEntity | null;
}
