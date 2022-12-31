import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';

import { UserEntity } from './user.entity';

@Entity('statuses')
export class StatusEntity extends RootEntity {
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

  @Column('boolean', {
    name: 'flag',
    nullable: false,
    default: false,
  })
  flag: boolean;

  users: UserEntity[] | null;
}
