import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { CPagination } from '_controls/';

import { ListDepartmentsHistory, MHistoryFilter } from '_modules/department/components';

import { getDepartmentHistorySheets } from '_api/sheets.api';
import { getSemestersByYear } from '_api/options.api';

import { isSuccess, cleanObjValue } from '_func/';

import { actions } from '_slices/currentInfo.slice';

const HistorySheetsPage = () => {
	//#region Data
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);
	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [semesters, setSemesters] = useState([]);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data?.class || [], [data]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		academic_id: Number(academic_years[0]?.id) || '',
		semester_id: '',
		department_id,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getSemestersData = async () => {
		const res = await getSemestersByYear(filter.academic_id);

		if (isSuccess(res)) setSemesters(res.data);
		else setSemesters([]);
	};

	const getData = async () => {
		const _filter = cleanObjValue(filter);

		const res = await getDepartmentHistorySheets(_filter);

		if (isSuccess(res)) setData(res.data);
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));

	const handleSetCurrent = () => {
		const info = {
			academic: data?.data?.academic,
			semester: data?.data?.semester,
		};

		dispatch(actions.setInfo(info));
	};
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
			<MHistoryFilter
				filter={filter}
				academic_years={academic_years}
				semesters={semesters}
				onFilterChange={setFilter}
			/>

			<ListDepartmentsHistory data={listData} onSetCurrent={handleSetCurrent} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);

	//#endregion
};

export default HistorySheetsPage;
