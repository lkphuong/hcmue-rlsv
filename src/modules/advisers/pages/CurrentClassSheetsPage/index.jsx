import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';

import dayjs from 'dayjs';

import { MCurrentTable } from '_modules/advisers/components';

import { getCurrentClassSheet } from '_api/sheets.api';

import { isSuccess } from '_func/index';

const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');

const CurrentClassSheetsPage = () => {
	//#region Data
	const { department_id, class_ids } = useSelector((state) => state.auth.profile, shallowEqual);

	const [data, setData] = useState();

	const listData = useMemo(() => data?.class || [], [data]);
	//#endregion

	//#region Event
	const getData = async () => {
		const body = { department_id, class_ids };

		const res = await getCurrentClassSheet(body);

		if (isSuccess(res)) setData(res.data);
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [department_id, class_ids]);

	//#region Render
	return (
		<Box>
			<Typography
				textAlign='center'
				fontWeight={700}
				fontSize={25}
				lineHeight='30px'
				mb={1.5}
			>
				{`${data?.semester?.name} (${formatDate(data?.semester?.start)}-${formatDate(
					data?.semester?.end
				)}) - Năm học ${data?.academic?.name}`}
			</Typography>

			<MCurrentTable data={listData} />
		</Box>
	);
	//#endregion
};

export default CurrentClassSheetsPage;
