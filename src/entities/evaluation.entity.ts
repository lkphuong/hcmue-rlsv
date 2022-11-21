import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EvaluationItemEntity } from './evaluation_items.entity';

import { RootEntity } from './root.entity';
import { SheetEntity } from './sheet.entity';

@Entity('evaluations')
export class EvaluationEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

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

  @OneToMany(
    () => EvaluationItemEntity,
    (evaluation_entity) => evaluation_entity.evaluation,
  )
  evaluation_items: EvaluationItemEntity[];
}
