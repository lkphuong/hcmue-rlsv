import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RootEntity extends BaseEntity {
  @Column('bit', {
    name: 'active',
    nullable: false,
    default: 1,
  })
  active: boolean;

  @Column('bigint', {
    name: 'created_by',
    nullable: false,
    default: 0,
    select: true,
  })
  created_by: number;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    default: () => 'getdate()',
    select: true,
  })
  created_at: Date;

  @Column('bigint', {
    name: 'updated_by',
    nullable: false,
    default: 0,
    select: true,
  })
  updated_by?: number;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    default: () => 'getdate()',
    select: true,
  })
  updated_at?: Date;

  @Column('bigint', {
    name: 'deleted_by',
    nullable: false,
    default: 0,
    select: true,
  })
  deleted_by?: number;

  @UpdateDateColumn({
    name: 'deleted_at',
    nullable: true,
    default: () => 'getdate()',
    select: true,
  })
  deleted_at?: Date;

  @Column('bit', {
    name: 'deleted',
    nullable: true,
    default: 0,
    select: false,
  })
  delete_flag?: boolean = false;
}
