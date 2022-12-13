import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AcademicYearEntity } from './academic_year.entity';
import { ApprovalEntity } from './approval.entity';
import { EvaluationEntity } from './evaluation.entity';
import { FileEntity } from './file.entity';
import { FormEntity } from './form.entity';
import { SemesterEntity } from './semester.entity';
import { SheetSignatures } from './sheet_signatures.entity';
import { LevelEntity } from './level.entity';
import { RootEntity } from './root.entity';

@Entity('sheets')
export class SheetEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => FormEntity, (form) => form.sheets)
  @JoinColumn([
    {
      name: 'form_id',
      referencedColumnName: 'id',
    },
  ])
  form: FormEntity;

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

  // 0. Chưa đánh giá, 1.Chờ lớp xét duyệt,2 Lớp quá hạn 3.Chờ khoa xét duyệt,
  // 4. Khoa quá hạn, 5. Hoàn thành , default: 0
  @Column('tinyint', {
    name: 'status',
    nullable: false,
    default: 0,
  })
  status: number;

  // 0. Không xếp loại | 1, Xếp loại
  @Column('tinyint', {
    name: 'graded',
    nullable: false,
    default: 0,
  })
  graded: number;

  @Column('int', {
    name: 'sum_of_personal_marks',
    nullable: true,
    default: 0,
  })
  sum_of_personal_marks: number;

  @Column('int', {
    name: 'sum_of_class_marks',
    nullable: true,
    default: 0,
  })
  sum_of_class_marks: number;

  @Column('int', {
    name: 'sum_of_department_marks',
    nullable: true,
    default: 0,
  })
  sum_of_department_marks: number;

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.sheet)
  evaluations: EvaluationEntity[];

  @OneToMany(() => SheetSignatures, (signature) => signature.sheet)
  signatures: SheetSignatures[];

  @OneToMany(() => ApprovalEntity, (approval) => approval.sheet)
  approvals: ApprovalEntity[];

  @OneToMany(() => FileEntity, (file) => file.sheet)
  files: FileEntity[];
}
