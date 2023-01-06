import { useEffect, useMemo, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { getSemesters } from '_api/options.api';

import { isSuccess } from '_func/';

import { AddSection } from './AddSection';
import { MTable } from './MTable';
import { CPagination } from '_controls/';

export const TabSemester = () => {
	//#region Data
	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [params, setParams] = useState({ page: 1, pages: 0 });

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getData = async () => {
		const res = await getSemesters(params);

		if (isSuccess(res)) {
			setData(res?.data);
		}
	};

	const onPageChange = (event, newPage) => setParams((prev) => ({ ...prev, page: newPage }));
	//#endregion

	useEffect(() => {
		getData();
	}, [params]);

	useEffect(() => {
		setPaginate({
			page: data?.page || 1,
			pages: data?.pages || 0,
		});
	}, [data]);

	//#region Render
	return (
		<Box>
			<AddSection refetch={getData} />

			<Typography fontSize={20} fontWeight={700} lineHeight='24px' mb={2}>
				Danh sách học kỳ theo thời gian
			</Typography>

			<MTable data={listData} refetch={getData} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);
	//#endregion
};
