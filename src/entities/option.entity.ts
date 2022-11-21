import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RootEntity } from './root.entity';
import { ItemEntity } from './item.entity';
import { EvaluationEntity } from './evaluation.entity';

@Entity('options')
export class OptionEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => ItemEntity, (item) => item.options)
  @JoinColumn([
    {
      name: 'item_id',
      referencedColumnName: 'id',
    },
  ])
  item: ItemEntity;

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

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.option)
  evaluations: EvaluationEntity[];
}
