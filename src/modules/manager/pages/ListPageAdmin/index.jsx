import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';

import { Filter, ListStudents } from '_modules/manager/components';

import { isSuccess, isEmpty } from '_func/';

import { CPagination } from '_controls/';

import { getClasses } from '_api/classes.api';
import { getAdminSheets } from '_api/sheets.api';

const ListPageAdmin = () => {
	//#region Data
	const semesters = useSelector((state) => state.options.semesters, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const departments = useSelector((state) => state.options.departments, shallowEqual);

	const [data, setData] = useState(null);

	const listData = useMemo(() => data?.data || [], [data]);

	const [classes, setClasses] = useState([]);

	const [filter, setFilter] = useState({
		pages: 0,
		page: 1,
		department_id: departments[0].id,
		class_id: '',
		semester_id: semesters[0]?.id,
		academic_id: academic_years[0]?.id,
		status: -1,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const className = useMemo(() => {
		if (!filter.class_id || !classes.length) return '';

		return classes.find((e) => e.id.toString() === filter.class_id.toString())?.name || '';
	}, [filter.class_id]);
	//#endregion

	//#region Event
	const getClassesOptions = useCallback(async () => {
		const res = await getClasses(filter.department_id);

		if (isSuccess(res)) setClasses(res.data);
		else if (isEmpty(res)) setClasses([]);
	}, [filter.department_id]);

	const onPageChange = (event, value) => setFilter((prev) => ({ ...prev, page: value }));

	const getData = async () => {
		const _filter = { ...filter };

		if (!_filter?.input) {
			delete _filter?.input;
		}
		if (!_filter.status) {
			_filter.status = -1;
		}

		const res = await getAdminSheets(_filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData({ data: [], page: 1, pages: 0 });
	};
	//#endregion

	useEffect(() => {
		getClassesOptions();
	}, [getClassesOptions]);

	useEffect(() => {
		if (filter.class_id) getData();
	}, [filter]);

	useEffect(() => {
		setPaginate({ page: data?.page, pages: data?.pages });
	}, [data]);

	//#region Render
	return (
		<Box>
			<Filter
				filter={filter}
				onChangeFilter={setFilter}
				semesters={semesters}
				departments={departments}
				academic_years={academic_years}
				classes={classes}
			/>

			{className ? (
				<>
					<Typography
						borderRadius={2}
						p={2}
						mb={1}
						fontWeight={500}
						fontSize={18}
						sx={{ backgroundColor: 'rgba(0 0 0 / 5%)' }}
					>
						Lớp {className}
					</Typography>

					<ListStudents data={listData} page={paginate.page} />

					<CPagination
						page={paginate.page}
						pages={paginate.pages}
						onChange={onPageChange}
					/>
				</>
			) : (
				<Typography my={3} textAlign='center' fontWeight={600} fontSize={20}>
					Chọn lớp để hiển thị danh sách phiếu
				</Typography>
			)}
		</Box>
	);
	//#endregion
};

export default ListPageAdmin;
