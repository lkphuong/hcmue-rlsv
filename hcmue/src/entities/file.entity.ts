import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemEntity } from './item.entity';

import { RootEntity } from './root.entity';
import { SheetEntity } from './sheet.entity';

@Entity('files')
export class FileEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => ItemEntity, (item) => item.files)
  @JoinColumn([
    {
      name: 'item_id',
      referencedColumnName: 'id',
    },
  ])
  item: ItemEntity;

  @ManyToOne(() => SheetEntity, (sheet) => sheet.files)
  @JoinColumn([
    {
      name: 'sheet_id',
      referencedColumnName: 'id',
    },
  ])
  sheet: SheetEntity;

  @Column('bigint', {
    name: 'sheet_id',
    nullable: false,
  })
  sheet_id: number;

  @Column('varchar', {
    name: 'parent_ref',
    nullable: false,
    length: 50,
  })
  parent_ref: string;

  @Column('varchar', {
    name: 'original_name',
    nullable: false,
    length: 500,
  })
  originalName: string;

  @Column('varchar', {
    name: 'file_name',
    nullable: false,
    length: 500,
  })
  fileName: string;

  @Column('varchar', {
    name: 'path',
    nullable: false,
    length: 500,
  })
  path: string;

  @Column('varchar', {
    name: 'url',
    nullable: false,
    length: 500,
  })
  url: string;

  @Column('varchar', {
    name: 'extension',
    nullable: false,
    length: 50,
  })
  extension: string;

  @Column('boolean', {
    name: 'drafted',
    nullable: true,
    default: true,
  })
  drafted?: boolean = true;
}
