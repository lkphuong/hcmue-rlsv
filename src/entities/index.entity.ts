import { AcademicYearEntity } from './academic_year.entity';
import { ApprovalEntity } from './approval.entity';
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
import { EvaluationItemEntity } from './evaluation_items.entity';
import { HeaderEntity } from './header.entity';
import { ItemEntity } from './item.entity';
import { OptionEntity } from './option.entity';
import { TitleEntity } from './title.entity';

const entities = [
  AcademicYearEntity,
  AcademicYearClassesEntity,
  ApprovalEntity,
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
  EvaluationItemEntity,
  HeaderEntity,
  ItemEntity,
  OptionEntity,
  TitleEntity,
];

export default entities;
