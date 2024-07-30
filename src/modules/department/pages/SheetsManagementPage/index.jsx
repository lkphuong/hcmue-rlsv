import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';

import { CPagination } from '_controls/';

import { ListClasses } from '_modules/department/components';

import { getDepartmentSheets } from '_api/sheets.api';

import { CLoadingSpinner } from '_others/';

import { actions } from '_slices/currentInfo.slice';

import { formatTimeSemester, isSuccess, cleanObjValue } from '_func/index';

const SheetsManagementPage = () => {
	//#region Data
	const { department_id } = useSelector((state) => state.auth.profile, shallowEqual);

	const [loading, setLoading] = useState(false);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.data?.class || [], [data]);

	const [filter, setFilter] = useState({
		page: 1,
		pages: 0,
		department_id,
	});

	const [paginate, setPaginate] = useState({ page: 1, pages: 0 });

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
		setLoading(true);

		try {
			const _filter = cleanObjValue(filter);

			const res = await getDepartmentSheets(_filter);

			if (isSuccess(res)) setData(res.data);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const onPageChange = (event, newPage) => setFilter((prev) => ({ ...prev, page: newPage }));

	const handleSetCurrent = (classData) => {
		const info = {
			academic: data?.data?.academic,
			semester: data?.data?.semester,
			...classData,
		};

		dispatch(actions.setInfo(info));
	};
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
	return loading ? (
		<Box height='100%' display='flex' alignItems='center' justifyContent='center'>
			<CLoadingSpinner />
		</Box>
	) : data?.data ? (
		<Box>
			<Typography fontWeight={700} fontSize={25} lineHeight='30px' textAlign='center' mb={4}>
				{`${data?.data?.semester?.name} (${formatTimeSemester(
					data?.data?.semester?.start
				)}-${formatTimeSemester(data?.data?.semester?.end)}) - Năm học ${
					data?.data?.academic?.name
				}`}
			</Typography>

			<ListClasses data={listData} onSetCurrent={handleSetCurrent} />

			<CPagination page={paginate.page} pages={paginate.pages} onChange={onPageChange} />
		</Box>
	) : (
		<></>
	);

	//#endregion
};

export default SheetsManagementPage;
