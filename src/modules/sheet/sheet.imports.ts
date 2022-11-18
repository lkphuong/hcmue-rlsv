import { TypeOrmModule } from '@nestjs/typeorm';

import { SheetEntity } from '../../entities/sheet.entity';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';

import { SheetController } from './controllers/sheet.controller';

import { SheetService } from './services/sheet.service';

export const modules = [
  SharedModule,
  TypeOrmModule.forFeature([SheetEntity]),
  LogModule,
  UserModule,
];

export const controllers = [SheetController];

export const providers = [SheetService];

export const exporteds = [SheetService];
