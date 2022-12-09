import React, { useCallback, useEffect, useState } from 'react';

import { shallowEqual, useSelector } from 'react-redux';

import { Box, Paper, Typography } from '@mui/material';

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
			<Box mb={1.5}>
				<Paper className='paper-wrapper'>
					<Typography fontSize={20} p={1.5} fontWeight={600}>
						Danh sách điểm rèn luyện của tôi
					</Typography>
				</Paper>
			</Box>

			<ListSemester data={data} />
		</Box>
	);
	//#endregion
};

export default SemestersPage;
