import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box } from '@mui/material';

import { CPagination } from '_controls/';

import { ListDepartmentsHistory, MHistoryFilter } from '_modules/sheets/components';

import { getAdminHistorySheets } from '_api/sheets.api';
import { getSemestersByYear } from '_api/options.api';

import { isSuccess, cleanObjValue } from '_func/';

const HistorySheetsPage = () => {
	//#region Data
	const academic_years = useSelector((state) => state.options.academic_years, shallowEqual);

	const [isLoading, setIsLoading] = useState(false);

	const [semesters, setSemesters] = useState([]);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data?.department || [], [data]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		academic_id: Number(academic_years[0]?.id) || '',
		semester_id: '',
		department_id: '',
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getSemestersData = async () => {
		const res = await getSemestersByYear(filter.academic_id);

		if (isSuccess(res)) setSemesters(res.data);
		else setSemesters([]);
	};

	const getData = async () => {
		setIsLoading(true);

		try {
			const _filter = cleanObjValue(filter);

			const res = await getAdminHistorySheets(_filter);

			if (isSuccess(res)) setData(res.data);
			else setData({ data: {}, page: 1, pages: 0 });
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));
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

			<ListDepartmentsHistory
				data={listData}
				academic={data?.data?.academic}
				semester={data?.data?.semester}
				isLoading={isLoading}
			/>

			<CPagination
				page={paginate.page}
				pages={paginate.pages}
				onChange={onPageChange}
				isLoading={isLoading}
			/>
		</Box>
	);

	//#endregion
};

export default HistorySheetsPage;
