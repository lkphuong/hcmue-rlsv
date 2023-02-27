DELIMITER $$
CREATE DEFINER=`uat`@`%` PROCEDURE `sp_generate_headers`(IN source_form_id BIGINT, target_form_id bigint)
BEGIN
	DECLARE success TINYINT(1);
	DECLARE message TEXT;
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1 message = MESSAGE_TEXT;
		
		SET success = 0;
		SELECT success AS success, message AS message;
	END;
	
	INSERT INTO headers (`form_id`, `ref`, `name`, `max_mark`, `is_return`)
		SELECT target_form_id, headers.`ref`, headers.`name`, headers.`max_mark`, headers.`is_return`
		FROM headers WHERE headers.`form_id` = source_form_id AND 
			headers.`delete_flag` = 0;
		
	SET success = 1;
	SELECT success AS success, message AS message;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`uat`@`%` PROCEDURE `sp_generate_items`(IN source_form_id BIGINT, target_form_id BIGINT)
BEGIN
	DECLARE success TINYINT(1);
	DECLARE message TEXT;
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1 message = MESSAGE_TEXT;
		
		SET success = 0;
		SELECT success AS success, message AS message;
	END;
	
	
	INSERT INTO items (`form_id`, `parent_ref`, `ref`, `control`, `multiple`, `content`,  `from_mark`, `to_mark`, `mark` ,`category`, `unit`, `required`, `is_file`, `discipline`, `sort_order`)
		SELECT target_form_id, items.`parent_ref`, items.`ref`, items.`control`, items.`multiple`, items.`content`, items.`from_mark`, items.`to_mark`, 
			items.`mark`, items.`category`, items.`unit`, items.`required`, items.`is_file`, items.`discipline`, items.`sort_order`
		FROM items
		WHERE items.`form_id` = source_form_id AND 
			items.`delete_flag` = 0;
		
	SET success = 1;
	SELECT success AS success, message AS message;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`uat`@`%` PROCEDURE `sp_generate_options`(IN source_form_id BIGINT, target_form_id BIGINT)
BEGIN
	DECLARE success TINYINT(1);
	DECLARE message TEXT;
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1 message = MESSAGE_TEXT;
		
		SET success = 0;
		SELECT success AS success, message AS message;
	END;
	
	INSERT INTO `options` (`form_id`, `parent_ref`, `content`,  `mark`)
		SELECT target_form_id, `options`.`parent_ref`,  `options`.`content`, `options`.`mark`
		FROM `options`
		WHERE `options`.`form_id` = source_form_id AND 
			`options`.`delete_flag` = 0;
					
	SET success = 1;
	SELECT success AS success, message AS message;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`uat`@`%` PROCEDURE `sp_generate_sheets`(IN source_form_id BIGINT, source_academic_id BIGINT, source_semester_id BIGINT)
BEGIN
	DECLARE success TINYINT(1);
	DECLARE message TEXT;
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1 message = MESSAGE_TEXT;
		
		SET success = 0;
		SELECT success AS success, message AS message;
		
		ROLLBACK;
	END;
	
	START TRANSACTION;
		INSERT INTO sheets (form_id, department_id, class_id, std_code, semester_id, academic_id)
		SELECT source_form_id, users.department_id, users.class_id, users.std_code, users.semester_id, users.academic_id
		FROM users 
			JOIN statuses ON users.status_id = statuses.id
		WHERE statuses.flag = 1 AND 
			  users.academic_id = source_academic_id AND 
              users.semester_id = source_semester_id;
              
		INSERT INTO sheets (form_id, department_id, class_id, std_code, semester_id, academic_id, graded, status)
		SELECT source_form_id, users.department_id, users.class_id, users.std_code, users.semester_id, users.academic_id, 0, 5
		FROM users 
			JOIN statuses ON users.status_id = statuses.id
		WHERE statuses.flag = 2 AND 
			  users.academic_id = source_academic_id AND 
              users.semester_id = source_semester_id;

		SET success = 1;
		SELECT success AS success, message AS message;
		
	COMMIT WORK;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`uat`@`%` PROCEDURE `sp_generate_titles`(IN source_form_id BIGINT, target_form_id BIGINT)
BEGIN
	DECLARE success TINYINT(1);
	DECLARE message TEXT;
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1 message = MESSAGE_TEXT;
		
		SET success = 0;
		SELECT success AS success, message AS message;
	END;
	
	INSERT INTO titles (`form_id`, `parent_ref`, `ref`, `name`)
		SELECT target_form_id, titles.`parent_ref`, titles.`ref`, titles.`name`
		FROM titles
		WHERE titles.`form_id` = source_form_id AND 
			titles.`delete_flag` = 0;
		
	SET success = 1;
	SELECT success AS success, message AS message;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`uat`@`%` PROCEDURE `sp_multiple_approval`(IN sheet_ids TEXT, role_code INT)
BEGIN
	DECLARE success TINYINT(1);
	DECLARE message TEXT;
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1 message = MESSAGE_TEXT;
		
		SET success = 0;
		SELECT success AS success, message AS message;
		
		ROLLBACK;
	END;
	
	START TRANSACTION;
		IF(role_code <> 4) THEN
			INSERT INTO `evaluations` (`sheet_id`,`item_id`, `category`, `ref`, `department_mark_level`)
				SELECT `sheet_id`, `item_id`, 4, `ref`, `adviser_mark_level`
				FROM `evaluations`
			WHERE  FIND_IN_SET(sheet_id, sheet_ids) AND `evaluations`.`category` = 3;
	    
			UPDATE sheets 
				SET sheets.`status` = 4, 
					sheets.`sum_of_department_marks` = 
						CASE 
							WHEN sheets.`sum_of_adviser_marks` IS NOT NULL THEN sheets.`sum_of_adviser_marks`
							WHEN sheets.`sum_of_adviser_marks` IS NULL THEN `sheets`.`sum_of_class_marks`
							ELSE 0
						END
				WHERE FIND_IN_SET(id, sheet_ids);
        ELSE
			INSERT INTO `evaluations` (`sheet_id`,`item_id`, `category`, `ref`, `adviser_mark_level`)
				SELECT `sheet_id`, `item_id`, 3, `ref`, `class_mark_level`
				FROM `evaluations`
			WHERE  FIND_IN_SET(sheet_id, sheet_ids) AND `evaluations`.`category` = 2;
		
			UPDATE sheets 
				SET sheets.`status` = 3, 
					sheets.`sum_of_adviser_marks` = 
						CASE 
							WHEN sheets.`sum_of_class_marks` IS NOT NULL THEN sheets.`sum_of_class_marks`
							WHEN sheets.`sum_of_class_marks` IS NULL THEN `sheets`.`sum_of_personal_marks`
							ELSE 0
						END
				WHERE FIND_IN_SET(id, sheet_ids);
        END IF;
		SET success = 1;
		SELECT success AS success, message AS message;
		
	COMMIT WORK;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`uat`@`%` PROCEDURE `sp_update_advisers`(IN source_academic_id BIGINT, target_academic_id BIGINT)
BEGIN
	DECLARE success TINYINT(1);
	DECLARE message TEXT;
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1 message = MESSAGE_TEXT;
		
		SET success = 0;
		SELECT success AS success, message AS message;
	END;
	
	UPDATE advisers
	SET is_change = 1, password = IF( 
		EXISTS(
			SELECT password FROM
			(
			  SELECT * FROM advisers
			) AS a1 
			WHERE a1.email = advisers.email AND a1.academic_id = source_academic_id AND a1.is_change = 1 AND active = false
			ORDER BY id DESC
			LIMIT 1 
		), 
        (
			SELECT password FROM
			(
			  SELECT * FROM advisers
			) AS a1 
			WHERE a1.email = advisers.email AND a1.academic_id = source_academic_id AND a1.is_change = 1 AND active = false
			ORDER BY id DESC
			LIMIT 1 
        ),
        (advisers.password)
	)
    WHERE academic_id = target_academic_id AND is_change = 0 ;

		
	SET success = 1;
	SELECT success AS success, message AS message;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`uat`@`%` PROCEDURE `sp_update_users`(IN 
	source_academic_id BIGINT, 
    source_semester_id BIGINT, 
    target_academic_id BIGINT, 
    target_semester_id BIGINT
    )
BEGIN
	DECLARE success TINYINT(1);
	DECLARE message TEXT;
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET CURRENT DIAGNOSTICS CONDITION 1 message = MESSAGE_TEXT;
		
		SET success = 0;
		SELECT success AS success, message AS message;
	END;
	
	UPDATE users
	SET is_change = 1, password = IF( 
		EXISTS(
			SELECT password FROM
			   (
				  SELECT * FROM users
			   ) AS u1
		   WHERE u1.std_code = users.std_code AND
				u1.academic_id = source_academic_id AND 
				u1.semester_id = source_semester_id AND
				u1.is_change = 1 
				AND active = false
			ORDER BY id DESC
			LIMIT 1 
	   ), (
		SELECT password FROM
			   (
				  SELECT * FROM users
			   ) AS u1
		   WHERE u1.std_code = users.std_code AND
				u1.academic_id = source_academic_id AND 
				u1.semester_id = source_semester_id AND
				u1.is_change = 1 
				AND active = false
			ORDER BY id DESC
			LIMIT 1 
	   ), (users.password)
	) 
	WHERE academic_id = target_academic_id AND semester_id = target_semester_id AND is_change = 0;
		
	SET success = 1;
	SELECT success AS success, message AS message;
END$$
DELIMITER ;





