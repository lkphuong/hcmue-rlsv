import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Box, Typography } from '@mui/material';

import { CPagination } from '_controls/';

import { ListDepartments, MFilter } from '_modules/sheets/components';

import { getAdminSheets } from '_api/sheets.api';

import { isSuccess, cleanObjValue, formatTimeSemester } from '_func/';

import { actions } from '_slices/currentInfo.slice';

const SheetsManagementPage = () => {
	//#region Data
	const [data, setData] = useState();

	const listData = useMemo(() => data?.data?.department || [], [data]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		department_id: '',
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
		const _filter = cleanObjValue(filter);

		const res = await getAdminSheets(_filter);

		if (isSuccess(res)) setData(res.data);
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));

	const handleSetCurrent = (additionalData) => {
		const info = {
			academic: data?.data?.academic,
			semester: data?.data?.semester,
			...additionalData,
		};

		dispatch(actions.setInfo(info));
	};
	//#endregion

	useEffect(() => {
		getData();
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
			<MFilter filter={filter} onFilterChange={setFilter} />

			{data && (
				<>
					<Typography
						fontWeight={700}
						fontSize={25}
						lineHeight='30px'
						textAlign='center'
						mb={4}
					>
						{`${data?.data?.semester?.name} (${formatTimeSemester(
							data?.data?.semester?.start
						)} - ${formatTimeSemester(data?.data?.semester?.end)}) - Năm học ${
							data?.data?.academic?.name
						}`}
					</Typography>

					<ListDepartments data={listData} onSetCurrent={handleSetCurrent} />

					<CPagination
						page={paginate.page}
						pages={paginate.pages}
						onChange={onPageChange}
					/>
				</>
			)}
		</Box>
	);

	//#endregion
};

export default SheetsManagementPage;
