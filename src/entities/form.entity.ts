import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';
import { EvaluationEntity } from './evaluation.entity';

@Entity('forms')
export class FormEntity extends RootEntity {
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

  @OneToMany(() => EvaluationEntity, (evalua_parnet) => evalua_parnet.form) //from form.id -> evaluation.form_id
  evaluation_form: EvaluationEntity[];
}
