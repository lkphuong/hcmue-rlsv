# Các table phase-1

- academic_year_classes
- academic_years
- approvals
- cache_classes
- evaluations
- forms
- headers
- items
- levels
- options
- role_users
- roles
- semesters
- sessions
- sheet_signatures
- sheets
- signuatures
- titles

# Feedback date 23/12/2022

## Thêm table

- classes
- departments
- k
- majors
- status (tình trạng của sinh viên)
- users

## Update table

- forms (chỉnh sửa thời gian phát hành)

# Update

- Table evaluations và level thêm field sort_order
- Table headers thêm field is_return default: true quay về điểm max của header

# Các trigger được thêm vào

- tg_add_sheets_tbl (tự động insert to "approvals" trạng thái đánh giá của sinh viên, lớp & khoa theo "sheet_id")

- tg_update_sheets_tbl (tính tổng xếp loại sinh viên theo niên khóa, học kì, khoa & lớp)

# Các store_procedures được thêm vào

- sp_generate_headers (clone headers from source_form to target_form)

- sp_generate_titles (clone titles from source_form to target_form)

- sp_generate_items (clone items from source_form to target_form)

- sp_generate_options (clone options from source_form to target_form)

- sp_multiple_approval (cập nhật điểm đánh giá của lớp (hoặc sinh viên) qua điểm đánh giá của khoa cùng lúc nhiều phiếu (chỉ áp dụng đối với tài khoản của khoa))

# docker build --no-cache -t hoanglong1011/hcmue:1.1 -t hoanglong1011/hcmue:latest .

# docker push hoanglong1011/hcmue:1.1

# docker push hoanglong1011/hcmue:latest
