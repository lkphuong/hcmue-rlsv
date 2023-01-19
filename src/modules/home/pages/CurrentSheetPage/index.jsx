import { useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

import { ListSheets } from '_modules/home/components';

import { isSuccess } from '_func/';

import { getCurrentStudentSheet } from '_api/sheets.api';

const CurrentSheetPage = () => {
	//#region Data
	const { username } = useSelector((state) => state.auth.profile, shallowEqual);

	const [data, setData] = useState();
	//#endregion

	//#region Event
	const getData = async () => {
		const res = await getCurrentStudentSheet(username);

		if (isSuccess(res)) setData(res?.data);
	};
	//#endregion

	useEffect(() => {
		if (username) getData();
	}, [username]);

	//#region Render
	return data?.length > 0 ? (
		<Box>
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						{`Phiếu chấm điểm rèn luyện ${data[0]?.semester?.name} - Năm học ${data[0]?.academic?.name}`}
					</Typography>
				</Paper>
			</Box>

			<ListSheets data={data} />
		</Box>
	) : (
		<Paper className='paper-wrapper'>
			<Typography fontSize={20} p={1.5} fontWeight={600}>
				Hiện tại không có phiếu điểm cần chấm
			</Typography>
		</Paper>
	);
	//#endregion
};

export default CurrentSheetPage;
