CREATE DEFINER=`uat`@`%` TRIGGER `tg_update_sheets_tbl` AFTER UPDATE ON `sheets` FOR EACH ROW BEGIN
	select new.department_id, new.class_id, new.semester_id, new.academic_id, new.level_id, new.graded, new.status, new.id, old.level_id, old.graded
	into @department_id, @class_id, @semester_id, @academic_id, @level_id, @graded, @status, @sheet_id, @old_level_id, @old_graded;
	
		IF (@graded <> 0) THEN
			SELECT COUNT(sheets.id)
			INTO @amount
			FROM sheets
			WHERE sheets.`department_id` = @department_id AND 
				sheets.`class_id` = @class_id AND 
				sheets.`semester_id` = @semester_id AND 
				sheets.`academic_id` = @academic_id AND 
				sheets.`level_id` = @level_id AND
				sheets.`delete_flag` = 0;

			SELECT COUNT(cache_classes.id)
			INTO @count
			FROM cache_classes
			WHERE cache_classes.`class_id` = @class_id AND 
				cache_classes.`semester_id` = @semester_id AND 
				cache_classes.`academic_id` = @academic_id AND 
				cache_classes.`level_id` = @level_id AND
				cache_classes.`delete_flag` = 0;
				
			IF (@count > 0) THEN
				UPDATE cache_classes
				SET cache_classes.`amount` = @amount
				WHERE cache_classes.`department_id` = @department_id AND 
					cache_classes.`class_id` = @class_id AND 
					cache_classes.`semester_id` = @semester_id AND 
					cache_classes.`academic_id` = @academic_id AND 
					cache_classes.`level_id` = @level_id AND
					cache_classes.`delete_flag` = 0;
                    
				
			ELSE
				INSERT INTO cache_classes (department_id, class_id, semester_id, academic_id, level_id, amount)
				VALUES (@department_id, @class_id, @semester_id, @academic_id, @level_id, @amount);
			END IF;
            
			IF(@old_graded <> 0) THEN
				SELECT COUNT(sheets.id)
				INTO @old_amount
				FROM sheets
				WHERE sheets.`department_id` = @department_id AND 
					sheets.`class_id` = @class_id AND 
					sheets.`semester_id` = @semester_id AND 
					sheets.`academic_id` = @academic_id AND 
					sheets.`level_id` = @old_level_id AND
					sheets.`delete_flag` = 0;
					
				SELECT COUNT(cache_classes.id)
				INTO @old_count
				FROM cache_classes
				WHERE cache_classes.`class_id` = @class_id AND 
					cache_classes.`semester_id` = @semester_id AND 
					cache_classes.`academic_id` = @academic_id AND 
					cache_classes.`level_id` = @old_level_id AND
					cache_classes.`delete_flag` = 0;
				
				IF(@old_count > 0) THEN
					UPDATE cache_classes
					SET cache_classes.`amount` = @old_amount
					WHERE cache_classes.`department_id` = @department_id AND 
						cache_classes.`class_id` = @class_id AND 
						cache_classes.`semester_id` = @semester_id AND 
						cache_classes.`academic_id` = @academic_id AND 
						cache_classes.`level_id` = @old_level_id AND
						cache_classes.`delete_flag` = 0;
				END IF;
			ELSE
				SELECT COUNT(sheets.id)
				INTO @amount_not_graded
				FROM sheets
				WHERE sheets.`department_id` = @department_id AND 
					sheets.`class_id` = @class_id AND 
					sheets.`semester_id` = @semester_id AND 
					sheets.`academic_id` = @academic_id AND 
					sheets.`graded` = 0 AND
					sheets.`delete_flag` = 0;
					
				SELECT COUNT(cache_classes.id)
				INTO @old_count
				FROM cache_classes
				WHERE cache_classes.`department_id` = @department_id AND  
					cache_classes.`class_id` = @class_id AND 
					cache_classes.`semester_id` = @semester_id AND 
					cache_classes.`academic_id` = @academic_id AND 
					cache_classes.`level_id` = 0 AND
					cache_classes.`delete_flag` = 0;
				
				UPDATE cache_classes
				SET cache_classes.`amount` = @amount_not_graded
				WHERE cache_classes.`department_id` = @department_id AND 
					cache_classes.`class_id` = @class_id AND 
					cache_classes.`semester_id` = @semester_id AND 
					cache_classes.`academic_id` = @academic_id AND 
					cache_classes.`level_id` = 0 AND
					cache_classes.`delete_flag` = 0;
			END IF;
		ELSE
			SELECT COUNT(sheets.id)
			INTO @amount
			FROM sheets
			WHERE sheets.`department_id` = @department_id AND 
				sheets.`class_id` = @class_id AND 
				sheets.`semester_id` = @semester_id AND 
				sheets.`academic_id` = @academic_id AND 
				sheets.`graded` = 0 AND 
				sheets.`delete_flag` = 0;
		
			SELECT COUNT(cache_classes.id)
			INTO @count
			FROM cache_classes
			WHERE cache_classes.`department_id` = @department_id AND 
				cache_classes.`class_id` = @class_id AND 
				cache_classes.`semester_id` = @semester_id AND 
				cache_classes.`academic_id` = @academic_id AND 
				cache_classes.`level_id` = 0 AND
				cache_classes.`delete_flag` = 0;
				
			IF (@count > 0) THEN
				UPDATE cache_classes
				SET cache_classes.`amount` = @amount
				WHERE cache_classes.`department_id` = @department_id AND 
					cache_classes.`class_id` = @class_id AND 
					cache_classes.`semester_id` = @semester_id AND 
					cache_classes.`academic_id` = @academic_id AND 
					cache_classes.`level_id` = 0 AND
					cache_classes.`delete_flag` = 0;
			ELSE
				INSERT INTO cache_classes (department_id, class_id, semester_id, academic_id, level_id, amount)
				VALUES (@department_id, @class_id, @semester_id, @academic_id, 0, @amount);
			END IF;
            
			SELECT COUNT(sheets.id)
			INTO @old_amount
			FROM sheets
			WHERE sheets.`department_id` = @department_id AND 
				sheets.`class_id` = @class_id AND 
				sheets.`semester_id` = @semester_id AND 
				sheets.`academic_id` = @academic_id AND 
				sheets.`level_id` = @old_level_id AND
				sheets.`delete_flag` = 0;
				
			SELECT COUNT(cache_classes.id)
			INTO @old_count
			FROM cache_classes
			WHERE cache_classes.`class_id` = @class_id AND 
				cache_classes.`semester_id` = @semester_id AND 
				cache_classes.`academic_id` = @academic_id AND 
				cache_classes.`level_id` = @old_level_id AND
				cache_classes.`delete_flag` = 0;
			
			IF(@old_count > 0) THEN
				UPDATE cache_classes
				SET cache_classes.`amount` = @old_amount
				WHERE cache_classes.`department_id` = @department_id AND 
					cache_classes.`class_id` = @class_id AND 
					cache_classes.`semester_id` = @semester_id AND 
					cache_classes.`academic_id` = @academic_id AND 
					cache_classes.`level_id` = @old_level_id AND
					cache_classes.`delete_flag` = 0;
			END IF;
		END IF;
    END