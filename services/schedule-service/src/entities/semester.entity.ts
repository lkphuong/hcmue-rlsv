import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AcademicYearEntity } from './academic_year.entity';
import { FormEntity } from './form.entity';

import { RootEntity } from './root.entity';
import { SheetEntity } from './sheet.entity';
import { UserEntity } from './user.entity';

@Entity('semesters')
export class SemesterEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('bigint', {
    name: 'academic_id',
    nullable: false,
    default: 0,
  })
  academic_id: number;

  @Column('varchar', {
    name: 'name',
    nullable: false,
    length: 50,
  })
  name: string;

  @Column('date', {
    name: 'start',
    nullable: false,
  })
  start: Date;

  @Column('date', {
    name: 'end',
    nullable: false,
  })
  end: Date;

  @OneToMany(() => SheetEntity, (sheet) => sheet.semester)
  sheets: SheetEntity[];

  @OneToMany(() => FormEntity, (form) => form.semester)
  forms: FormEntity[];

  academic: AcademicYearEntity;

  users: UserEntity[] | null;
}
