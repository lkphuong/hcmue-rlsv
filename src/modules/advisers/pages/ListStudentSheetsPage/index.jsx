import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Box } from '@mui/material';

import { getSemestersByYear } from '_api/options.api';
import { getClassSheets } from '_api/sheets.api';

import { CPagination } from '_controls/';

import { cleanObjValue, isEmpty, isSuccess } from '_func/index';

import { ListStudentsTable, MClassFilter, MSearch } from '_modules/advisers/components';

import { actions } from '_slices/filter.slice';

const ListStudentSheetsPage = () => {
	//#region Data
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const { class_id } = useParams();

	const [semesters, setSemesters] = useState([]);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		department_id,
		academic_id: academic_years[0]?.id,
		semester_id: null,
		input: '',
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
		const _filter = cleanObjValue(filter);

		const res = await getClassSheets(class_id, _filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData({ data: [], page: 1, pages: 0 });
	};

	const getSemestersData = async () => {
		const res = await getSemestersByYear(filter.academic_id);

		if (isSuccess(res)) setSemesters(res.data);
		else setSemesters([]);
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));

	const saveFilter = () => dispatch(actions.setFilter(filter));
	//#endregion

	useEffect(() => {
		if (filter?.academic_id && filter?.semester_id) getData();
	}, [filter]);

	useEffect(() => {
		setPaginate({
			page: data?.page || 1,
			pages: data?.pages || 0,
		});
	}, [data]);

	useEffect(() => {
		if (semesters?.length) {
			setFilter((prev) => ({ ...prev, semester_id: Number(semesters[0]?.id) || null }));
		}
	}, [semesters]);

	useEffect(() => {
		if (filter?.academic_id) getSemestersData();
	}, [filter?.academic_id]);

	//#region Render
	return (
		<Box>
			<MClassFilter
				filter={filter}
				onFilterChange={setFilter}
				academic_years={academic_years}
				semesters={semesters}
			/>

			<MSearch onFilterChange={setFilter} />

			<ListStudentsTable data={listData} saveFilter={saveFilter} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default ListStudentSheetsPage;
