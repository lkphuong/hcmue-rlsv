import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';
import { SheetEntity } from './sheet.entity';

@Entity('semesters')
export class SemesterEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('varchar', {
    name: 'name',
    nullable: false,
    length: 50,
  })
  name: string;

  @OneToMany(() => SheetEntity, (sheet) => sheet.semester)
  sheets: SheetEntity[];
}
