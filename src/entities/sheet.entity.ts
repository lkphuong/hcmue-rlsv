import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RootEntity } from './root.entity';
import { EvaluationEntity } from './evaluation.entity';
import { SheetSignatures } from './sheet_signatures.entity';
import { SemesterEntity } from './semester.entity';
import { AcademicYearEntity } from './academic_year.entity';
import { LevelEntity } from './level.entity';

@Entity('sheets')
export class SheetEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('varchar', {
    name: 'department_id',
    nullable: false,
    length: 24,
  })
  department_id: string;

  @Column('varchar', {
    name: 'user_id',
    nullable: false,
    length: 24,
  })
  user_id: string;

  @Column('varchar', {
    name: 'class_id',
    nullable: false,
    length: 24,
  })
  class_id: string;

  @ManyToOne(() => SemesterEntity, (semester) => semester.sheets)
  @JoinColumn([
    {
      name: 'semester_id',
      referencedColumnName: 'id',
    },
  ])
  semester: SemesterEntity;

  @ManyToOne(() => AcademicYearEntity, (academic_year) => academic_year.sheets)
  @JoinColumn([
    {
      name: 'academic_id',
      referencedColumnName: 'id',
    },
  ])
  academic_year: AcademicYearEntity;

  @Column('varchar', {
    name: 'k',
    nullable: false,
    length: 24,
  })
  k: string;

  @ManyToOne(() => LevelEntity, (level) => level.sheets)
  @JoinColumn([
    {
      name: 'level_id',
      referencedColumnName: 'id',
    },
  ])
  level: LevelEntity;

  @Column('tinyint', {
    name: 'level', //0. Chưa đánh giá, 1.Chờ lớp xét duyệt,2 Lớp quá hạn 3.Chờ khoa xét duyệt, 4. Khoa quá hạn, 5. Hoàn thành , default: 0
    nullable: false,
    default: 0,
  })
  status: number;

  @Column('float', {
    name: 'mark',
    nullable: true,
    default: null,
  })
  mark: number;

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.sheet)
  evaluations: EvaluationEntity[];

  @OneToMany(() => SheetSignatures, (sheet_signature) => sheet_signature.sheet)
  sheet_signature: SheetSignatures[];
}
