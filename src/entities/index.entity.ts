import { AcademicYearEntity } from './academic_year.entity';
import { EvaluationEntity } from './evaluation.entity';
import { FormEntity } from './form.entity';
import { LevelEntity } from './level.entity';
import { RoleEntity } from './role.entity';
import { RoleUserEntity } from './role_users.entity';
import { SemesterEntity } from './semester.entity';
import { SessionEntity } from './session.entity';
import { SheetEntity } from './sheet.entity';
import { SheetSignatures } from './sheet_signatures.entity';
import { SignatureEntity } from './signature.entity';
import { AcademicYearClassesEntity } from './academic_year_classes.entity';
import { HeaderEntity } from './header.entity';
import { ItemEntity } from './item.entity';
import { OptionEntity } from './option.entity';
import { TitleEntity } from './title.entity';

const entities = [
  AcademicYearEntity,
  AcademicYearClassesEntity,
  EvaluationEntity,
  FormEntity,
  RoleEntity,
  RoleUserEntity,
  SemesterEntity,
  SessionEntity,
  SheetEntity,
  SheetSignatures,
  SignatureEntity,
  LevelEntity,
  HeaderEntity,
  ItemEntity,
  OptionEntity,
  TitleEntity,
];

export default entities;
