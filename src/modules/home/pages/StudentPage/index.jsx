import React, { useCallback, useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';

import { ListSemester } from '_modules/home/components';

import { getStudentSheets } from '_api/sheets.api';

import { isSuccess } from '_func/';

const SemestersPage = () => {
	//#region Data
	const [data, setData] = useState([]);

	const { user_id } = useSelector((state) => state.auth.profile, shallowEqual);
	//#endregion

	//#region Event
	const getList = useCallback(async (id) => {
		try {
			const res = await getStudentSheets(id);

			if (isSuccess(res)) setData(res?.data);
		} catch (error) {
			console.log(error);
		}
	}, []);
	//#endregion

	useEffect(() => {
		if (user_id) getList(user_id);
	}, [getList, user_id]);

	//#region Render
	return (
		<Box>
			<Typography
				borderRadius={2}
				p={2}
				fontWeight={500}
				fontSize={18}
				sx={{ backgroundColor: 'rgba(0 0 0 / 5%)' }}
			>
				Danh sách điểm rèn luyện của tôi
			</Typography>

			<Box mt={1}>
				<ListSemester data={data} />
			</Box>
		</Box>
	);
	//#endregion
};

export default SemestersPage;
