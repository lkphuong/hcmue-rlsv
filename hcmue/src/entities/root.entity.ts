import { BaseEntity, Column, Entity } from 'typeorm';

@Entity()
export class RootEntity extends BaseEntity {
  @Column('boolean', {
    name: 'active',
    nullable: true,
    default: 1,
  })
  active?: boolean = true;

  @Column('bigint', {
    name: 'created_by',
    nullable: false,
  })
  created_by: number;

  @Column({
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column('bigint', {
    name: 'updated_by',
    nullable: true,
    select: false,
  })
  updated_by?: number;

  @Column({
    name: 'updated_at',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updated_at?: Date;

  @Column('varchar', {
    name: 'deleted_by',
    nullable: true,
    select: false,
  })
  deleted_by?: number;

  @Column({
    name: 'deleted_at',
    nullable: true,
    select: false,
  })
  deleted_at?: Date;

  @Column('boolean', {
    name: 'delete_flag',
    nullable: true,
    default: 0,
    select: false,
  })
  deleted?: boolean = false;
}
