import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FormEntity } from './form.entity';
import { TitleEntity } from './title.entity';
import { RootEntity } from './root.entity';

@Entity('headers')
export class HeaderEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => FormEntity, (form) => form.headers)
  @JoinColumn([
    {
      name: 'form_id',
      referencedColumnName: 'id',
    },
  ])
  form: FormEntity;

  @Column('text', {
    name: 'name',
    nullable: false,
  })
  name: string;

  @OneToMany(() => TitleEntity, (title) => title.header)
  titles: TitleEntity[];
}
