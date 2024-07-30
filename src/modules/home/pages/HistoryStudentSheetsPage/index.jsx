import { useEffect, useMemo, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { ListSheets } from '_modules/home/components';

import { isSuccess } from '_func/';

import { CPagination } from '_controls/';

import { getStudentHistorySheets } from '_api/sheets.api';

const HistoryStudentSheetsPage = () => {
	//#region Data
	const { username } = useSelector((state) => state.auth.profile, shallowEqual);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		std_code: username || null,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getData = async () => {
		const res = await getStudentHistorySheets(filter);

		if (isSuccess(res)) setData(res?.data);
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));
	//#endregion

	useEffect(() => {
		if (username) getData();
	}, [filter, username]);

	useEffect(() => {
		setPaginate({
			page: data?.page || 1,
			pages: data?.pages || 0,
		});
	}, [data]);

	//#region Render
	return (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						Lịch sử phiếu chấm điểm rèn luyện
					</Typography>
				</Paper>
			</Box>

			<ListSheets data={listData} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};

export default HistoryStudentSheetsPage;
