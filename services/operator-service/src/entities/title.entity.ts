import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FormEntity } from './form.entity';
import { RootEntity } from './root.entity';

@Entity('titles')
export class TitleEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => FormEntity, (form) => form.titles)
  @JoinColumn([
    {
      name: 'form_id',
      referencedColumnName: 'id',
    },
  ])
  form: FormEntity;

  @Column('varchar', {
    name: 'parent_ref',
    nullable: false,
    length: 50,
  })
  parent_ref: string;

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
}
