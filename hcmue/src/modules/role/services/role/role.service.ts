import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from '../../../../entities/role.entity';

import { LogService } from '../../../log/services/log.service';
import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly _roleRepository: Repository<RoleEntity>,
    private _logger: LogService,
  ) {}

  async getRoleByCode(code: number): Promise<RoleEntity | null> {
    try {
      const conditions = this._roleRepository
        .createQueryBuilder('role')
        .where('role.code = :code', { code })
        .andWhere('role.deleted = :deleted', { deleted: false });

      const role = await conditions.getOne();
      return role || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'RoleService.getRoleByCode()',
        e,
      );
      return null;
    }
  }
}
