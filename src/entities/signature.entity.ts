import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';
import { SheetSignatures } from './sheet_signatures.entity';

@Entity('signatures')
export class SignatureEntity extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('varchar', {
    name: 'name',
    nullable: false,
    length: 255,
  })
  name: string;

  @OneToMany(
    () => SheetSignatures,
    (sheet_signature) => sheet_signature.signature,
  )
  sheet_signature: SheetSignatures[];
}
