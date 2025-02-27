import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';

import { UserEntity } from './user.entity';

@Entity('status')
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

  users: UserEntity[] | null;
}
