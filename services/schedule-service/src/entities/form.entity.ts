import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AcademicYearEntity } from './academic_year.entity';
import { HeaderEntity } from './header.entity';
import { ItemEntity } from './item.entity';
import { OptionEntity } from './option.entity';
import { RootEntity } from './root.entity';
import { SemesterEntity } from './semester.entity';
import { SheetEntity } from './sheet.entity';
import { TitleEntity } from './title.entity';

@Entity('forms')
export class FormEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => AcademicYearEntity, (academic_year) => academic_year.forms)
  @JoinColumn([
    {
      name: 'academic_id',
      referencedColumnName: 'id',
    },
  ])
  academic_year: AcademicYearEntity;

  @ManyToOne(() => SemesterEntity, (semester) => semester.forms)
  @JoinColumn([
    {
      name: 'semester_id',
      referencedColumnName: 'id',
    },
  ])
  semester: SemesterEntity;

  @Column('datetime', {
    name: 'start',
    nullable: false,
  })
  start: Date;

  @Column('datetime', {
    name: 'end',
    nullable: false,
  })
  end: Date;

  // Trạng thái của biểu mẫu (0: drafted, 1: published, 2: in-progress, 3: done)
  // 0: Allow delete & update the form
  // 1: Allow ub-publish the form
  // 2 | 3: Disable delete & update the form
  @Column('tinyint', {
    name: 'status',
    nullable: true,
    default: 0,
  })
  status?: number = 0;

  @OneToMany(() => HeaderEntity, (header) => header.form)
  headers: HeaderEntity[];

  @OneToMany(() => HeaderEntity, (title) => title.form)
  titles: TitleEntity[];

  @OneToMany(() => HeaderEntity, (item) => item.form)
  items: ItemEntity[];

  @OneToMany(() => HeaderEntity, (option) => option.form)
  options: OptionEntity[];

  @OneToMany(() => SheetEntity, (sheet) => sheet.form)
  sheets: SheetEntity[];
}
