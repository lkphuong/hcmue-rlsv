import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';
import { SignatureEntity } from './signature.entity';

@Entity('sheet_signatures')
export class SheetSignatures extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => SignatureEntity, (signature) => signature.sheets)
  @JoinColumn([
    {
      name: 'signature_id',
      referencedColumnName: 'id',
    },
  ])
  signature: SignatureEntity;
}
