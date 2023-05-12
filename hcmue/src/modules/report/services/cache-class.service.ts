import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CacheClassEntity } from '../../../entities/cache_class.entity';

import { LogService } from '../../log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { AmountLevelCacheDepartment } from '../interfaces/report-response.interface';

@Injectable()
export class CacheClassService {
  constructor(
    @InjectRepository(CacheClassEntity)
    private readonly _cacheClassRepository: Repository<CacheClassEntity>,
    private readonly _dataSource: DataSource,
    private readonly _logger: LogService,
  ) {}

  async getCacheClasses(
    academic_id: number,
    department_id: number,
    semester_id: number,
    class_id?: number,
  ): Promise<CacheClassEntity[] | null> {
    try {
      let conditions = this._cacheClassRepository
        .createQueryBuilder('cache_class')
        .innerJoinAndSelect('cache_class.academic_year', 'academic_year')
        .innerJoinAndSelect('cache_class.semester', 'semester')
        .leftJoinAndSelect(
          'cache_class.level',
          'level',
          `level.id = cache_class.level_id AND 
          level.delete_flag = 0`,
        )
        .where('cache_class.semester_id = :semester_id', { semester_id })
        .andWhere('cache_class.academic_id = :academic_id', { academic_id })
        .andWhere('cache_class.department_id = :department_id', {
          department_id,
        })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('cache_class.deleted = :deleted', { deleted: false });

      if (class_id) {
        conditions = conditions.andWhere('cache_class.class_id = :class_id', {
          class_id,
        });
      }
      const cache_classes = await conditions.getMany();
      return cache_classes || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'CacheClassService.getCacheClasses()',
        e,
      );
      return null;
    }
  }

  async getCacheDepartmes(
    academic_id: number,
    semester_id: number,
    department_id?: number,
  ): Promise<CacheClassEntity[] | null> {
    try {
      let conditions = this._cacheClassRepository
        .createQueryBuilder('cache_class')
        .innerJoinAndSelect('cache_class.academic_year', 'academic_year')
        .innerJoinAndSelect('cache_class.semester', 'semester')
        .leftJoinAndSelect(
          'cache_class.level',
          'level',
          `level.id = cache_class.level_id AND 
        level.delete_flag = 0`,
        )
        .where('cache_class.semester_id = :semester_id', { semester_id })
        .andWhere('cache_class.academic_id = :academic_id', { academic_id })
        .andWhere('academic_year.deleted = :deleted', { deleted: false })
        .andWhere('semester.deleted = :deleted', { deleted: false })
        .andWhere('cache_class.deleted = :deleted', { deleted: false });

      if (department_id) {
        conditions = conditions.andWhere(
          'cache_class.department_id = :department_id',
          {
            department_id,
          },
        );
      }

      const cache_classes = await conditions.getMany();

      return cache_classes || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'CacheClassService.getCacheDepartmes()',
        e,
      );
      return null;
    }
  }

  async amountLevelCacheDepartment(
    academic_id: number,
    semester_id: number,
  ): Promise<AmountLevelCacheDepartment[]> {
    try {
      const manager = this._dataSource.manager;

      const result = (await manager.query(
        `
        SELECT SUM(amount) as amount, department_id, level_id
        FROM cache_classes
        WHERE semester_id = ${semester_id} and academic_id = ${academic_id}
        GROUP BY department_id, level_id 
        `,
      )) as AmountLevelCacheDepartment[];

      return result || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'CacheClassService.amountLevelCacheDepartment()',
        e,
      );
      return null;
    }
  }
}
