import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file_logs')
export class FileLogEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('varchar', {
    name: 'username',
    nullable: false,
    length: 50,
  })
  username: string;

  @Column('varchar', {
    name: 'message',
    nullable: false,
  })
  message: string;

  @Column('tinyint', {
    name: 'status',
    nullable: false,
  })
  status: number;

  @Column('boolean', {
    name: 'active',
    nullable: true,
    default: 1,
  })
  active?: boolean = true;

  @Column('varchar', {
    name: 'created_by',
    nullable: false,
    length: 20,
    default: 'system',
  })
  created_by: string;

  @Column({
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
