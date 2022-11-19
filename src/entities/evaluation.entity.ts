import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RootEntity } from './root.entity';
import { FormEntity } from './form.entity';
import { SheetEntity } from './sheet.entity';

@Entity('evaluations')
export class EvaluationEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('varchar', {
    name: 'ref',
    nullable: false,
    unique: true,
    length: 50,
  })
  ref: string;

  @Column('varchar', {
    name: 'parent_id',
    nullable: true,
    default: null,
    length: 50,
  })
  parent_id: string;

  @ManyToOne(() => FormEntity, (parent) => parent.evaluation_form)
  @JoinColumn([
    {
      name: 'form_id',
      referencedColumnName: 'id',
    },
  ])
  form: FormEntity;

  @ManyToOne(() => SheetEntity, (sheet) => sheet.evaluations)
  @JoinColumn([
    {
      name: 'sheet_id',
      referencedColumnName: 'id',
    },
  ])
  sheet: SheetEntity;

  @Column('float', {
    name: 'personal_mark_level',
    nullable: true,
    default: null,
  })
  personal_mark_level: number;

  @Column('float', {
    name: 'class_mark_level',
    nullable: true,
    default: null,
  })
  class_mark_level: number;

  @Column('float', {
    name: 'department_mark_level',
    nullable: true,
    default: null,
  })
  department_mark_level: number;
}
