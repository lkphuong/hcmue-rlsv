import { useEffect, useMemo, useState } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { MSearch, SheetsTable } from '_modules/home/components';

import { isSuccess, cleanObjValue, isEmpty } from '_func/';

import { getClassSheets } from '_api/sheets.api';
import { actions } from '_slices/filter.slice';
import { CPagination } from '_controls/';

const CurrentSheetPage = () => {
	//#region Data
	const { academic, semester } = useSelector((state) => state.currentInfo, shallowEqual);
	const { department_id, class_id } = useSelector((state) => state.auth.profile, shallowEqual);
	const filters = useSelector((state) => state.filter.filters, shallowEqual);

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState(
		filters || {
			page: 1,
			pages: 0,
			department_id,
			academic_id: Number(academic?.id),
			semester_id: Number(semester?.id),
			input: '',
		}
	);

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
		setLoading(true);
		const _filter = cleanObjValue(filter);

		const res = await getClassSheets(class_id[0], _filter);

		if (isSuccess(res)) setData(res.data);
		else if (isEmpty(res)) setData({ data: [], page: 1, pages: 0 });
		setLoading(false);
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

	//#region Render
	return listData?.length > 0 ? (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						{`Phiếu chấm điểm rèn luyện ${listData[0]?.semester} - Năm học ${listData[0]?.academic_year}`}
					</Typography>
				</Paper>
			</Box>

			<Box mb={1.5}>
				<MSearch onFilterChange={setFilter} />
			</Box>

			<SheetsTable data={listData} saveFilter={saveFilter} loading={loading} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	) : (
		<Paper className='paper-wrapper'>
			<Typography fontSize={20} p={1.5} fontWeight={600}>
				{loading ? 'Đang lấy dữ liệu...' : 'Hiện tại không có phiếu điểm cần chấm'}
			</Typography>
		</Paper>
	);
	//#endregion
};

export default CurrentSheetPage;
