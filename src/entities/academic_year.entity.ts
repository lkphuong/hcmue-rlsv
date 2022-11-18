import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';
import { SheetEntity } from './sheet.entity';
import { AcademicYearClassesEntity } from './academic_year_classes.entity';
@Entity('academic_years')
export class AcademicYearEntity extends RootEntity {
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

  @OneToMany(() => SheetEntity, (sheet) => sheet.academic_year)
  sheets: SheetEntity[];

  @OneToMany(
    () => AcademicYearClassesEntity,
    (academic_year_class) => academic_year_class.academic_year,
  )
  academic_year_classes: AcademicYearClassesEntity[];
}
