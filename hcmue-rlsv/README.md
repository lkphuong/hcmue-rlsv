- Các table phase-1

* academic_year_classes
* academic_years
* approvals
* cache_classes
* evaluations
* forms
* headers
* items
* levels
* options
* role_users
* roles
* semesters
* sessions
* sheet_signatures
* sheets
* signuatures
* titles

- Các trigger được thêm vào

* tg_add_sheets_tbl

- Các store_procedures được thêm vào

* sp_generate_headers
* sp_generate_items
* sp_generate_options
* sp_generate_titles
* sp_multiple_approval

# docker build --no-cache -t hoanglong1011/hcmue:1.1 -t hoanglong1011/hcmue:latest .

# docker push hoanglong1011/hcmue:1.1

# docker push hoanglong1011/hcmue:latest
