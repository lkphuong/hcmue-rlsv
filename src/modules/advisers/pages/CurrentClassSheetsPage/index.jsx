import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';

import { MCurrentTable } from '_modules/advisers/components';

import { getCurrentClassSheet } from '_api/sheets.api';

import { formatTimeSemester, isSuccess } from '_func/index';

import { actions } from '_slices/currentInfo.slice';

const CurrentClassSheetsPage = () => {
	//#region Data
	const { department_id, class_ids } = useSelector((state) => state.auth.profile, shallowEqual);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.class || [], [data]);

	const dispatch = useDispatch();
	//#endregion

	//#region Event
	const getData = async () => {
		const body = { department_id, class_ids };

		const res = await getCurrentClassSheet(body);

		if (isSuccess(res)) setData(res.data);
	};

	const handleSetCurrent = (classData) => {
		const info = {
			academic: data?.academic,
			semester: data?.semester,
			...classData,
		};

		dispatch(actions.setInfo(info));
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [department_id, class_ids]);

	//#region Render
	return (
		<Box>
			<Typography textAlign='center' fontWeight={700} fontSize={25} lineHeight='30px' mb={1.5}>
				{!!data?.semester &&
					!!data?.academic &&
					`${data?.semester?.name} (${formatTimeSemester(
						data?.semester?.start
					)}-${formatTimeSemester(data?.semester?.end)}) - Năm học ${data?.academic?.name}`}
			</Typography>

			<MCurrentTable data={listData} onSetCurrent={handleSetCurrent} />
		</Box>
	);
	//#endregion
};

export default CurrentClassSheetsPage;
