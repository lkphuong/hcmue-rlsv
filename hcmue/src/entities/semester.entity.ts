import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column('varchar', {
    name: 'name',
    nullable: false,
    length: 50,
  })
  name: string;

  @OneToMany(() => SheetEntity, (sheet) => sheet.semester)
  sheets: SheetEntity[];

  @OneToMany(() => FormEntity, (form) => form.semester)
  forms: FormEntity[];

  users: UserEntity[] | null;
}
