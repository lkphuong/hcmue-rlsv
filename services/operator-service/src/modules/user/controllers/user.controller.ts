import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { handleLog } from '../../../utils';
import { generateImportUsers } from '../funcs';

import { ImportUserPayload } from '../interfaces/payloads/import-user.interface';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { LogService } from '../../log/services/log.service';

import { UserService } from '../services/user.service';
import { FilesService } from 'src/modules/file/services/files.service';
import { ClassService } from 'src/modules/class/services/class.service';

import { Configuration } from '../../shared/constants/configuration.enum';

import { ErrorMessage } from '../constants/enums/errors.enum';
import { HandlerException } from '../../../exceptions/HandlerException';

import { Levels } from '../../../constants/enums/level.enum';
import { Message } from '../constants/enums/messages.enum';
import { Pattern } from '../../../constants/enums/pattern.enum';

import { DATABASE_EXIT_CODE } from '../../../constants/enums/error-code.enum';

@Controller('user')
export class UserController {
  constructor(
    private readonly _configurationService: ConfigurationService,
    private readonly _classService: ClassService,
    private readonly _fileService: FilesService,
    private _logger: LogService,
  ) {}

  @MessagePattern(Message.GENERATE_IMPORT_USERS)
  async importUsers(
    @Payload() data: ImportUserPayload,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const original_message = context.getMessage();

    //#region Handle log
    this._logger.writeLog(
      Levels.LOG,
      Pattern.MESSAGE_PATTERN,
      Message.GENERATE_IMPORT_USERS,
      JSON.stringify({ data }),
    );
    //#endregion

    console.log('----------------------------------------------------------');
    console.log(
      `${Pattern.MESSAGE_PATTERN}: /${Message.GENERATE_IMPORT_USERS}`,
    );
  }
}
