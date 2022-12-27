import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';
import { UserEntity } from './user.entity';

@Entity('classes')
export class ClassEntity extends RootEntity {
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
    name: 'k_id',
    nullable: false,
    default: 0,
  })
  k_id: number;

  @Column('bigint', {
    name: 'department_id',
    nullable: false,
    default: 0,
  })
  department_id: number;

  users: UserEntity[] | null;
}
