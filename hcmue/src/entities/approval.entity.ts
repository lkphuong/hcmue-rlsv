import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';

@Entity('approvals')
export class ApprovalEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('tinyint', {
    name: 'sheet_id',
    nullable: false,
    default: 0,
  })
  sheet_id: number;

  @Column('varchar', {
    name: 'std_code',
    nullable: false,
    length: 255,
  })
  std_code: number;

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

  @Column('tinyint', {
    name: 'role_id',
    nullable: true,
    default: 0,
  })
  role_id: number;
}
