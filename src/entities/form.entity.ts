import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RootEntity } from './root.entity';
import { SemesterEntity } from './semester.entity';
import { AcademicYearEntity } from './academic_year.entity';
import { HeaderEntity } from './header.entity';

@Entity('forms')
export class FormEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => AcademicYearEntity, (academic_year) => academic_year)
  @JoinColumn([
    {
      name: 'academic_id',
      referencedColumnName: 'id',
    },
  ])
  academic_year: AcademicYearEntity;

  @ManyToOne(() => SemesterEntity, (semester) => semester)
  @JoinColumn([
    {
      name: 'semester_id',
      referencedColumnName: 'id',
    },
  ])
  semester: SemesterEntity;

  @Column('datetime', {
    name: 'student_start',
    nullable: false,
  })
  student_start: Date;

  @Column('datetime', {
    name: 'student_end',
    nullable: false,
  })
  student_end: Date;

  @Column('datetime', {
    name: 'class_start',
    nullable: false,
  })
  class_start: Date;

  @Column('datetime', {
    name: 'class_end',
    nullable: false,
  })
  class_end: Date;

  @Column('datetime', {
    name: 'department_start',
    nullable: false,
  })
  department_start: Date;

  @Column('datetime', {
    name: 'department_end',
    nullable: false,
  })
  department_end: Date;

  @OneToMany(() => HeaderEntity, (header) => header.form)
  headers: HeaderEntity[];
}
