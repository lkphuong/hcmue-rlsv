import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RootEntity } from './root.entity';
import { SheetEntity } from './sheet.entity';

@Entity('approvals')
export class ApprovalEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => SheetEntity, (sheet) => sheet.approvals)
  @JoinColumn([
    {
      name: 'sheet_id',
      referencedColumnName: 'id',
    },
  ])
  sheet: SheetEntity;

  @Column('varchar', {
    name: 'user_id',
    nullable: true,
    length: 24,
  })
  user_id: string;

  @Column('tinyint', {
    name: 'approved_status',
    nullable: false,
    default: 0,
  })
  approved_status: number;

  @Column('datetime', {
    name: 'approved_at',
    nullable: true,
    default: null,
  })
  approved_at: Date;

  @Column('datetime', {
    name: 'start_at',
    nullable: true,
    default: null,
  })
  start_at: Date;

  @Column('datetime', {
    name: 'end_at',
    nullable: true,
    default: null,
  })
  end_at: Date;

  @Column('tinyint', {
    name: 'category',
    nullable: true,
    default: 0,
  })
  category: number;
}
