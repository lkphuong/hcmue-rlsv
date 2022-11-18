import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { SheetEntity } from './sheet.entity';

import { RootEntity } from './root.entity';

@Entity('levels')
export class LevelEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('varchar', {
    name: 'name',
    nullable: false,
    length: 255,
  })
  name: string;

  @Column('int', {
    name: 'from_mark',
    nullable: true,
    default: null,
  })
  from_mark: number;

  @Column('int', {
    name: 'to_mark',
    nullable: true,
    default: null,
  })
  to_mark: number;

  @OneToMany(() => SheetEntity, (sheet) => sheet.level)
  sheets: SheetEntity[];
}
