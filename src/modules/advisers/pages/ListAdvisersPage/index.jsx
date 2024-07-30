import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Button, Stack } from '@mui/material';

import { CPagination, CSearch } from '_controls/';

import { MFilter, MTable } from '_modules/advisers/components';

import { getClassesByDepartment } from '_api/classes.api';
import { getAllAdvisers, importAdvisers } from '_api/adviser.api';
import { uploadFile } from '_api/files.api';

import { isSuccess, isEmpty, cleanObjValue, checkValidFile } from '_func/';
import { alert } from '_func/alert';

import { EXCEL_FILE_TYPE } from '_constants/variables';

import { ReactComponent as ExcelIcon } from '_assets/icons/excel.svg';

const ListAdvisersPage = memo(() => {
	//#region Data
	const fileRef = useRef();

	const departments = useSelector((state) => state.options.departments, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const [isLoading, setIsLoading] = useState(false);

	const [data, setData] = useState();

	const [classes, setClasses] = useState([]);

	const [filter, setFilter] = useState({
		academic_id: academic_years[0].id,
		department_id: null,
		class_id: null,
		input: '',
		page: 1,
		pages: 0,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dataTable = useMemo(() => data?.data || [], [data]);
	//endregion

	//#region Event
	const getData = async () => {
		if (!filter?.academic_id) return;

		setIsLoading(true);

		try {
			const _filter = cleanObjValue(filter);

			const res = await getAllAdvisers(_filter);

			if (isSuccess(res)) {
				setData(res.data);
			} else if (isEmpty(res)) setData(null);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getClassData = async (department_id) => {
		const res = await getClassesByDepartment(department_id);

		if (isSuccess(res)) setClasses(res.data);
		else if (isEmpty(res)) setClasses([]);
	};

	const onPageChange = (event, value) => {
		setFilter((prev) => ({ ...prev, page: value }));
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
					if (file.type !== EXCEL_FILE_TYPE)
						alert.fail({ text: 'Định dạng file phải là Excel.' });
					else {
						const res = await uploadFile(file);

						if (isSuccess(res)) {
							const body = {
								academic_id: filter?.academic_id,
								file_id: Number(res?.data?.id),
							};

							const _res = await importAdvisers(body);

							if (isSuccess(_res)) {
								await getData();

								alert.success({ text: 'Nhập dữ liệu thành công.' });
							} else {
								alert.fail({ text: 'Import file không thành công. Thử lại sau.' });
							}
						}
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
		getData();
	}, [filter]);

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
			<MFilter
				filter={filter}
				onFilterChange={setFilter}
				departments={departments}
				academic_years={academic_years}
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
					placeholder='Nhập tên để tìm kiếm'
				/>

				<Button
					variant='contained'
					endIcon={<ExcelIcon />}
					sx={{
						backgroundColor: '#3EAE42',
						color: 'white',
						'&:hover': { backgroundColor: '#0CDB13D2' },
					}}
					disabled={!filter?.academic_id}
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
				<MTable data={dataTable} isLoading={isLoading} />

				<CPagination
					page={paginate.page}
					pages={paginate.pages}
					onChange={onPageChange}
					isLoading={isLoading}
					isGoTo
				/>
			</Stack>
		</Box>
	);
	//#endregion
});

export default ListAdvisersPage;
