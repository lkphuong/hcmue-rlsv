/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { getClassSheets } from '_api/sheets.api';

import { isSuccess, isEmpty } from '_func/';

import { Filter, ListStudents } from '_modules/class/components';

import { CPagination } from '_controls/';

import { actions } from '_slices/filter.slice';

const ClassPage = () => {
	//#region Data
	const { class_id, department_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const { semesters, academic_years } = useSelector((state) => state.options, shallowEqual);
	const filters = useSelector((state) => state.filter.filters, shallowEqual);

	const [data, setData] = useState();

	const dataTable = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState(
		filters || {
			department_id,
			semester_id: semesters[0]?.id,
			academic_id: academic_years[0].id,
			page: 1,
			pages: 0,
			input: '',
		}
	);

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
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
	};

	const onPageChange = (event, value) => setFilter((prev) => ({ ...prev, page: value }));

	const saveFilter = () => {
		dispatch(actions.setFilter(filter));
	};
	//#endregion

	useEffect(() => {
		if (class_id) getData();
	}, [filter, class_id]);

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
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						Danh sách điểm rèn luyện của lớp
					</Typography>
				</Paper>
			</Box>

			<Filter
				filter={filter}
				onFilterChange={setFilter}
				semesters={semesters}
				academic_years={academic_years}
			/>

			<ListStudents data={dataTable} refetch={getData} saveFilter={saveFilter} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default ClassPage;
