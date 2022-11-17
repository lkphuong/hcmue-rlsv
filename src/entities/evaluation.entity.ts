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

  @ManyToOne(() => FormEntity, (parent) => parent.evaluation_parent)
  @JoinColumn([
    {
      name: 'parent_id',
      referencedColumnName: 'id',
    },
  ])
  parent: FormEntity;

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
  sheet: FormEntity;

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
