ALTER TABLE `hcmue_rlsv`.`classes` 
ADD COLUMN `academic_id` BIGINT NULL AFTER `department_id`,
ADD COLUMN `semester_id` BIGINT NULL AFTER `academic_id`;

---
ALTER TABLE `hcmue_rlsv`.`departments` 
ADD COLUMN `academic_id` BIGINT NULL AFTER `name`,
ADD COLUMN `semester_id` BIGINT NULL AFTER `academic_id`;

---
ALTER TABLE `hcmue_rlsv`.`majors` 
ADD COLUMN `academic_id` BIGINT NULL AFTER `department_id`,
ADD COLUMN `semester_id` BIGINT NULL AFTER `academic_id`;

----
ALTER TABLE `hcmue_rlsv`.`k` 
ADD COLUMN `academic_id` BIGINT NULL AFTER `name`,
ADD COLUMN `semester_id` BIGINT NULL AFTER `academic_id`;
