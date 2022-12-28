import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RootEntity } from './root.entity';
import { SheetEntity } from './sheet.entity';
import { SignatureEntity } from './signature.entity';

@Entity('sheet_signatures')
export class SheetSignatures extends RootEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  // @ManyToOne(() => SheetEntity, (sheet) => sheet.signatures)
  // @JoinColumn([
  //   {
  //     name: 'sheet_id',
  //     referencedColumnName: 'id',
  //   },
  // ])
  // sheet: SheetEntity;

  @ManyToOne(() => SignatureEntity, (signature) => signature.sheets)
  @JoinColumn([
    {
      name: 'signature_id',
      referencedColumnName: 'id',
    },
  ])
  signature: SignatureEntity;
}
