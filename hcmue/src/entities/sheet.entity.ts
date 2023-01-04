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
import { ClassEntity } from './class.entity';
import { DepartmentEntity } from './department.entity';
import { EvaluationEntity } from './evaluation.entity';
import { FileEntity } from './file.entity';
import { FormEntity } from './form.entity';
import { KEntity } from './k.entity';
import { LevelEntity } from './level.entity';
import { RootEntity } from './root.entity';
import { SemesterEntity } from './semester.entity';
import { UserEntity } from './user.entity';

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

  @Column('bigint', {
    name: 'department_id',
    nullable: false,
    default: 0,
  })
  department_id: number;

  @Column('varchar', {
    name: 'std_code',
    nullable: false,
    length: 20,
  })
  std_code: string;

  @Column('bigint', {
    name: 'class_id',
    nullable: false,
    default: 0,
  })
  class_id: number;

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

  @Column('bigint', {
    name: 'k',
    nullable: false,
    default: 0,
  })
  k: number;

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

  @Column('float', {
    name: 'sum_of_personal_marks',
    nullable: true,
    default: 0,
  })
  sum_of_personal_marks: number;

  @Column('float', {
    name: 'sum_of_class_marks',
    nullable: true,
    default: 0,
  })
  sum_of_class_marks: number;

  @Column('float', {
    name: 'sum_of_adviser_marks',
    nullable: true,
    default: 0,
  })
  sum_of_adviser_marks: number;

  @Column('float', {
    name: 'sum_of_department_marks',
    nullable: true,
    default: 0,
  })
  sum_of_department_marks: number;

  user: UserEntity | null;

  class: ClassEntity | null;

  department: DepartmentEntity | null;

  K: KEntity | null;

  @OneToMany(() => EvaluationEntity, (evaluation) => evaluation.sheet)
  evaluations: EvaluationEntity[];

  @OneToMany(() => FileEntity, (file) => file.sheet)
  files: FileEntity[];
}
