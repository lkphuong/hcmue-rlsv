import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FormEntity } from './form.entity';
import { RootEntity } from './root.entity';

@Entity('headers')
export class HeaderEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => FormEntity, (form) => form.headers)
  @JoinColumn([
    {
      name: 'form_id',
      referencedColumnName: 'id',
    },
  ])
  form: FormEntity;

  @Column('varchar', {
    name: 'ref',
    nullable: false,
    length: 50,
  })
  ref: string;

  @Column('varchar', {
    name: 'name',
    nullable: false,
    length: 500,
  })
  name: string;

  @Column('float', {
    name: 'max_mark',
    nullable: false,
    default: 0,
  })
  max_mark: number;
}
