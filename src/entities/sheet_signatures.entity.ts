import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';
import { SignatureEntity } from './signature.entity';
import { SheetEntity } from './sheet.entity';

@Entity('sheet_signatures')
export class SheetSignatures extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => SheetEntity, (sheet) => sheet.sheet_signature)
  @JoinColumn([
    {
      name: 'sheet_id',
      referencedColumnName: 'id',
    },
  ])
  sheet: SheetEntity;

  @ManyToOne(() => SignatureEntity, (signature) => signature.sheet_signature)
  @JoinColumn([
    {
      name: 'signature_id',
      referencedColumnName: 'id',
    },
  ])
  signature: SignatureEntity;
}
