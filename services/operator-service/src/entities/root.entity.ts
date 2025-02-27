import { BaseEntity, Column, Entity } from 'typeorm';

@Entity()
export class RootEntity extends BaseEntity {
  @Column('boolean', {
    name: 'active',
    nullable: true,
    default: 1,
  })
  active?: boolean = true;

  @Column('varchar', {
    name: 'created_by',
    nullable: false,
    default: 'system',
    length: 24,
  })
  created_by: string;

  @Column({
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column('varchar', {
    name: 'updated_by',
    nullable: true,
    length: 24,
    onUpdate: 'system',
    select: false,
  })
  updated_by?: string;

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
    length: 24,
    select: false,
  })
  deleted_by?: string;

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
