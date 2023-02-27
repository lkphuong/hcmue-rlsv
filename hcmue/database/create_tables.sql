CREATE DATABASE `hcmue_rlsv`

CREATE TABLE `academic_years` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `start` int NOT NULL COMMENT 'Thời gian bắt đầu',
  `end` int NOT NULL COMMENT 'Thời gian kết thúc',
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `adviser_classes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `adviser_id` bigint DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52345 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `advisers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `semester_id` bigint DEFAULT NULL COMMENT 'Cố vấn học tập',
  `degree` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Học vị của giáo viên',
  `is_change` tinyint DEFAULT '0' COMMENT 'mật khẩu đã được thay đổi hay chưa??',
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24294 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `approvals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sheet_id` bigint NOT NULL,
  `std_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved_status` tinyint(1) DEFAULT '0' COMMENT '0: Không đánh giá, 1: Đánh giá',
  `approved_at` datetime DEFAULT NULL,
  `role_id` tinyint(1) DEFAULT '0' COMMENT '0: Sinh viên, 1: Lớp, 2: Cố vấn học tập, 3. Khoa',
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_classes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department_id` bigint NOT NULL,
  `class_id` bigint NOT NULL,
  `semester_id` bigint NOT NULL,
  `academic_id` bigint NOT NULL,
  `level_id` bigint NOT NULL,
  `amount` int NOT NULL DEFAULT '0' COMMENT 'Tổng số đánh giá theo xếp loại',
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `classes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `k` bigint NOT NULL,
  `department_id` bigint NOT NULL,
  `code` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10232 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `departments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `evaluations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sheet_id` bigint NOT NULL,
  `item_id` bigint DEFAULT NULL,
  `category` tinyint(1) DEFAULT '1' COMMENT '1. Sinh viên, 2. Lớp, 3. CVHT, 4Khoa',
  `option_id` bigint DEFAULT NULL,
  `ref` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `personal_mark_level` float DEFAULT NULL,
  `class_mark_level` float DEFAULT NULL,
  `adviser_mark_level` float DEFAULT NULL,
  `department_mark_level` float DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `delete_flag` tinyint DEFAULT '0',
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5896 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `files` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parent_ref` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `item_id` bigint DEFAULT NULL,
  `sheet_id` bigint DEFAULT NULL,
  `original_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `file_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `extension` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `drafted` tinyint DEFAULT '1',
  `active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `delete_flag` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `forms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `academic_id` bigint NOT NULL,
  `semester_id` bigint NOT NULL,
  `start` datetime NOT NULL COMMENT 'Thời gian bắt đầu',
  `end` datetime NOT NULL COMMENT 'Thời gian kết thúc',
  `status` tinyint(1) DEFAULT '0' COMMENT 'Trạng thái của biểu mẫu (0: drafted, 1: published, 2: in-progress, 3: done)',
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `headers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `form_id` bigint DEFAULT NULL,
  `ref` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_mark` float NOT NULL DEFAULT '0',
  `is_return` tinyint NOT NULL DEFAULT '1',
  `active` tinyint DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint DEFAULT '0',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=333 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `form_id` bigint NOT NULL,
  `parent_ref` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ref` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `control` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0. input, 1. checkbox, 2.single select, 3: multiple select',
  `multiple` tinyint(1) NOT NULL DEFAULT '0',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_mark` float DEFAULT NULL,
  `to_mark` float DEFAULT NULL,
  `mark` float DEFAULT '0',
  `category` tinyint(1) DEFAULT '0' COMMENT '0. single value, 1. range value, 2: per unit',
  `is_file` tinyint DEFAULT '0',
  `unit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `required` tinyint(1) DEFAULT '0',
  `discipline` tinyint(1) DEFAULT '0' COMMENT '0: Không kỷ luật, 1: Kỷ luật',
  `sort_order` tinyint DEFAULT '1' COMMENT '1. Xuất sắc, 2.Tốt, 3.Khá, 4.Trung bình, 5. Yếu, 6.Kém',
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2784 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `k` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `levels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `from_mark` int NOT NULL DEFAULT '0',
  `to_mark` int NOT NULL DEFAULT '0',
  `sort_order` tinyint NOT NULL COMMENT '1. Xuất sắc, 2.Tốt, 3.Khá, 4.Trung bình, 5. Yếu, 6.Kém',
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `majors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department_id` bigint DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=303 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `options` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `form_id` bigint NOT NULL,
  `parent_ref` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` float NOT NULL DEFAULT '0',
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=897 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `others` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department_id` bigint DEFAULT NULL,
  `password` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'sử dụng md5',
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` tinyint NOT NULL DEFAULT '0' COMMENT '0: Tài khoản cấp khoa, 1: Tài khoản admin',
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='table tài khoản cấp khoa và admin';

CREATE TABLE `role_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `std_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL COMMENT 'users -> std_code\nadvisers -> email\ndepartments -> email\nadmin -> email',
  `role_id` bigint NOT NULL,
  `class_id` bigint DEFAULT NULL,
  `department_id` bigint DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21966 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` tinyint NOT NULL DEFAULT '1',
  `name` varchar(255) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;

CREATE TABLE `semesters` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `academic_id` bigint NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `start` date DEFAULT NULL,
  `end` date DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `role_id` tinyint DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `department_id` bigint DEFAULT NULL,
  `access_token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `refresh_token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `login_time` datetime(6) DEFAULT NULL,
  `expired_time` datetime(6) DEFAULT NULL,
  `logout_time` datetime(6) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sheets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `form_id` bigint NOT NULL,
  `department_id` bigint DEFAULT NULL,
  `std_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `class_id` bigint DEFAULT NULL,
  `semester_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `k` bigint DEFAULT NULL,
  `level_id` bigint DEFAULT NULL,
  `graded` tinyint(1) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0' COMMENT '0 Sinh viên chưa đánh giá, 1 Lớp chưa đánh giá, 2 Cố vấn học tập chưa đánh giá, 3 Khoa chưa đánh giá, 4 Hoàn thành, 5 Từ chối',
  `sum_of_personal_marks` float DEFAULT NULL,
  `sum_of_class_marks` float DEFAULT NULL,
  `sum_of_adviser_marks` float DEFAULT NULL,
  `sum_of_department_marks` float DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17407 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `statuses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `flag` tinyint DEFAULT NULL COMMENT '1. Được phép phát hành phiếu. 0. No baby',
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_vi_0900_ai_ci;

CREATE TABLE `titles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `form_id` bigint DEFAULT NULL,
  `parent_ref` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ref` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=897 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `std_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `status_id` bigint NOT NULL DEFAULT '0',
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthday` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `department_id` bigint DEFAULT NULL,
  `major_id` bigint DEFAULT NULL,
  `academic_id` bigint DEFAULT NULL,
  `semester_id` bigint DEFAULT NULL,
  `is_change` tinyint DEFAULT '0' COMMENT 'mật khẩu đã được thay đổi hay chưa??',
  `active` tinyint DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `delete_flag` tinyint DEFAULT '0',
  `created_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `updated_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  `deleted_by` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_vi_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40803 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



