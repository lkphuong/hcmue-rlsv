import { useEffect, useMemo, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { ListSheets } from '_modules/home/components';

import { isSuccess } from '_func/';

import { CPagination } from '_controls/';

const FAKE_DATA = [
	{
		id: 1,
		semester: { id: 1, display: 'Học kỳ II (06/2021 - 09/2021)' },
		academic: { id: 1, name: '2021-2022' },
		mark: 80,
		level: { name: 'Giỏi' },
		status: 'Hoàn thành',
	},
	{
		id: 2,
		semester: { id: 1, display: 'Học kỳ II (06/2021 - 09/2021)' },
		academic: { id: 1, name: '2021-2022' },
		mark: 80,
		level: { name: 'Giỏi' },
		status: 'Hoàn thành',
	},
	{
		id: 3,
		semester: { id: 1, display: 'Học kỳ II (06/2021 - 09/2021)' },
		academic: { id: 1, name: '2021-2022' },
		mark: 80,
		level: { name: 'Giỏi' },
		status: 'Hoàn thành',
	},
	{
		id: 4,
		semester: { id: 1, display: 'Học kỳ II (06/2021 - 09/2021)' },
		academic: { id: 1, name: '2021-2022' },
		mark: 80,
		level: { name: 'Giỏi' },
		status: 'Hoàn thành',
	},
	{
		id: 5,
		semester: { id: 1, display: 'Học kỳ II (06/2021 - 09/2021)' },
		academic: { id: 1, name: '2021-2022' },
		mark: 80,
		level: { name: 'Giỏi' },
		status: 'Hoàn thành',
	},
	{
		id: 6,
		semester: { id: 1, display: 'Học kỳ II (06/2021 - 09/2021)' },
		academic: { id: 1, name: '2021-2022' },
		mark: 80,
		level: { name: 'Giỏi' },
		status: 'Hoàn thành',
	},
];

const HistoryStudentSheetsPage = () => {
	//#region Data
	const { user_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getData = async (id) => {
		try {
			// const res = await getCurrentStudentSheet(id);
			const res = { status: 200, data: { data: FAKE_DATA, page: 1, pages: 3 } };

			if (isSuccess(res)) setData(res?.data);
		} catch (error) {
			throw error;
		}
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));
	//#endregion

	useEffect(() => {
		if (user_id) getData(user_id);
	}, [filter, user_id]);

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
