import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// import { AcademicYearClassesEntity } from './academic_year_classes.entity';
import { FormEntity } from './form.entity';
import { RootEntity } from './root.entity';
import { SheetEntity } from './sheet.entity';
import { UserEntity } from './user.entity';

@Entity('academic_years')
export class AcademicYearEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('int', {
    name: 'start',
    nullable: false,
    default: 0,
  })
  start: number;

  @Column('int', {
    name: 'end',
    nullable: false,
    default: 0,
  })
  end: number;

  @OneToMany(() => SheetEntity, (sheet) => sheet.academic_year)
  sheets: SheetEntity[];

  @OneToMany(() => FormEntity, (form) => form.academic_year)
  forms: FormEntity[];

  users: UserEntity[] | null;
}
