import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => SheetEntity, (sheet) => sheet)
  @JoinColumn([
    {
      name: 'sheet_id',
      referencedColumnName: 'id',
    },
  ])
  sheet: SheetEntity;

  @Column('varchar', {
    name: 'role_id',
    nullable: false,
    length: 24,
  })
  role_id: string;

  @Column('varchar', {
    name: 'user_id',
    nullable: false,
    length: 24,
  })
  user_id: string;

  @Column('tinyint', {
    name: 'approved_status',
    nullable: true,
    default: null,
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
    nullable: false,
  })
  start_at: Date;

  @Column('datetime', {
    name: 'end_at',
    nullable: false,
  })
  end_at: Date;
}
