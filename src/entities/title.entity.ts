import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { HeaderEntity } from './header.entity';
import { RootEntity } from './root.entity';
import { ItemEntity } from './item.entity';

@Entity('titles')
export class TitleEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('text', {
    name: 'name',
    nullable: false,
  })
  name: string;

  @ManyToOne(() => HeaderEntity, (header) => header.titles)
  @JoinColumn([
    {
      name: 'header_id',
      referencedColumnName: 'id',
    },
  ])
  header: HeaderEntity;

  @OneToMany(() => ItemEntity, (item) => item.title)
  items: ItemEntity[];
}
