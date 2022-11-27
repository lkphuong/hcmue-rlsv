import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EvaluationEntity } from './evaluation.entity';
import { FormEntity } from './form.entity';
import { RootEntity } from './root.entity';

@Entity('items')
export class ItemEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => FormEntity, (form) => form.items)
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

  // 0. input, 1. checkbox, 2.single select, 3: multiple select
  @Column('tinyint', {
    name: 'control',
    nullable: true,
    default: 0,
  })
  control: number;

  @Column('boolean', {
    name: 'multiple',
    nullable: true,
    default: true,
  })
  multiple?: boolean = false;

  @Column('text', {
    name: 'content',
    nullable: false,
  })
  content: string;

  @Column('float', {
    name: 'from_mark',
    nullable: true,
    default: null,
  })
  from_mark: number;

  @Column('float', {
    name: 'to_mark',
    nullable: true,
    default: null,
  })
  to_mark: number;

  // 0. single value, 1. range value, 2: per unit
  @Column('tinyint', {
    name: 'category',
    default: null,
    nullable: true,
  })
  category: number;

  @Column('varchar', {
    name: 'unit',
    nullable: true,
    length: 50,
  })
  unit: string;

  @Column('boolean', {
    name: 'required',
    nullable: true,
    default: true,
  })
  required?: boolean = false;

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.item)
  evaluations: EvaluationEntity[];
}
