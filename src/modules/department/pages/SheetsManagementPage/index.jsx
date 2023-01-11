import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';

import { CPagination } from '_controls/';

import { ListClasses } from '_modules/department/components';

import { getDepartmentSheets } from '_api/sheets.api';

import { isSuccess, cleanObjValue } from '_func/';

const SheetsManagementPage = () => {
	//#region Data
	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data || [], [data]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		department_id,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });
	//#endregion

	//#region Event
	const getData = async () => {
		const _filter = cleanObjValue(filter);

		const res = await getDepartmentSheets(_filter);

		if (isSuccess(res)) setData(res.data);
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));
	//#endregion

	useEffect(() => {
		if (department_id) getData();
	}, [filter]);

	useEffect(() => {
		setPaginate({
			page: data?.page || 1,
			pages: data?.pages || 0,
		});
	}, [data]);

	//#region Render
	return (
		<Box>
			<Typography fontWeight={700} fontSize={25} lineHeight='30px' textAlign='center' mb={4}>
				Học kỳ II ( 06/2021-09/2021) - Năm học 2021-2022
			</Typography>

			<ListClasses data={listData} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	);

	//#endregion
};

export default SheetsManagementPage;
