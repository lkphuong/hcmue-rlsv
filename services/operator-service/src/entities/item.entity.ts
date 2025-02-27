import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EvaluationEntity } from './evaluation.entity';
import { FileEntity } from './file.entity';
import { FormEntity } from './form.entity';
import { OptionEntity } from './option.entity';
import { RootEntity } from './root.entity';
import { TitleEntity } from './title.entity';

@Entity('items')
export class ItemEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => FormEntity, (form) => form.items)
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

  @Column('varchar', {
    name: 'ref',
    nullable: false,
    length: 50,
  })
  ref: string;

  // 0. input, 1. checkbox, 2.single select, 3: multiple select
  @Column('tinyint', {
    name: 'control',
    nullable: true,
    default: 0,
  })
  control: number;

  @Column('boolean', {
    name: 'multiple',
    nullable: true,
    default: true,
  })
  multiple?: boolean = false;

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

  // Điểm cho item when control = input | checkbox &&
  // category = single-value | per unit
  @Column('float', {
    name: 'mark',
    nullable: true,
    default: 0,
  })
  mark: number;

  // 0. single value, 1. range value, 2: per unit
  @Column('tinyint', {
    name: 'category',
    default: null,
    nullable: true,
  })
  category: number;

  // 1.Xuất sắc, 2. Tốt, 3. Khá, 4.Trung bình, 5.Yếu, 6.Kém
  @Column('tinyint', {
    name: 'sort_order',
    default: 1,
    nullable: true,
  })
  sort_order: number;

  @Column('boolean', {
    name: 'is_file', //true: có file, false: không file
    default: false,
    nullable: true,
  })
  is_file?: boolean = false;

  @Column('varchar', {
    name: 'unit',
    nullable: true,
    length: 50,
  })
  unit: string;

  @Column('boolean', {
    name: 'required',
    nullable: true,
    default: true,
  })
  required?: boolean = false;

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.item)
  evaluations: EvaluationEntity[];

  @OneToMany(() => FileEntity, (file) => file.item)
  files: FileEntity[];

  options: OptionEntity[] | null;

  title: TitleEntity | null;
}
