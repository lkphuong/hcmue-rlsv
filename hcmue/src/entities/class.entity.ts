import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { KEntity } from './k.entity';
import { RootEntity } from './root.entity';
import { UserEntity } from './user.entity';

@Entity('classes')
export class ClassEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('bigint', {
    name: 'k',
    nullable: false,
    default: 0,
  })
  k: number;

  @Column('bigint', {
    name: 'department_id',
    nullable: false,
    default: 0,
  })
  department_id: number;

  @Column('varchar', {
    name: 'code',
    nullable: false,
    length: 45,
  })
  code: string;

  @Column('varchar', {
    name: 'name',
    nullable: false,
    length: 255,
  })
  name: string;

  users: UserEntity[] | null;

  K: KEntity | null;
}
