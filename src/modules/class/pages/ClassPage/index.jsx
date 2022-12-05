/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { getClassSheets } from '_api/sheets.api';

import { isSuccess, isEmpty } from '_func/';

import { Filter, ListStudents } from '_modules/class/components';
import { CPagination } from '_controls/';

const ClassPage = () => {
	//#region Data
	const { class_id, department_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const { semesters, academic_years } = useSelector((state) => state.options, shallowEqual);

	const [data, setData] = useState();

	const dataTable = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState({
		department_id,
		semester_id: semesters[0]?.id,
		academic_id: academic_years[0].id,
		page: 1,
		pages: 0,
		input: '',
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getData = useCallback(async () => {
		if (!class_id) return;
		try {
			const _input = filter?.input;

			const res = await getClassSheets(
				class_id,
				_input === '' ? { ...filter, input: null } : filter
			);

			if (isSuccess(res)) setData(res.data);
			else if (isEmpty(res)) setData([]);
		} catch (error) {
			throw error;
		}
	}, [filter, class_id]);

	const onPageChange = (event, value) => setFilter((prev) => ({ ...prev, page: value }));
	//#endregion

	useEffect(() => {
		getData();
	}, [getData]);

	useEffect(() => {
		setPaginate({
			page: data?.page,
			pages: data?.pages,
		});
	}, [data]);

	//#region Render
	return (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5}>
						Danh sách điểm rèn luyện của lớp
					</Typography>
				</Paper>
			</Box>

			<Filter
				filter={filter}
				onChangeFilter={setFilter}
				semesters={semesters}
				academic_years={academic_years}
			/>

			<ListStudents data={dataTable} refetch={getData} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default ClassPage;
