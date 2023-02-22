import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { cleanObjValue, isEmpty, isSuccess } from '_func/index';

import { getClassHistorySheets } from '_api/sheets.api';
import { getSemestersByYear } from '_api/options.api';

import { Filter, MHistoryTable } from '_modules/class/components';

import { CPagination } from '_controls/';

import { actions } from '_slices/filter.slice';

const HistoryClassSheetsPage = () => {
	//#region Data
	const { department_id, class_ids } = useSelector((state) => state.auth.profile, shallowEqual);
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const filters = useSelector((state) => state.filter.filters, shallowEqual);

	const [semesters, setSemesters] = useState([]);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState(
		filters || {
			page: 1,
			pages: 0,
			department_id,
			class_id: class_ids[0] ?? null,
			academic_id: null,
			semester_id: null,
		}
	);

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getSemestersData = async () => {
		const res = await getSemestersByYear(filter?.academic_id);

		if (isSuccess(res)) setSemesters(res?.data);
		else setSemesters([]);
	};

	const getData = async () => {
		if (!filter?.class_id) return;

		const _filter = cleanObjValue(filter);

		const res = await getClassHistorySheets(_filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData({ data: [], page: 1, pages: 0 });
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));

	const saveFilter = () => dispatch(actions.setFilter(filter));
	//#endregion

	useEffect(() => {
		getData();
	}, [filter]);

	useEffect(() => {
		setPaginate({ page: data?.page || 1, pages: data?.pages || 0 });
	}, [data]);

	useEffect(() => {
		if (filter?.academic_id) getSemestersData();
		else setSemesters([]);
	}, [filter?.academic_id]);

	//#region Render
	return (
		<Box>
			<Filter
				filter={filter}
				onFilterChange={setFilter}
				academic_years={academic_years}
				semesters={semesters}
			/>

			<MHistoryTable data={listData} saveFilter={saveFilter} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default HistoryClassSheetsPage;
