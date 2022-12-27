import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AcademicYearEntity } from './academic_year.entity';
import { LevelEntity } from './level.entity';
import { RootEntity } from './root.entity';
import { SemesterEntity } from './semester.entity';

@Entity('cache_classes')
export class CacheClassEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('bigint', {
    name: 'department_id',
    nullable: false,
    default: 0,
  })
  department_id: string;

  @Column('bigint', {
    name: 'class_id',
    nullable: false,
    default: 0,
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

  @ManyToOne(() => LevelEntity, (level) => level.sheets)
  @JoinColumn([
    {
      name: 'level_id',
      referencedColumnName: 'id',
    },
  ])
  level: LevelEntity | null;

  // Tổng số đánh giá theo xếp loại
  @Column('int', {
    name: 'amount',
    nullable: false,
    default: 0,
  })
  amount: number;
}
