import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';
import { ItemEntity } from './item.entity';
import { OptionEntity } from './option.entity';
import { EvaluationEntity } from './evaluation.entity';

@Entity('evaluation_items')
export class EvaluationItemEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => ItemEntity, (item) => item.evaluation_items)
  @JoinColumn([
    {
      name: 'item_id',
      referencedColumnName: 'id',
    },
  ])
  item: ItemEntity;

  @ManyToOne(() => OptionEntity, (option) => option.evaluation_items)
  @JoinColumn([
    {
      name: 'option_id',
      referencedColumnName: 'id',
    },
  ])
  option: OptionEntity;

  @ManyToOne(
    () => EvaluationEntity,
    (evaluation) => evaluation.evaluation_items,
  )
  @JoinColumn([
    {
      name: 'evaluation_id',
      referencedColumnName: 'id',
    },
  ])
  evaluation: EvaluationEntity;
}
