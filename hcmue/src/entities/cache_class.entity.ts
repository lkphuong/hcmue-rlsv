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

  @ManyToOne(() => LevelEntity, (level) => level.sheets)
  @JoinColumn([
    {
      name: 'level_id',
      referencedColumnName: 'id',
    },
  ])
  level: LevelEntity;

  // Tổng số đánh giá theo xếp loại
  @Column('int', {
    name: 'amount',
    nullable: false,
    default: 0,
  })
  amount: number;
}
