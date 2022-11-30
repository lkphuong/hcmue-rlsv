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

@Entity('options')
export class OptionEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => FormEntity, (form) => form.options)
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

  @Column('text', {
    name: 'content',
    nullable: false,
  })
  content: string;

  @Column('float', {
    name: 'mark',
    nullable: false,
    default: 0,
  })
  mark: number;

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.option)
  evaluations: EvaluationEntity[];
}
