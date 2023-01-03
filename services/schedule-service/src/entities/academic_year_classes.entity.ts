// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';

// import { AcademicYearEntity } from './academic_year.entity';
// import { RootEntity } from './root.entity';

// @Entity('academic_year_classes')
// export class AcademicYearClassesEntity extends RootEntity {
//   @PrimaryGeneratedColumn('increment', {
//     type: 'bigint',
//   })
//   id: number;

//   @Column('varchar', {
//     name: 'class_id',
//     nullable: false,
//     length: 24,
//   })
//   class_id: string;

//   @ManyToOne(() => AcademicYearEntity, (academic_year) => academic_year)
//   @JoinColumn([
//     {
//       name: 'academic_year_id',
//       referencedColumnName: 'id',
//     },
//   ])
//   academic_year: AcademicYearEntity;
// }
