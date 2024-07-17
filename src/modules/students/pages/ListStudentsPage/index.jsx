import { createContext, memo, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Button, Stack } from '@mui/material';

import { CSearch } from '_controls/';

import { MFilter, MTable } from '_modules/students/components';

import { getClassesByDepartment } from '_api/classes.api';
import { getStudentsRole, importUsers } from '_api/user.api';
import { getSemestersByYear } from '_api/options.api';
import { uploadFile } from '_api/files.api';

import { isSuccess, isEmpty, cleanObjValue, checkValidFile } from '_func/';
import { alert } from '_func/alert';

import { EXCEL_FILE_TYPE } from '_constants/variables';

import { ReactComponent as ExcelIcon } from '_assets/icons/excel.svg';
import { actions } from '_slices/filters.slice';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const ConfigRoleContext = createContext();

const KEY = 'students-list';

const ListStudentsPage = memo(() => {
	//#region Data
	const fileRef = useRef();

	const dispatch = useDispatch();

	const departments = useSelector((state) => state.options.departments, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const filters = useSelector((state) => state.filters.filters, shallowEqual);

	const [classes, setClasses] = useState([]);

	const [semesters, setSemesters] = useState([]);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0].id,
		semester_id: null,
		department_id: null,
		class_id: null,
		status_id: null,
		input: '',
		page: 1,
		pages: 0,
		...(filters ? filters[KEY] : null),
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const { data, refetch, isFetching } = useQuery({
		queryKey: [KEY, filter],
		queryFn: () => {
			const _filter = cleanObjValue(filter);
			dispatch(actions.setFilters({ key: KEY, value: _filter }));
			return getStudentsRole(_filter);
		},
		select: (response) => response?.data,
		placeholderData: keepPreviousData,
		enabled: !!(filter?.academic_id && filter?.semester_id),
	});

	const dataTable = useMemo(() => data?.data || [], [data]);
	//endregion

	//#region Event
	const getClassData = async (department_id) => {
		const res = await getClassesByDepartment(department_id);

		if (isSuccess(res)) setClasses(res.data);
		else if (isEmpty(res)) setClasses([]);
	};

	const onPageChange = (event, value) => {
		setFilter((prev) => ({ ...prev, page: value }));
	};

	const getSemesters = async () => {
		const res = await getSemestersByYear(filter.academic_id);

		if (isSuccess(res)) setSemesters(res.data);
		else if (isEmpty(res)) setSemesters([]);
	};

	const onUpload = () => {
		alert.warning({
			text: 'Import file mới sẽ thay thế danh sách cũ (nếu có). Bạn có chắc muốn thực hiện nhập dữ liệu.',
			onConfirm: () => fileRef.current.click(),
		});
	};

	const onUploadFile = async (e) => {
		try {
			alert.loading();

			const file = e.target.files[0];

			if (file) {
				const isValid = checkValidFile(file);

				if (isValid) {
					if (file.type !== EXCEL_FILE_TYPE) alert.fail({ text: 'Định dạng file phải là Excel.' });
					else {
						const res = await uploadFile(file);

						if (isSuccess(res)) {
							const body = {
								academic_id: filter?.academic_id,
								semester_id: filter?.semester_id,
								file_id: Number(res?.data?.id),
							};

							const _res = await importUsers(body);

							if (isSuccess(_res)) {
								await refetch();

								alert.success({ text: 'Nhập dữ liệu thành công.' });
							} else
								alert.fail({
									text: _res?.message || 'Import file không thành công. Thử lại sau.',
								});
						} else
							alert.fail({
								text: res?.message || 'Import file không thành công. Thử lại sau.',
							});
					}
				}
			}
		} catch (error) {
			alert.fail({ text: 'Import file không thành công. Thử lại sau.' });
		} finally {
			fileRef.current.value = null;
		}
	};
	//#endregion

	//#region Cycle
	useEffect(() => {
		if (filter.department_id && filter.academic_id)
			getClassData(filter.department_id, filter.academic_id);
	}, [filter.department_id, filter.academic_id]);

	useEffect(() => {
		if (filter.academic_id) getSemesters();
	}, [filter.academic_id]);

	useEffect(() => {
		if (semesters?.length)
			setFilter((prev) => ({ ...prev, semester_id: Number(semesters[0]?.id) }));
	}, [semesters]);

	useEffect(() => {
		setPaginate({
			page: data?.page || 1,
			pages: data?.pages || 0,
		});
	}, [data]);
	//#endregion

	//#region Render
	return (
		<Box>
			<ConfigRoleContext.Provider value={{ getData: refetch }}>
				<MFilter
					filter={filter}
					onFilterChange={setFilter}
					departments={departments}
					academic_years={academic_years}
					semesters={semesters || []}
					classes={classes}
				/>

				<Stack
					direction={{ xs: 'column', md: 'row' }}
					spacing={1.5}
					justifyContent='space-between'
					alignItems='center'
					mb={2}
				>
					<CSearch
						onFilterChange={setFilter}
						defaultInput={filter?.input}
						placeholder='Nhập MSSV hoặc tên'
					/>

					<Button
						variant='contained'
						endIcon={<ExcelIcon />}
						sx={{
							backgroundColor: '#3EAE42',
							color: 'white',
							'&:hover': { backgroundColor: '#0CDB13D2' },
						}}
						disabled={!filter?.academic_id || !filter?.semester_id}
						onClick={onUpload}
					>
						Import Excel
					</Button>
					<input
						type='file'
						hidden
						ref={fileRef}
						onChange={onUploadFile}
						accept={EXCEL_FILE_TYPE}
					/>
				</Stack>

				<Stack direction='column' justifyContent='space-between'>
					<MTable
						data={dataTable}
						isLoading={isFetching}
						onFilterChange={setFilter}
						page={paginate.page}
						pages={paginate.pages}
						onPageChange={onPageChange}
					/>
				</Stack>
			</ConfigRoleContext.Provider>
		</Box>
	);
	//#endregion
});

export default ListStudentsPage;
