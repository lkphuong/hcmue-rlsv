import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';
import { SheetEntity } from './sheet.entity';

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
    default: 0,
  })
  from_mark: number;

  @Column('int', {
    name: 'to_mark',
    nullable: true,
    default: 0,
  })
  to_mark: number;

  @OneToMany(() => SheetEntity, (sheet) => sheet.level)
  sheets: SheetEntity[];
}
