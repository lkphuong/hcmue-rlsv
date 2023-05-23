import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ItemEntity } from './item.entity';
import { OptionEntity } from './option.entity';
import { RootEntity } from './root.entity';
import { SheetHistoryEntity } from './sheet_history.entity';

@Entity('evaluation_history')
export class EvaluationHistoryEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(
    () => SheetHistoryEntity,
    (sheet_history) => sheet_history.evaluation_history,
  )
  @JoinColumn([
    {
      name: 'sheet_history_id',
      referencedColumnName: 'id',
    },
  ])
  sheet_history: SheetHistoryEntity;

  @ManyToOne(() => ItemEntity, (item) => item.evaluations)
  @JoinColumn([
    {
      name: 'item_id',
      referencedColumnName: 'id',
    },
  ])
  item: ItemEntity;

  @ManyToOne(() => OptionEntity, (option) => option.evaluations)
  @JoinColumn([
    {
      name: 'option_id',
      referencedColumnName: 'id',
    },
  ])
  option: OptionEntity;

  @Column('bigint', {
    name: 'item_id',
    nullable: true,
  })
  item_id: number;

  @Column('varchar', {
    name: 'ref',
    nullable: false,
    length: 50,
  })
  ref: string;

  @Column('tinyint', {
    name: 'category',
    nullable: true,
    default: 1,
  })
  category: number;

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
    name: 'adviser_mark_level',
    nullable: true,
    default: null,
  })
  adviser_mark_level: number;

  @Column('float', {
    name: 'department_mark_level',
    nullable: true,
    default: null,
  })
  department_mark_level: number;
}
