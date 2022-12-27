import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { backgroundFactory } from '../../factories/background.factory';

import { SheetEntity } from '../../entities/sheet.entity';

import { SheetService } from './services/sheet.service';

// import { SheetController } from './controllers/sheet.controller';

import { LogModule } from '../log/log.module';
import { SharedModule } from '../shared/shared.module';

import { ApprovalModule } from '../approval/approval.module';

import { BACKGROUND_JOB_MODULE } from '../../constants';

export const modules = [
  SharedModule,
  ClientsModule.register([
    {
      name: BACKGROUND_JOB_MODULE,
      transport: Transport.RMQ,
      options: backgroundFactory,
    },
  ]),
  TypeOrmModule.forFeature([SheetEntity]),
  ApprovalModule,
  HttpModule,
  LogModule,
];

// export const controllers = [SheetController];
export const providers = [SheetService];
export const exporteds = [SheetService];
