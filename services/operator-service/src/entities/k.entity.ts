import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RootEntity } from './root.entity';

import { ClassEntity } from './class.entity';

@Entity('k')
export class KEntity extends RootEntity {
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
}
