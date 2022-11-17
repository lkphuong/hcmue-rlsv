import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RootEntity } from './root.entity';
import { EvaluationEntity } from './evaluation.entity';

@Entity('forms')
export class FormEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => FormEntity, (parent) => parent.forms)
  @JoinColumn([
    {
      name: 'parent_id',
      referencedColumnName: 'id',
    },
  ])
  parent: FormEntity;

  @Column('varchar', {
    name: 'version',
    nullable: false,
    length: 50,
  })
  version: string;

  @Column('varchar', {
    name: 'original',
    nullable: true,
    default: null,
    length: 50,
  })
  original: string;

  @Column('tinyint', {
    name: 'control',
    nullable: true,
    default: null,
  })
  control: number;

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

  @Column('tinyint', {
    //0 single number, 1 range value
    name: 'category',
    default: null,
    nullable: true,
  })
  category: number;

  @Column('varchar', {
    name: 'unit',
    nullable: true,
    default: null,
  })
  unit: number;

  @Column('boolean', {
    name: 'required',
    nullable: true,
    default: true,
  })
  required?: boolean = false;

  @OneToMany(() => FormEntity, (form) => form.forms)
  forms: FormEntity[];

  @OneToMany(() => EvaluationEntity, (evalua_parnet) => evalua_parnet.parent) //from form.parent_id -> evaluation.parent_id
  evaluation_parent: EvaluationEntity[];

  @OneToMany(() => EvaluationEntity, (evalua_parnet) => evalua_parnet.parent) //from form.id -> evaluation.form_id
  evaluation_form: EvaluationEntity[];
}
