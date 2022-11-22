import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RootEntity } from './root.entity';
import { TitleEntity } from './title.entity';
import { OptionEntity } from './option.entity';
import { EvaluationEntity } from './evaluation.entity';

@Entity('items')
export class ItemEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => TitleEntity, (title) => title.items)
  @JoinColumn([
    {
      name: 'title_id',
      referencedColumnName: 'id',
    },
  ])
  title: TitleEntity;

  @Column('tinyint', {
    name: 'control',
    nullable: true,
    default: null,
  })
  control: number;

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
  unit: string;

  @Column('boolean', {
    name: 'multiple',
    nullable: true,
    default: true,
  })
  multiple?: boolean = false;

  @Column('boolean', {
    name: 'required',
    nullable: true,
    default: true,
  })
  required?: boolean = false;

  @OneToMany(() => OptionEntity, (option) => option.item)
  options: OptionEntity[];

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.item)
  evaluations: EvaluationEntity[];
}
