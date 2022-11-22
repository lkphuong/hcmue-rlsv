import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Levels } from 'src/constants/enums/level.enum';
import { Methods } from 'src/constants/enums/method.enum';
import { FormEntity } from 'src/entities/form.entity';
import { LogService } from 'src/modules/log/services/log.service';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class FormmService {
  constructor(
    @InjectRepository(FormEntity)
    private readonly _formRepository: Repository<FormEntity>,
    private readonly _dataSourece: DataSource,
    private readonly _logger: LogService,
  ) {}

  async getFormById(id: number): Promise<FormEntity | null> {
    try {
      const conditions = this._formRepository
        .createQueryBuilder('form')
        .where('form.id = :id', { id })
        .andWhere('form.deleted = :deleted', { deleted: false });

      const form = await conditions.getOne();

      return form || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FormmService.getFormById()',
        e,
      );
      return null;
    }
  }

  async update(id: number, manager?: EntityManager): Promise<boolean> {
    try {
      if (!manager) {
        manager = this._dataSourece.manager;
      }
      const result = await manager.update(
        FormEntity,
        { id: id },
        { active: false },
      );

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'FormService.update()',
        e,
      );
      return null;
    }
  }
}
