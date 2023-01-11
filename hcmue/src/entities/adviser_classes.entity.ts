import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClassEntity } from './class.entity';
import { RootEntity } from './root.entity';

@Entity('adviser_classes')
export class AdviserClassesEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('bigint', {
    name: 'adviser_id',
    nullable: false,
    default: 0,
  })
  adviser_id: number;

  @Column('bigint', {
    name: 'class_id',
    nullable: false,
    default: 0,
  })
  class_id: number;

  @Column('bigint', {
    name: 'academic_id',
    nullable: false,
    default: 0,
  })
  academic_id: number;

  class: ClassEntity | null;
}
