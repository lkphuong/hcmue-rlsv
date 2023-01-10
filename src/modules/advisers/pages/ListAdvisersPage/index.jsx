import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Button, Stack } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

import { CPagination } from '_controls/';

import { MFilter, MTable, MSearch } from '_modules/advisers/components';

import { getClasses } from '_api/classes.api';
import { getStudentsRole, importUsers } from '_api/user.api';
import { uploadFile } from '_api/files.api';

import { isSuccess, isEmpty, cleanObjValue } from '_func/';
import { alert } from '_func/alert';

const FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

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
	const getData = useCallback(async () => {
		if (!filter?.academic_id) return;

		setIsLoading(true);

		try {
			const _filter = cleanObjValue(filter);

			const res = await getStudentsRole(_filter);

			if (isSuccess(res)) {
				setData(res.data);
			} else if (isEmpty(res)) setData(null);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, [filter]);

	const getClassData = async (department_id) => {
		const res = await getClasses(department_id);

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
				if (file.type !== FILE_TYPE) alert.fail({ text: 'Định dạng file phải là Excel.' });
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
							await getData();

							alert.success({ text: 'Nhập dữ liệu thành công.' });
						} else {
							alert.fail({ text: 'Import file không thành công. Thử lại sau.' });
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
	}, [getData]);

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
				onChangeFilter={setFilter}
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
				<MSearch onFilterChange={setFilter} />

				<Button
					variant='contained'
					endIcon={<UploadFile />}
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
					accept={FILE_TYPE}
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
