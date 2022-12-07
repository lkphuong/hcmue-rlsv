import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EvaluationEntity } from './evaluation.entity';

import { RootEntity } from './root.entity';
import { SheetEntity } from './sheet.entity';

@Entity('files')
export class FileEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => SheetEntity, (sheet) => sheet.files)
  @JoinColumn([
    {
      name: 'sheet_id',
      referencedColumnName: 'id',
    },
  ])
  sheet: SheetEntity;

  @ManyToOne(() => EvaluationEntity, (evaluation) => evaluation.files)
  @JoinColumn([
    {
      name: 'evaluation_id',
      referencedColumnName: 'id',
    },
  ])
  evaluation: EvaluationEntity;

  @Column('varchar', {
    name: 'original_name',
    nullable: false,
    length: 500,
  })
  originalName: string;

  @Column('varchar', {
    name: 'file_name',
    nullable: false,
    length: 500,
  })
  fileName: string;

  @Column('varchar', {
    name: 'path',
    nullable: false,
    length: 500,
  })
  path: string;

  @Column('varchar', {
    name: 'url',
    nullable: false,
    length: 500,
  })
  url: string;

  @Column('varchar', {
    name: 'extension',
    nullable: false,
    length: 50,
  })
  extension: string;

  @Column('boolean', {
    name: 'drafted',
    nullable: true,
    default: 0,
  })
  drafted: boolean;
}
